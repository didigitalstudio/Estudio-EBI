import { cached } from '../../lib/http.js';
import { getNoticias } from '../../lib/noticias.js';

export const prerender = false;

// La última respuesta buena se guarda 7 días aparte: si Google News falla, se muestra esa en lugar de nada.
const LAST = 'https://estudioebi.internal/noticias-ultima';

async function withLastGood(produce, waitUntil) {
  const cache = globalThis.caches?.default;
  const res = await produce();
  if (!cache) return res;
  if (res.ok) {
    const copy = res.clone();
    copy.headers.set('Cache-Control', 'public, max-age=604800');
    const put = cache.put(new Request(LAST), copy);
    if (waitUntil) waitUntil(put);
    return res;
  }
  const last = await cache.match(new Request(LAST));
  if (!last) return res;
  return new Response(last.body, { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}

// 30 minutos en la caché del borde
export const GET = ({ request, locals }) => {
  const waitUntil = (p) => locals.cfContext?.waitUntil(p);
  return cached(request, 1800, () => withLastGood(() => getNoticias(), waitUntil), waitUntil);
};
