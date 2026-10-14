import { env } from 'cloudflare:workers';
import { json } from '../../lib/http.js';
import { listPublished } from '../../lib/articulos.js';

export const prerender = false;

// Últimos artículos publicados, para la sección Actualidad de las páginas
export async function GET({ url }) {
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 3, 1), 12);
  try {
    return json({ articulos: await listPublished(env.DB, { limit }) }, 200, { 'Cache-Control': 'public, max-age=60' });
  } catch (e) {
    return json({ articulos: [], error: 'No se pudieron obtener los artículos' }, 500, { 'Cache-Control': 'no-store' });
  }
}
