export const prerender = false;

// En la dirección de prueba (*.workers.dev) no dejamos indexar nada, para que Google no la
// tome como duplicado del dominio final. En el dominio propio se permite todo menos el panel y la API,
// y se invita de forma explícita a los buscadores con IA (GEO): ChatGPT, Perplexity, Claude, Gemini, etc.
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot', 'Applebot-Extended',
  'Bingbot', 'DuckAssistBot', 'meta-externalagent', 'MistralAI-User',
];
const RULES = 'Allow: /\nDisallow: /admin\nDisallow: /api/\n';

export function GET({ url }) {
  const body = url.hostname.endsWith('.workers.dev')
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\n${RULES}\n${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}\n${RULES}\nSitemap: ${new URL('/sitemap.xml', url.origin).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
}
