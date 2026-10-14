import { env } from 'cloudflare:workers';
import { LANGS, localePath } from '../i18n/index.js';
import { listPublished } from '../lib/articulos.js';

export const prerender = false;

const PAGES = ['/', '/empresas'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Sitemap con las páginas en cada idioma (con sus alternativas) y las publicaciones
export async function GET({ url }) {
  const abs = (p) => esc(new URL(p, url.origin).href);
  const entries = PAGES.flatMap((page) => LANGS.map(({ code }) => {
    const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${abs(localePath(l.code, page))}"/>`).join('');
    return `<url><loc>${abs(localePath(code, page))}</loc>${alts}</url>`;
  }));
  entries.push(`<url><loc>${abs('/actualidad')}</loc></url>`);
  try {
    for (const a of await listPublished(env.DB, { limit: 500 })) {
      entries.push(`<url><loc>${abs(`/actualidad/${a.slug}`)}</loc><lastmod>${a.publicado_en.slice(0, 10)}</lastmod></url>`);
    }
  } catch (e) {
    console.error('sitemap', e);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
