import { env } from 'cloudflare:workers';
import { cached } from '../../lib/http.js';
import { getResenas } from '../../lib/resenas.js';

export const prerender = false;

export const GET = ({ request, locals }) => cached(request, 3600, () => getResenas(env), (p) => locals.cfContext?.waitUntil(p));
