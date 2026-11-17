// /llms.txt: resumen del estudio en texto plano para buscadores y asistentes con IA (GEO). Sigue la
// propuesta de llmstxt.org: título, descripción breve y secciones con enlaces. Se arma en el build con los
// mismos textos del sitio (es.js), así queda siempre alineado con lo que se publica.
import es from '../i18n/es.js';
import { LANGS, localePath } from '../i18n/index.js';
import { SITIO } from '../data/sitio.js';

export const prerender = true;

const strip = (s = '') => String(s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const list = (v) => (Array.isArray(v) ? v : [v]).filter(Boolean).map(strip);

export function GET({ site }) {
  const abs = (p) => new URL(p, site).href;
  const t = es;
  const emp = t.pages.empresas;
  const out = [];
  out.push('# Estudio EBI');
  out.push('');
  out.push(`> ${strip(t.hero.title)} con sede en Buenos Aires, Argentina. ${strip(t.hero.lead)}`);
  out.push('');
  out.push(...list(t.nosotros.lead), '');
  for (const p of list(t.nosotros.body)) out.push(p, '');
  out.push('Atención presencial y virtual, en español e inglés. Las consultas se reciben por el formulario del sitio, por correo o por WhatsApp.');
  out.push('');

  out.push('## Páginas');
  out.push(`- [Inicio](${abs('/')}): servicios para personas, familias y empresas, preguntas frecuentes y contacto.`);
  out.push(`- [Empresas](${abs('/empresas/')}): ${strip(t.meta.empresas.description)}`);
  out.push(`- [Quiénes somos](${abs('/quienes-somos/')}): ${strip(t.meta.quienes.description)}`);
  out.push(`- [Actualidad Migratoria](${abs('/actualidad')}): novedades normativas, jurisprudencia, análisis y normativa migratoria con enlace a las fuentes oficiales.`);
  out.push('');

  out.push('## Áreas de práctica');
  for (const a of t.servicios.areas) {
    out.push(`### ${strip(a.title)}`);
    out.push(strip(a.text));
    for (const i of a.items || []) out.push(`- ${strip(i)}`);
    out.push('');
  }

  out.push('## Empresas e instituciones');
  out.push(...list(emp.hero.lead));
  for (const b of emp.hero.bullets || []) out.push(`- ${strip(b)}`);
  out.push('');

  out.push('## Preguntas frecuentes');
  for (const f of [...t.faq.items, ...emp.faq]) {
    out.push(`### ${strip(f.q)}`);
    out.push(strip(f.a), '');
  }

  out.push('## Contacto');
  out.push(`- Formulario de consulta: ${abs('/#contacto')}`);
  if (SITIO.email) out.push(`- Correo: ${SITIO.email}`);
  for (const w of SITIO.whatsappLineas) out.push(`- WhatsApp: ${w.texto} (https://wa.me/${w.numero})`);
  for (const [n, u] of [['LinkedIn', SITIO.linkedin], ['Facebook', SITIO.facebook]]) if (u) out.push(`- ${n}: ${u}`);
  out.push('- Ubicación: Ciudad Autónoma de Buenos Aires, Argentina. Atención en todo el país y a personas en el exterior por videollamada.');
  out.push('');

  out.push('## Otros idiomas');
  for (const l of LANGS.filter((x) => x.code !== 'es')) out.push(`- [${l.name}](${abs(localePath(l.code, '/'))})`);
  out.push('');

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
