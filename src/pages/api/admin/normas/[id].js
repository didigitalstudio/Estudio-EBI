import { env } from 'cloudflare:workers';
import { handleAdminNormas } from '../../../../lib/normas.js';

export const prerender = false;

export const ALL = ({ request, params }) => handleAdminNormas(request, env, params.id);
