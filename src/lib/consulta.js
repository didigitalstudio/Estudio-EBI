import { json } from './http.js';

// Arma el email de una consulta del formulario. Si faltan datos devuelve { error }.
const MAX = { nombre: 120, empresa: 160, email: 200, tel: 40, pais: 80, tipo: 80, pagina: 120 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IDIOMAS = { en: 'Inglés', pt: 'Portugués', zh: 'Chino', ru: 'Ruso' };

// Campos de una línea: sin saltos ni espacios repetidos, así no se cuelan en el asunto.
function line(value, max) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

// WhatsApp con código de país: al menos 8 dígitos y solo los signos habituales de un teléfono
const telOk = (v) => /^\+?[\d\s().-]{6,24}$/.test(v) && v.replace(/\D/g, '').length >= 8;

// Persona: nombre y al menos un medio de contacto (correo o WhatsApp). Empresa: nombre de la empresa, persona
// de contacto y correo. En los dos casos, la consulta.
export function buildInquiry(body = {}) {
  const d = {};
  for (const [field, max] of Object.entries(MAX)) d[field] = line(body[field], max);
  const msg = typeof body.msg === 'string' ? body.msg.trim().slice(0, 4000) : '';
  const company = body.perfil === 'empresa';
  const idioma = IDIOMAS[body.lang];

  if (company && !d.empresa) return { error: 'Falta el nombre de la empresa' };
  if (!d.nombre || !msg) return { error: 'Faltan el nombre o la consulta' };
  if (company && !EMAIL.test(d.email)) return { error: 'El email no es válido' };
  if (!d.email && !d.tel) return { error: 'Falta un medio de contacto' };
  if (d.email && !EMAIL.test(d.email)) return { error: 'El email no es válido' };
  if (d.tel && !telOk(d.tel)) return { error: 'El WhatsApp no es válido' };

  const rows = [
    ['Perfil', company ? 'Empresa' : 'Persona'],
    ...(company ? [['Empresa', d.empresa], ['Contacto', d.nombre]] : [['Nombre', d.nombre], ['Nacionalidad', d.pais]]),
    ['Email', d.email],
    ['WhatsApp', d.tel],
    ['Consulta', d.tipo],
    ['Idioma', idioma ? `${idioma} (la consulta llegó desde la versión en ${idioma.toLowerCase()})` : 'Español'],
    ['Página', d.pagina],
  ].filter(([, value]) => value);

  return {
    subject: `Consulta web: ${d.tipo || 'General'} · ${company ? d.empresa : d.nombre}`,
    text: `${rows.map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n${msg}\n`,
    replyTo: d.email,
  };
}

// Señales de envío automático: el campo trampa completo, el formulario mandado en menos de 3 segundos desde
// que se abrió la página o un mensaje lleno de links. A esos se les responde ok sin mandar nada.
export function looksAutomated(body) {
  if (body.website) return true;
  if (typeof body.t === 'number' && body.t < 3000) return true;
  const links = typeof body.msg === 'string' ? body.msg.match(/https?:\/\/|www\./gi) : null;
  return Boolean(links && links.length > 3);
}

// Consultas del formulario por email, con Resend.
// Requiere RESEND_API_KEY y CONSULTAS_EMAIL. Sin eso la página ofrece solo WhatsApp.
export async function handleConsulta(request, env, fetchImpl = fetch) {
  const key = env.RESEND_API_KEY;
  const to = env.CONSULTAS_EMAIL;
  const configured = Boolean(key && to);

  // La página pregunta al cargar si el envío por email está activo
  if (request.method === 'GET') return json({ configured });
  const noStore = { 'Cache-Control': 'no-store' };
  if (request.method !== 'POST') return json({ error: 'Método no permitido' }, 405, { ...noStore, Allow: 'GET, POST' });
  // Solo se aceptan envíos desde el propio sitio (los navegadores mandan Origin en los POST)
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Origen no permitido' }, 403, noStore);
  if (!configured) return json({ configured: false }, 503, noStore);

  let body = null;
  try {
    body = await request.json();
  } catch {
    // JSON mal formado
  }
  if (!body || typeof body !== 'object') return json({ error: 'Consulta inválida' }, 400, noStore);
  if (looksAutomated(body)) return json({ ok: true }, 200, noStore);

  const inquiry = buildInquiry(body);
  if (inquiry.error) return json({ error: inquiry.error }, 400, noStore);

  try {
    const r = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONSULTAS_FROM || 'Web Estudio EBI <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        ...(inquiry.replyTo ? { reply_to: inquiry.replyTo } : {}),
        subject: inquiry.subject,
        text: inquiry.text,
      }),
    });
    if (!r.ok) throw new Error(`resend ${r.status}`);
    return json({ ok: true }, 200, noStore);
  } catch (e) {
    return json({ error: 'No se pudo enviar la consulta' }, 502, noStore);
  }
}
