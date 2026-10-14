import { env } from 'cloudflare:workers';
import { handleAdmin } from '../../../../lib/articulos.js';

export const prerender = false;

export const ALL = ({ request, params }) => handleAdmin(request, env, params.id);
