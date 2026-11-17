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

  const subject = `Consulta web: ${d.tipo || 'General'} · ${company ? d.empresa : d.nombre}`;
  return {
    subject,
    text: `${rows.map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n${msg}\n`,
    html: inquiryHtml({ rows, msg, email: d.email, tel: d.tel, nombre: d.nombre, tipo: d.tipo || 'General' }),
    replyTo: d.email,
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Versión HTML del email (la de texto va igual, para los clientes de correo que no muestran HTML).
// Tablas y estilos en línea porque Gmail y Outlook no respetan otra cosa.
function inquiryHtml({ rows, msg, email, tel, nombre, tipo }) {
  const digits = tel ? tel.replace(/\D/g, '') : '';
  const btn = (href, label, fill) => `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;${fill ? 'background:#123F2F;color:#ffffff' : 'border:1.5px solid #123F2F;color:#123F2F'}">${label}</a>`;
  const actions = [
    digits ? btn(`https://wa.me/${digits}?text=${encodeURIComponent(`Hola ${nombre}, te escribimos del Estudio EBI por tu consulta (${tipo}).`)}`, 'Responder por WhatsApp', true) : '',
    email ? btn(`mailto:${email}?subject=${encodeURIComponent(`Re: tu consulta al Estudio EBI (${tipo})`)}`, 'Responder por correo', !digits) : '',
  ].join('');
  const trs = rows.map(([k, v]) => `<tr><td width="1%" style="padding:8px 20px 8px 0;color:#6B5430;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;color:#1E2A24;font-size:15px">${esc(v)}</td></tr>`).join('');
  return `<!doctype html><html lang="es"><body style="margin:0;background:#F4F0E6;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0E6;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E4DCCB">
<tr><td style="background:#123F2F;padding:20px 24px;color:#F4F0E6"><div style="font-family:Georgia,serif;font-size:20px;font-weight:bold">Estudio EBI</div><div style="font-size:13px;color:#E2CB9B;letter-spacing:.08em;text-transform:uppercase;margin-top:4px">Nueva consulta desde la web</div></td></tr>
<tr><td style="padding:24px"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${trs}</table>
<div style="margin:20px 0 8px;color:#6B5430;font-size:13px">Mensaje</div>
<div style="background:#F8F5EE;border-left:3px solid #C9A86B;border-radius:4px;padding:14px 16px;color:#1E2A24;font-size:15px;line-height:1.55;white-space:pre-wrap">${esc(msg)}</div>
${actions ? `<div style="margin-top:22px">${actions}</div>` : ''}
</td></tr>
<tr><td style="padding:14px 24px;border-top:1px solid #E4DCCB;color:#6E6A60;font-size:12px">${email ? 'Si respondés este correo, la respuesta le llega directamente a quien consultó.' : 'La persona no dejó correo: respondé por WhatsApp.'}</td></tr>
</table></td></tr></table></body></html>`;
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
        html: inquiry.html,
      }),
    });
    if (!r.ok) throw new Error(`resend ${r.status}`);
    return json({ ok: true }, 200, noStore);
  } catch (e) {
    return json({ error: 'No se pudo enviar la consulta' }, 502, noStore);
  }
}
