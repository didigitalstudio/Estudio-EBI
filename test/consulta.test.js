import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildInquiry } from '../api/_consulta.js';
import handler from '../api/consulta.js';

const persona = { perfil: 'persona', nombre: 'Ana Pérez', email: 'ana@mail.com', tipo: 'Residencia', msg: 'Necesito renovar mi residencia', lang: 'es' };

function mockRes() {
  return {
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function setEnv(t, vars) {
  const prev = {};
  for (const [k, v] of Object.entries(vars)) {
    prev[k] = process.env[k];
    if (v == null) delete process.env[k];
    else process.env[k] = v;
  }
  t.after(() => {
    for (const [k, v] of Object.entries(prev)) {
      if (v == null) delete process.env[k];
      else process.env[k] = v;
    }
  });
}

test('arma asunto y cuerpo de la consulta de una persona', () => {
  const c = buildInquiry({ ...persona, pais: 'Perú', tel: '+51 999 111' });
  assert.equal(c.subject, 'Consulta web: Residencia · Ana Pérez');
  assert.equal(c.replyTo, 'ana@mail.com');
  assert.equal(c.text, 'Perfil: Persona\nNombre: Ana Pérez\nNacionalidad: Perú\nEmail: ana@mail.com\nWhatsApp: +51 999 111\nConsulta: Residencia\nIdioma: Español\n\nNecesito renovar mi residencia\n');
});

test('suma los datos de la empresa y avisa si hay que responder en inglés', () => {
  const c = buildInquiry({ ...persona, perfil: 'empresa', empresa: 'Acme SA', cargo: 'HR Manager', personas: '2 a 5', tipo: 'Inscripción en el RENURE', lang: 'en' });
  assert.equal(c.subject, 'Consulta web: Inscripción en el RENURE · Acme SA');
  assert.match(c.text, /^Perfil: Empresa\nNombre: Ana Pérez\nEmpresa: Acme SA\nCargo: HR Manager\nPersonas: 2 a 5\n/);
  assert.match(c.text, /Idioma: Inglés \(responder en inglés\)/);
});

test('rechaza consultas incompletas o sin email válido', () => {
  assert.ok(buildInquiry({ ...persona, nombre: '  ' }).error);
  assert.ok(buildInquiry({ ...persona, msg: '' }).error);
  assert.ok(buildInquiry({ ...persona, email: 'ana@' }).error);
  assert.ok(buildInquiry({ ...persona, perfil: 'empresa' }).error);
  assert.ok(buildInquiry().error);
});

test('no deja pasar saltos de línea al asunto', () => {
  const c = buildInquiry({ ...persona, nombre: 'Ana\r\nBcc: otro@mail.com' });
  assert.equal(c.subject, 'Consulta web: Residencia · Ana Bcc: otro@mail.com');
});

test('sin configurar, la página sigue con WhatsApp', async (t) => {
  setEnv(t, { RESEND_API_KEY: null, CONSULTAS_EMAIL: null });
  const get = mockRes();
  await handler({ method: 'GET' }, get);
  assert.deepEqual(get.body, { configured: false });
  const post = mockRes();
  await handler({ method: 'POST', body: persona }, post);
  assert.equal(post.code, 503);
});

test('manda la consulta a Resend con respuesta a quien consultó', async (t) => {
  setEnv(t, { RESEND_API_KEY: 'test', CONSULTAS_EMAIL: 'estudio@mail.com, socio@mail.com', CONSULTAS_FROM: null });
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, opts) => {
    calls.push({ url, headers: opts.headers, body: JSON.parse(opts.body) });
    return { ok: true, status: 200 };
  });
  const res = mockRes();
  await handler({ method: 'POST', body: persona }, res);
  assert.equal(res.code, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].headers.Authorization, 'Bearer test');
  assert.deepEqual(calls[0].body.to, ['estudio@mail.com', 'socio@mail.com']);
  assert.equal(calls[0].body.reply_to, 'ana@mail.com');
  assert.equal(calls[0].body.subject, 'Consulta web: Residencia · Ana Pérez');
});

test('ignora a los bots que completan el campo trampa', async (t) => {
  setEnv(t, { RESEND_API_KEY: 'test', CONSULTAS_EMAIL: 'estudio@mail.com' });
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => ({ ok: true, status: 200 }));
  const res = mockRes();
  await handler({ method: 'POST', body: { ...persona, website: 'http://spam.example' } }, res);
  assert.equal(res.code, 200);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('responde 400 si faltan datos y 502 si Resend falla', async (t) => {
  setEnv(t, { RESEND_API_KEY: 'test', CONSULTAS_EMAIL: 'estudio@mail.com' });
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 500 }));
  const bad = mockRes();
  await handler({ method: 'POST', body: { ...persona, email: '' } }, bad);
  assert.equal(bad.code, 400);
  const down = mockRes();
  await handler({ method: 'POST', body: persona }, down);
  assert.equal(down.code, 502);
});
