import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memoryD1 } from './d1.js';
import { slugify, validate, createArticle, updateArticle, deleteArticle, listPublished, getPublished, listAll, handleAdmin } from '../src/lib/articulos.js';

test('arma slugs sin tildes ni símbolos', () => {
  assert.equal(slugify('¿Qué cambió en la Residencia Mercosur? — DNU 366/2025'), 'que-cambio-en-la-residencia-mercosur-dnu-366-2025');
  assert.equal(slugify('!!!'), 'articulo');
});

test('valida el título y normaliza categoría y estado', () => {
  assert.ok(validate({ titulo: '  ' }).error);
  const { data } = validate({ titulo: 'Hola', categoria: 'otra', estado: 'x', cuerpo: 'a\r\nb' });
  assert.equal(data.categoria, 'general');
  assert.equal(data.estado, 'borrador');
  assert.equal(data.cuerpo, 'a\nb');
});

test('crea, publica, despublica y borra artículos', async () => {
  const db = memoryD1();
  const { article: a } = await createArticle(db, { titulo: 'Nueva residencia', cuerpo: 'Texto', categoria: 'residencias', autor: 'Laura Estomba' }, 'laura@ebi.test');
  assert.equal(a.slug, 'nueva-residencia');
  assert.equal(a.estado, 'borrador');
  assert.equal(a.publicado_en, null);
  assert.equal(a.editado_por, 'laura@ebi.test');
  assert.deepEqual(await listPublished(db), []);

  const { article: pub } = await updateArticle(db, a.id, { ...a, estado: 'publicado' }, 'conrado@ebi.test');
  assert.ok(pub.publicado_en);
  assert.equal((await listPublished(db)).length, 1);
  assert.equal((await getPublished(db, 'nueva-residencia')).cuerpo, 'Texto');

  const { article: draft } = await updateArticle(db, a.id, { ...pub, estado: 'borrador' }, 'conrado@ebi.test');
  assert.equal(draft.publicado_en, pub.publicado_en);
  assert.equal(await getPublished(db, 'nueva-residencia'), null);

  const { article: again } = await updateArticle(db, a.id, { ...draft, estado: 'publicado' }, 'conrado@ebi.test');
  assert.equal(again.publicado_en, pub.publicado_en, 'volver a publicar mantiene la fecha original');

  assert.equal(await deleteArticle(db, a.id), true);
  assert.equal(await deleteArticle(db, a.id), false);
  assert.deepEqual(await listAll(db), []);
});

test('no repite slugs y los mantiene al cambiar el título', async () => {
  const db = memoryD1();
  const { article: a } = await createArticle(db, { titulo: 'Newsletter semanal' }, 'x@ebi.test');
  const { article: b } = await createArticle(db, { titulo: 'Newsletter semanal' }, 'x@ebi.test');
  assert.equal(b.slug, 'newsletter-semanal-2');
  const { article: a2 } = await updateArticle(db, a.id, { titulo: 'Otro título' }, 'x@ebi.test');
  assert.equal(a2.slug, 'newsletter-semanal');
  const { article: b2 } = await updateArticle(db, b.id, { titulo: 'Otro', slug: 'Newsletter Semanal' }, 'x@ebi.test');
  assert.equal(b2.slug, 'newsletter-semanal-2', 'si el slug pedido ya existe, no lo pisa');
});

const local = (path, init) => new Request(`http://localhost:8787${path}`, init);

test('el panel exige login', async () => {
  const db = memoryD1();
  const res = await handleAdmin(local('/api/admin/articulos'), { DB: db });
  assert.equal(res.status, 401);
  const prod = await handleAdmin(new Request('https://ebi.test/api/admin/articulos'), { DB: db, DEV_ADMIN_EMAIL: 'dev@ebi.test' });
  assert.equal(prod.status, 401, 'el atajo de desarrollo solo vale en localhost');
});

test('API del panel: crear, listar, editar y borrar', async () => {
  const env = { DB: memoryD1(), DEV_ADMIN_EMAIL: 'dev@ebi.test' };
  const send = (path, method, body) => handleAdmin(local(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env, path.split('/')[4] || null);

  const created = await send('/api/admin/articulos', 'POST', { titulo: 'Edición 1', estado: 'publicado' });
  assert.equal(created.status, 201);
  const { articulo } = await created.json();
  assert.equal(articulo.editado_por, 'dev@ebi.test');

  const list = await (await handleAdmin(local('/api/admin/articulos'), env)).json();
  assert.equal(list.email, 'dev@ebi.test');
  assert.equal(list.articulos.length, 1);

  const bad = await send('/api/admin/articulos', 'POST', { titulo: '' });
  assert.equal(bad.status, 400);

  const edited = await send(`/api/admin/articulos/${articulo.id}`, 'PUT', { titulo: 'Edición 1 corregida', estado: 'publicado' });
  assert.equal((await edited.json()).articulo.titulo, 'Edición 1 corregida');
  assert.equal((await send('/api/admin/articulos/999', 'PUT', { titulo: 'x' })).status, 404);

  const del = await handleAdmin(local(`/api/admin/articulos/${articulo.id}`, { method: 'DELETE' }), env, String(articulo.id));
  assert.equal(del.status, 200);
});

test('rechaza escrituras desde otro sitio o sin JSON', async () => {
  const env = { DB: memoryD1(), DEV_ADMIN_EMAIL: 'dev@ebi.test' };
  const cross = local('/api/admin/articulos', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://otro.example' }, body: '{"titulo":"x"}' });
  assert.equal((await handleAdmin(cross, env)).status, 400);
  const form = local('/api/admin/articulos', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'titulo=x' });
  assert.equal((await handleAdmin(form, env)).status, 400);
});
