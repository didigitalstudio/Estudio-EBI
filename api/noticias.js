import { parseRss } from './_rss.js';

const QUERY = '("Dirección Nacional de Migraciones" OR "ley de migraciones" OR "política migratoria" OR "residencia" migrantes OR "ciudadanía argentina" extranjeros) Argentina when:30d';
const FEED = `https://news.google.com/rss/search?q=${encodeURIComponent(QUERY)}&hl=es-419&gl=AR&ceid=AR:es-419`;

export default async function handler(req, res) {
  try {
    const r = await fetch(FEED, { headers: { 'User-Agent': 'Mozilla/5.0 (EstudioEBI)' } });
    if (!r.ok) throw new Error(`feed ${r.status}`);
    const items = parseRss(await r.text(), { limit: 6 });
    // 30 min fresco en la CDN; si el feed falla se sigue sirviendo lo último hasta 1 día
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    res.status(200).json({ items });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ items: [], error: 'No se pudieron obtener las noticias' });
  }
}
