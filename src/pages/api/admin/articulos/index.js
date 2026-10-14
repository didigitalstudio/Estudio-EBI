import { env } from 'cloudflare:workers';
import { handleAdmin } from '../../../../lib/articulos.js';

export const prerender = false;

export const ALL = ({ request }) => handleAdmin(request, env);
