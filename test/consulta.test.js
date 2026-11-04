import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildInquiry, handleConsulta } from '../src/lib/consulta.js';

const persona = { perfil: 'persona', nombre: 'Ana Pérez', email: 'ana@mail.com', tipo: 'Residencia', msg: 'Necesito renovar mi residencia', lang: 'es' };
const env = { RESEND_API_KEY: 'test', CONSULTAS_EMAIL: 'estudio@mail.com, socio@mail.com' };
const post = (body) => new Request('https://ebi.test/api/consulta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('arma asunto y cuerpo de la consulta de una persona', () => {
  const c = buildInquiry({ ...persona, pais: 'Perú', tel: '+51 999 111', pagina: '/estudiantes' });
  assert.equal(c.subject, 'Consulta web: Residencia · Ana Pérez');
  assert.equal(c.replyTo, 'ana@mail.com');
  assert.equal(c.text, 'Perfil: Persona\nNombre: Ana Pérez\nNacionalidad: Perú\nEmail: ana@mail.com\nWhatsApp: +51 999 111\nConsulta: Residencia\nIdioma: Español\nPágina: /estudiantes\n\nNecesito renovar mi residencia\n');
});

test('suma los datos de la empresa y avisa en qué idioma llegó', () => {
  const c = buildInquiry({ ...persona, perfil: 'empresa', empresa: 'Acme SA', pais: 'Perú', tipo: 'Inscripción y actualización en RENURE', lang: 'pt' });
  assert.equal(c.subject, 'Consulta web: Inscripción y actualización en RENURE · Acme SA');
  assert.match(c.text, /^Perfil: Empresa\nEmpresa: Acme SA\nContacto: Ana Pérez\nEmail: ana@mail.com\n/);
  assert.doesNotMatch(c.text, /Nacionalidad/);
  assert.match(c.text, /Idioma: Portugués \(la consulta llegó desde la versión en portugués\)/);
});

test('una persona puede dejar solo el WhatsApp; una empresa necesita el correo', () => {
  const c = buildInquiry({ ...persona, email: '', tel: '+54 9 11 5555-1234' });
  assert.equal(c.error, undefined);
  assert.equal(c.replyTo, '');
  assert.match(c.text, /WhatsApp: \+54 9 11 5555-1234/);
  assert.ok(buildInquiry({ ...persona, email: '', tel: '' }).error);
  assert.ok(buildInquiry({ ...persona, email: '', tel: '123' }).error);
  assert.ok(buildInquiry({ ...persona, perfil: 'empresa', empresa: 'Acme SA', email: '', tel: '+54 9 11 5555-1234' }).error);
});

test('rechaza consultas incompletas o con datos de contacto inválidos', () => {
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

test('sin configurar, la página sigue con WhatsApp', async () => {
  const get = await handleConsulta(new Request('https://ebi.test/api/consulta'), {});
  assert.deepEqual(await get.json(), { configured: false });
  const res = await handleConsulta(post(persona), {});
  assert.equal(res.status, 503);
});

test('manda la consulta a Resend con respuesta a quien consultó', async () => {
  const calls = [];
  const fetchMock = async (url, opts) => {
    calls.push({ url, headers: opts.headers, body: JSON.parse(opts.body) });
    return new Response('{}', { status: 200 });
  };
  const res = await handleConsulta(post(persona), env, fetchMock);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].headers.Authorization, 'Bearer test');
  assert.deepEqual(calls[0].body.to, ['estudio@mail.com', 'socio@mail.com']);
  assert.equal(calls[0].body.from, 'Web Estudio EBI <onboarding@resend.dev>');
  assert.equal(calls[0].body.reply_to, 'ana@mail.com');
  assert.equal(calls[0].body.subject, 'Consulta web: Residencia · Ana Pérez');
});

test('ignora a los bots: campo trampa, envío instantáneo o mensaje lleno de links', async () => {
  let called = 0;
  const count = async () => { called++; return new Response('{}'); };
  for (const body of [
    { ...persona, website: 'http://spam.example' },
    { ...persona, t: 800 },
    { ...persona, msg: 'https://a.example https://b.example www.c.example http://d.example' },
  ]) assert.equal((await handleConsulta(post(body), env, count)).status, 200);
  assert.equal(called, 0);
  assert.equal((await handleConsulta(post({ ...persona, t: 25000 }), env, count)).status, 200);
  assert.equal(called, 1);
});

test('rechaza envíos desde otro sitio', async () => {
  const req = new Request('https://ebi.test/api/consulta', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://otro.example' }, body: JSON.stringify(persona) });
  assert.equal((await handleConsulta(req, env, async () => new Response('{}'))).status, 403);
  const same = new Request('https://ebi.test/api/consulta', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://ebi.test' }, body: JSON.stringify(persona) });
  assert.equal((await handleConsulta(same, env, async () => new Response('{}'))).status, 200);
});

test('sin correo, la consulta llega sin dirección de respuesta', async () => {
  let sent = null;
  await handleConsulta(post({ ...persona, email: '', tel: '+54 9 11 5555-1234' }), env, async (url, opts) => { sent = JSON.parse(opts.body); return new Response('{}'); });
  assert.equal(sent.reply_to, undefined);
});

test('responde 400 si faltan datos o el JSON está roto, y 502 si Resend falla', async () => {
  const down = async () => new Response('{}', { status: 500 });
  assert.equal((await handleConsulta(post({ ...persona, email: '' }), env, down)).status, 400);
  const broken = new Request('https://ebi.test/api/consulta', { method: 'POST', body: '{nope' });
  assert.equal((await handleConsulta(broken, env, down)).status, 400);
  assert.equal((await handleConsulta(post(persona), env, down)).status, 502);
});
