import { json } from './http.js';

// Arma el email de una consulta del formulario. Si faltan datos devuelve { error }.
const MAX = { nombre: 120, empresa: 160, cargo: 120, email: 200, tel: 40, pais: 80, personas: 40, tipo: 80, pagina: 120 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IDIOMAS = { en: 'Inglés', pt: 'Portugués', zh: 'Chino', ru: 'Ruso' };

// Campos de una línea: sin saltos ni espacios repetidos, así no se cuelan en el asunto.
function line(value, max) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

export function buildInquiry(body = {}) {
  const d = {};
  for (const [field, max] of Object.entries(MAX)) d[field] = line(body[field], max);
  const msg = typeof body.msg === 'string' ? body.msg.trim().slice(0, 4000) : '';
  const company = body.perfil === 'empresa';
  const idioma = IDIOMAS[body.lang];

  if (!d.nombre || !msg) return { error: 'Faltan el nombre o la consulta' };
  if (!EMAIL.test(d.email)) return { error: 'El email no es válido' };
  if (company && !d.empresa) return { error: 'Falta el nombre de la empresa' };

  const rows = [
    ['Perfil', company ? 'Empresa' : 'Persona'],
    ['Nombre', d.nombre],
    ...(company ? [['Empresa', d.empresa], ['Cargo', d.cargo], ['Personas', d.personas]] : []),
    ['Nacionalidad', d.pais],
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

// Consultas del formulario por email, con Resend.
// Requiere RESEND_API_KEY y CONSULTAS_EMAIL. Sin eso la página manda la consulta por WhatsApp.
export async function handleConsulta(request, env, fetchImpl = fetch) {
  const key = env.RESEND_API_KEY;
  const to = env.CONSULTAS_EMAIL;
  const configured = Boolean(key && to);

  // La página pregunta al cargar si el envío por email está activo
  if (request.method === 'GET') return json({ configured });
  const noStore = { 'Cache-Control': 'no-store' };
  if (request.method !== 'POST') return json({ error: 'Método no permitido' }, 405, { ...noStore, Allow: 'GET, POST' });
  if (!configured) return json({ configured: false }, 503, noStore);

  let body = null;
  try {
    body = await request.json();
  } catch {
    // JSON mal formado
  }
  if (!body || typeof body !== 'object') return json({ error: 'Consulta inválida' }, 400, noStore);
  // Campo trampa: las personas no lo ven, los bots lo completan. Respondemos ok sin enviar nada.
  if (body.website) return json({ ok: true }, 200, noStore);

  const inquiry = buildInquiry(body);
  if (inquiry.error) return json({ error: inquiry.error }, 400, noStore);

  try {
    const r = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONSULTAS_FROM || 'Web Estudio EBI <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: inquiry.replyTo,
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
