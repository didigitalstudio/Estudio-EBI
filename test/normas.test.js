import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memoryD1 } from './d1.js';
import { validate, listNormas, createNorma, updateNorma, deleteNorma, handleAdminNormas } from '../src/lib/normas.js';

test('valida título, enlace https, tipo y fecha', () => {
  assert.ok(validate({ titulo: ' ', url: 'https://www.argentina.gob.ar' }).error);
  assert.ok(validate({ titulo: 'Ley', url: '' }).error);
  assert.ok(validate({ titulo: 'Ley', url: 'http://www.argentina.gob.ar' }).error, 'solo https');
  assert.ok(validate({ titulo: 'Ley', url: 'javascript:alert(1)' }).error);
  const { data } = validate({ titulo: 'Ley  de  Migraciones', url: 'https://www.argentina.gob.ar/x', tipo: 'toString', fecha: '2025-02-30' });
  assert.equal(data.titulo, 'Ley de Migraciones');
  assert.equal(data.tipo, 'otro');
  assert.equal(data.fecha, null, 'una fecha inexistente no se guarda');
  assert.equal(validate({ titulo: 'x', url: 'https://a.ar', fecha: '2010-05-03' }).data.fecha, '2010-05-03');
});

test('la migración trae las normas base con enlaces oficiales', async () => {
  const normas = await listNormas(memoryD1());
  assert.equal(normas.length, 5);
  assert.ok(normas.every((n) => /^https:\/\/www\.(argentina|boletinoficial)\.gob\.ar\//.test(n.url)));
  assert.equal(normas[0].numero, '366/2025', 'las más nuevas primero');
  assert.equal(normas.at(-1).fecha, null, 'las que no tienen fecha van al final');
});

test('crea, edita y borra normas', async () => {
  const db = memoryD1();
  const { norma } = await createNorma(db, { titulo: 'Disposición de prueba', tipo: 'disposicion', numero: '1/2026', fecha: '2026-01-05', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/1' }, 'socio@ebi.test');
  assert.equal(norma.tipo, 'disposicion');
  assert.equal(norma.editado_por, 'socio@ebi.test');
  assert.equal((await listNormas(db))[0].id, norma.id);

  const { norma: edited } = await updateNorma(db, norma.id, { ...norma, resumen: 'Algo nuevo', fecha: '' }, 'otro@ebi.test');
  assert.equal(edited.resumen, 'Algo nuevo');
  assert.equal(edited.fecha, null);
  assert.equal(edited.editado_por, 'otro@ebi.test');
  assert.ok((await updateNorma(db, 999, norma, 'x')).notFound);

  assert.equal(await deleteNorma(db, norma.id), true);
  assert.equal(await deleteNorma(db, norma.id), false);
});

const local = (path, init) => new Request(`http://localhost:8787${path}`, init);

test('API del repositorio: login, alta, edición, borrado y origen', async () => {
  const db = memoryD1();
  assert.equal((await handleAdminNormas(local('/api/admin/normas'), { DB: db })).status, 401);

  const env = { DB: db, DEV_ADMIN_EMAIL: 'dev@ebi.test' };
  const send = (path, method, body, headers = {}) => handleAdminNormas(local(path, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }), env, path.split('/')[4] || null);

  const list = await (await handleAdminNormas(local('/api/admin/normas'), env)).json();
  assert.equal(list.email, 'dev@ebi.test');
  assert.equal(list.tipos.dnu, 'DNU');
  assert.equal(list.normas.length, 5);

  const created = await send('/api/admin/normas', 'POST', { titulo: 'Resolución', tipo: 'resolucion', url: 'https://www.argentina.gob.ar/r' });
  assert.equal(created.status, 201);
  const { norma } = await created.json();
  assert.equal((await send('/api/admin/normas', 'POST', { titulo: 'Sin enlace' })).status, 400);
  assert.equal((await send(`/api/admin/normas/${norma.id}`, 'PUT', { ...norma, titulo: 'Resolución corregida' })).status, 200);
  assert.equal((await send('/api/admin/normas', 'POST', { titulo: 'x', url: 'https://a.ar' }, { Origin: 'https://otro.example' })).status, 400);
  assert.equal((await handleAdminNormas(local(`/api/admin/normas/${norma.id}`, { method: 'DELETE' }), env, String(norma.id))).status, 200);
  assert.equal((await handleAdminNormas(local('/api/admin/normas/abc'), env, 'abc')).status, 404);
});
