// Respuestas JSON y caché del borde (Cache API de Cloudflare) para los endpoints.
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

// Guarda la respuesta `ttl` segundos en la caché del datacenter. Fuera de Cloudflare (tests) no cachea.
export async function cached(request, ttl, produce, waitUntil) {
  const cache = globalThis.caches?.default;
  if (!cache) return produce();
  const key = new Request(new URL(request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = await produce();
  if (res.ok) {
    res.headers.set('Cache-Control', `public, max-age=${ttl}`);
    const put = cache.put(key, res.clone());
    if (waitUntil) waitUntil(put);
    else await put;
  }
  return res;
}
