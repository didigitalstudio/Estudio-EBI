// Login del panel con Cloudflare Access. Access pide el código por email antes de dejar pasar a /admin
// y manda un JWT firmado en Cf-Access-Jwt-Assertion. Acá lo verificamos igual, por si alguien entra
// por otra URL del Worker que Access no cubre.
//
// Variables: ACCESS_TEAM_DOMAIN (ej. ebi.cloudflareaccess.com), ACCESS_AUD (Application Audience de la app)
// y opcional ADMIN_EMAILS (lista separada por comas). En local, DEV_ADMIN_EMAIL saltea el login solo en localhost.

import { json } from './http.js';

const jwksCache = new Map();
const JWKS_TTL = 60 * 60 * 1000;

function b64urlToBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function decodePart(s) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));
}

async function getKeys(team, fetchImpl) {
  const hit = jwksCache.get(team);
  if (hit && hit.until > Date.now()) return hit.keys;
  const r = await fetchImpl(`https://${team}/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error(`certs ${r.status}`);
  const { keys = [] } = await r.json();
  jwksCache.set(team, { keys, until: Date.now() + JWKS_TTL });
  return keys;
}

export async function verifyAccessJwt(token, { team, aud }, fetchImpl = fetch, now = Date.now()) {
  const parts = (token || '').split('.');
  if (parts.length !== 3) return null;
  try {
    const [h, p, s] = parts;
    const header = decodePart(h);
    const payload = decodePart(p);
    if (header.alg !== 'RS256') return null;
    const jwk = (await getKeys(team, fetchImpl)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(aud)) return null;
    if (payload.iss !== `https://${team}`) return null;
    if (!payload.exp || payload.exp * 1000 < now) return null;
    if (payload.nbf && payload.nbf * 1000 > now + 60_000) return null;
    return payload;
  } catch {
    return null;
  }
}

// Devuelve { email } si la request viene de un socio autorizado, o null.
export async function getAdmin(request, env, fetchImpl = fetch) {
  const host = new URL(request.url).hostname;
  if (env.DEV_ADMIN_EMAIL && (host === 'localhost' || host === '127.0.0.1')) return { email: env.DEV_ADMIN_EMAIL };

  const team = (env.ACCESS_TEAM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!team || !env.ACCESS_AUD) return null;
  const payload = await verifyAccessJwt(request.headers.get('Cf-Access-Jwt-Assertion'), { team, aud: env.ACCESS_AUD }, fetchImpl);
  const email = payload?.email?.toLowerCase();
  if (!email) return null;
  const allowed = (env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (allowed.length && !allowed.includes(email)) return null;
  return { email };
}

// Control común de la API del panel: login y, en escrituras, solo JSON desde el mismo sitio (un formulario
// de otro dominio no puede mandar esto). Devuelve { admin } o { response } con el error listo.
export async function adminGuard(request, env, fetchImpl = fetch) {
  const noStore = { 'Cache-Control': 'no-store' };
  const admin = await getAdmin(request, env, fetchImpl);
  if (!admin) return { response: json({ error: 'No autorizado' }, 401, noStore) };
  const { method } = request;
  if (method !== 'GET') {
    const origin = request.headers.get('Origin');
    const sameOrigin = !origin || origin === new URL(request.url).origin;
    const isJson = (request.headers.get('Content-Type') || '').startsWith('application/json');
    if (!sameOrigin || (method !== 'DELETE' && !isJson)) return { response: json({ error: 'Pedido inválido' }, 400, noStore) };
  }
  return { admin };
}
