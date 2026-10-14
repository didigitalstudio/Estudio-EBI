import { env } from 'cloudflare:workers';
import { handleConsulta } from '../../lib/consulta.js';

export const prerender = false;

export const ALL = ({ request }) => handleConsulta(request, env);
