import { cached } from '../../lib/http.js';
import { getNoticias } from '../../lib/noticias.js';

export const prerender = false;

// Google News a veces rechaza los pedidos que salen de Cloudflare (503). La última respuesta buena se guarda 7 días aparte: si Google News falla, se muestra esa en lugar de nada.

// La clave tiene que ser del mismo dominio para que la Cache API de Cloudflare la guarde.
async function withLastGood(request, produce, waitUntil) {
  const cache = globalThis.caches?.default;
  const LAST = new URL('/api/noticias?ultima=1', request.url).href;
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
  return cached(request, 1800, () => withLastGood(request, () => getNoticias(), waitUntil), waitUntil);
};
