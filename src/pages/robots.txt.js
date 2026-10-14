export const prerender = false;

export const GET = ({ url }) =>
  new Response(`User-agent: *\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap.xml', url.origin).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
