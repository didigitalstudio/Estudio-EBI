export const prerender = false;

// En la dirección de prueba (*.workers.dev) no dejamos indexar nada, para que Google no la
// tome como duplicado del dominio final.
export function GET({ url }) {
  const body = url.hostname.endsWith('.workers.dev')
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap.xml', url.origin).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
}
