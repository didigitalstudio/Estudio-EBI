import { cached } from '../../lib/http.js';
import { getNoticias } from '../../lib/noticias.js';

export const prerender = false;

// 30 minutos en la caché del borde
export const GET = ({ request, locals }) => cached(request, 1800, () => getNoticias(), (p) => locals.cfContext?.waitUntil(p));
