import { env } from 'cloudflare:workers';
import { json } from '../../lib/http.js';
import { listNormas } from '../../lib/normas.js';

export const prerender = false;

// Normativa migratoria para el inicio: las primeras normas con su enlace a la fuente oficial
export async function GET({ url }) {
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 4, 1), 20);
  try {
    const normas = (await listNormas(env.DB)).slice(0, limit).map(({ id, titulo, tipo, numero, fecha, url: link }) => ({ id, titulo, tipo, numero, fecha, url: link }));
    return json({ normas }, 200, { 'Cache-Control': 'public, max-age=300' });
  } catch (e) {
    return json({ normas: [], error: 'No se pudo obtener la normativa' }, 500, { 'Cache-Control': 'no-store' });
  }
}
