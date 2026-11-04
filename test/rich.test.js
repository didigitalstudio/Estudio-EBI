import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rich, plain, paras } from '../src/lib/rich.js';

test('convierte **negrita** y escapa el resto', () => {
  assert.equal(rich('Socios: **Estomba & Izura** <b>'), 'Socios: <strong>Estomba &amp; Izura</strong> &lt;b&gt;');
  assert.equal(plain('integrado por **Estomba**'), 'integrado por Estomba');
});

test('un texto o varios párrafos', () => {
  assert.deepEqual(paras('uno'), ['uno']);
  assert.deepEqual(paras(['uno', 'dos']), ['uno', 'dos']);
  assert.deepEqual(paras(''), []);
});
