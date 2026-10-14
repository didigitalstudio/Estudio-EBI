// Arma el email de una consulta del formulario. Si faltan datos devuelve { error }.
const MAX = { nombre: 120, empresa: 160, cargo: 120, email: 200, tel: 40, pais: 80, personas: 40, tipo: 80 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Campos de una línea: sin saltos ni espacios repetidos, así no se cuelan en el asunto.
function line(value, max) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

export function buildInquiry(body = {}) {
  const d = {};
  for (const [field, max] of Object.entries(MAX)) d[field] = line(body[field], max);
  const msg = typeof body.msg === 'string' ? body.msg.trim().slice(0, 4000) : '';
  const company = body.perfil === 'empresa';

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
    ['Idioma', body.lang === 'en' ? 'Inglés (responder en inglés)' : 'Español'],
  ].filter(([, value]) => value);

  return {
    subject: `Consulta web: ${d.tipo || 'General'} · ${company ? d.empresa : d.nombre}`,
    text: `${rows.map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n${msg}\n`,
    replyTo: d.email,
  };
}
