import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DICTS, LANGS, localePath } from '../src/i18n/index.js';

// Forma de un diccionario: mismas claves y mismo largo de listas que el español
function shape(v, path = '') {
  if (Array.isArray(v)) return v.flatMap((x, i) => shape(x, `${path}[${i}]`)).concat(`${path}#${v.length}`);
  if (v && typeof v === 'object') return Object.keys(v).sort().flatMap((k) => shape(v[k], path ? `${path}.${k}` : k));
  return [path];
}

function strings(v, path = '', out = []) {
  if (typeof v === 'string') out.push([path, v]);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
  return out;
}

test('todos los idiomas tienen las mismas claves que el español', () => {
  const base = shape(DICTS.es);
  for (const { code } of LANGS) assert.deepEqual(shape(DICTS[code]), base, `diferencias en ${code}`);
});

test('no quedan textos vacíos ni sin traducir', () => {
  const es = Object.fromEntries(strings(DICTS.es));
  for (const { code } of LANGS.filter((l) => l.code !== 'es')) {
    for (const [path, value] of strings(DICTS[code])) {
      if (es[path] === '' || path === '.ui.inSpanish') continue;
      assert.ok(value.trim(), `${code}${path} vacío`);
      // Iguales al español solo se aceptan nombres propios, siglas o números (en portugués hay muchas palabras iguales)
      if (code !== 'pt' && value === es[path]) assert.match(value, /^(\[?[A-Z0-9 ·.,'-]+\]?|WhatsApp|Email|Newsletter|Empresas|Estudio EBI)$/, `${code}${path} sin traducir: "${value}"`);
    }
  }
});

test('rutas por idioma', () => {
  assert.equal(localePath('es', '/'), '/');
  assert.equal(localePath('es', '/empresas'), '/empresas/');
  assert.equal(localePath('en', '/'), '/en/');
  assert.equal(localePath('zh', '/empresas'), '/zh/empresas/');
});
