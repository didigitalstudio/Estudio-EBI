import { parseRss } from './rss.js';
import { json } from './http.js';

const QUERY = '("Dirección Nacional de Migraciones" OR "ley de migraciones" OR "política migratoria" OR "residencia" migrantes OR "ciudadanía argentina" extranjeros) Argentina when:30d';
// Desde los servidores de Cloudflare, Google a veces responde 503 a la búsqueda compleja: si pasa, se prueba
// con una más simple antes de rendirse.
const QUERY_SIMPLE = 'migraciones Argentina residencia extranjeros';
const feedUrl = (q) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=es-419&gl=AR&ceid=AR:es-419`;
export const FEED = feedUrl(QUERY);
export const FEEDS = [FEED, feedUrl(QUERY_SIMPLE)];

// Últimas notas de Google News sobre migraciones en Argentina.
export async function getNoticias(fetchImpl = fetch) {
  const errors = [];
  for (const url of FEEDS) {
    try {
      const r = await fetchImpl(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EstudioEBI/1.0)', Accept: 'application/rss+xml, text/xml' } });
      if (!r.ok) throw new Error(`feed ${r.status}`);
      const items = parseRss(await r.text(), { limit: 6 });
      if (items.length) return json({ items });
      throw new Error('feed vacío');
    } catch (e) {
      errors.push(e?.message || String(e));
    }
  }
  console.error('noticias', errors.join(' | '));
  return json({ items: [], error: 'No se pudieron obtener las noticias' }, 502, { 'Cache-Control': 'no-store' });
}
