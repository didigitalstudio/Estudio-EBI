import { parseRss } from './rss.js';
import { json } from './http.js';

const QUERY = '("Dirección Nacional de Migraciones" OR "ley de migraciones" OR "política migratoria" OR "residencia" migrantes OR "ciudadanía argentina" extranjeros) Argentina when:30d';
export const FEED = `https://news.google.com/rss/search?q=${encodeURIComponent(QUERY)}&hl=es-419&gl=AR&ceid=AR:es-419`;

// Últimas notas de Google News sobre migraciones en Argentina.
export async function getNoticias(fetchImpl = fetch) {
  try {
    const r = await fetchImpl(FEED, { headers: { 'User-Agent': 'Mozilla/5.0 (EstudioEBI)' } });
    if (!r.ok) throw new Error(`feed ${r.status}`);
    return json({ items: parseRss(await r.text(), { limit: 6 }) });
  } catch (e) {
    return json({ items: [], error: 'No se pudieron obtener las noticias' }, 502, { 'Cache-Control': 'no-store' });
  }
}
