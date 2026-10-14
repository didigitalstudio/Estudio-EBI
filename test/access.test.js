import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyAccessJwt, getAdmin } from '../src/lib/access.js';

const team = 'ebi-test.cloudflareaccess.com';
const aud = 'aud-123';
const { privateKey, publicKey } = await crypto.subtle.generateKey(
  { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
  true,
  ['sign', 'verify'],
);
const jwk = { ...(await crypto.subtle.exportKey('jwk', publicKey)), kid: 'k1' };
const certs = async (url) => {
  assert.equal(url, `https://${team}/cdn-cgi/access/certs`);
  return Response.json({ keys: [jwk] });
};

const b64url = (data) => Buffer.from(data).toString('base64url');
async function sign(payload, header = { alg: 'RS256', kid: 'k1' }) {
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const s = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${b64url(new Uint8Array(s))}`;
}
const now = Math.floor(Date.now() / 1000);
const valid = { aud: [aud], iss: `https://${team}`, email: 'Laura@ebi.test', exp: now + 600, iat: now };

test('acepta el JWT firmado por Access para esta app', async () => {
  const payload = await verifyAccessJwt(await sign(valid), { team, aud }, certs);
  assert.equal(payload.email, 'Laura@ebi.test');
});

test('rechaza JWT vencidos, de otra app, de otro equipo o adulterados', async () => {
  assert.equal(await verifyAccessJwt(await sign({ ...valid, exp: now - 10 }), { team, aud }, certs), null);
  assert.equal(await verifyAccessJwt(await sign({ ...valid, aud: ['otra'] }), { team, aud }, certs), null);
  assert.equal(await verifyAccessJwt(await sign({ ...valid, iss: 'https://otro.cloudflareaccess.com' }), { team, aud }, certs), null);
  assert.equal(await verifyAccessJwt(await sign(valid, { alg: 'HS256', kid: 'k1' }), { team, aud }, certs), null);
  assert.equal(await verifyAccessJwt(await sign(valid, { alg: 'RS256', kid: 'otra' }), { team, aud }, certs), null);
  const [h, , s] = (await sign(valid)).split('.');
  const forged = `${h}.${b64url(JSON.stringify({ ...valid, email: 'intruso@x.com' }))}.${s}`;
  assert.equal(await verifyAccessJwt(forged, { team, aud }, certs), null);
  assert.equal(await verifyAccessJwt('basura', { team, aud }, certs), null);
});

test('getAdmin usa el header de Access y la lista de emails permitidos', async () => {
  const token = await sign(valid);
  const req = new Request('https://ebi.test/api/admin/articulos', { headers: { 'Cf-Access-Jwt-Assertion': token } });
  const env = { ACCESS_TEAM_DOMAIN: `https://${team}/`, ACCESS_AUD: aud };
  assert.deepEqual(await getAdmin(req, env, certs), { email: 'laura@ebi.test' });
  assert.deepEqual(await getAdmin(req, { ...env, ADMIN_EMAILS: 'laura@ebi.test, conrado@ebi.test' }, certs), { email: 'laura@ebi.test' });
  assert.equal(await getAdmin(req, { ...env, ADMIN_EMAILS: 'conrado@ebi.test' }, certs), null);
  assert.equal(await getAdmin(new Request('https://ebi.test/'), env, certs), null);
  assert.equal(await getAdmin(req, {}, certs), null, 'sin configurar Access no entra nadie');
});
