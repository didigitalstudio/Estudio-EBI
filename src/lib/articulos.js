import { json } from './http.js';
import { adminGuard } from './access.js';

// Artículos de Actualidad Migratoria guardados en D1 (binding DB).
export const CATEGORIAS = ['newsletter', 'normativa', 'residencias', 'ciudadania', 'trabajo', 'expulsiones', 'general'];
const ESTADOS = ['borrador', 'publicado'];
const PUBLIC_COLS = 'id, slug, titulo, resumen, categoria, autor, publicado_en';

export function slugify(s) {
  const slug = String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
  return slug || 'articulo';
}

function line(value, max) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

export function validate(input = {}) {
  const titulo = line(input.titulo, 200);
  if (!titulo) return { error: 'Falta el título' };
  return {
    data: {
      titulo,
      resumen: line(input.resumen, 400),
      cuerpo: typeof input.cuerpo === 'string' ? input.cuerpo.replace(/\r\n/g, '\n').trim().slice(0, 50000) : '',
      categoria: CATEGORIAS.includes(input.categoria) ? input.categoria : 'general',
      autor: line(input.autor, 120),
      estado: ESTADOS.includes(input.estado) ? input.estado : 'borrador',
      slug: line(input.slug, 120) ? slugify(input.slug) : '',
    },
  };
}

export async function listPublished(db, { limit = 20, offset = 0 } = {}) {
  const { results } = await db
    .prepare(`SELECT ${PUBLIC_COLS} FROM articulos WHERE estado = 'publicado' ORDER BY publicado_en DESC LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all();
  return results;
}

export function getPublished(db, slug) {
  return db
    .prepare(`SELECT ${PUBLIC_COLS}, cuerpo, actualizado_en FROM articulos WHERE slug = ? AND estado = 'publicado'`)
    .bind(slug)
    .first();
}

export async function listAll(db) {
  const { results } = await db
    .prepare('SELECT id, slug, titulo, categoria, autor, estado, publicado_en, actualizado_en, editado_por FROM articulos ORDER BY COALESCE(publicado_en, actualizado_en) DESC')
    .all();
  return results;
}

export function getById(db, id) {
  return db.prepare('SELECT * FROM articulos WHERE id = ?').bind(id).first();
}

async function uniqueSlug(db, base, exceptId = 0) {
  let slug = base;
  for (let n = 2; await db.prepare('SELECT 1 FROM articulos WHERE slug = ? AND id != ?').bind(slug, exceptId).first(); n++) {
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createArticle(db, input, email) {
  const v = validate(input);
  if (v.error) return v;
  const d = v.data;
  const slug = await uniqueSlug(db, d.slug || slugify(d.titulo));
  const now = new Date().toISOString();
  const r = await db
    .prepare('INSERT INTO articulos (slug, titulo, resumen, cuerpo, categoria, autor, estado, publicado_en, creado_en, actualizado_en, editado_por) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(slug, d.titulo, d.resumen, d.cuerpo, d.categoria, d.autor, d.estado, d.estado === 'publicado' ? now : null, now, now, email)
    .run();
  return { article: await getById(db, r.meta.last_row_id) };
}

export async function updateArticle(db, id, input, email) {
  const current = await getById(db, id);
  if (!current) return { notFound: true };
  const v = validate(input);
  if (v.error) return v;
  const d = v.data;
  const slug = d.slug && d.slug !== current.slug ? await uniqueSlug(db, d.slug, id) : current.slug;
  const now = new Date().toISOString();
  // La fecha es la de la primera publicación: despublicar y volver a publicar no la cambia
  const publicadoEn = d.estado === 'publicado' ? current.publicado_en || now : current.publicado_en;
  await db
    .prepare('UPDATE articulos SET slug = ?, titulo = ?, resumen = ?, cuerpo = ?, categoria = ?, autor = ?, estado = ?, publicado_en = ?, actualizado_en = ?, editado_por = ? WHERE id = ?')
    .bind(slug, d.titulo, d.resumen, d.cuerpo, d.categoria, d.autor, d.estado, publicadoEn, now, email, id)
    .run();
  return { article: await getById(db, id) };
}

export async function deleteArticle(db, id) {
  const r = await db.prepare('DELETE FROM articulos WHERE id = ?').bind(id).run();
  return r.meta.changes > 0;
}

// API del panel: /api/admin/articulos y /api/admin/articulos/:id
export async function handleAdmin(request, env, id = null, fetchImpl = fetch) {
  const noStore = { 'Cache-Control': 'no-store' };
  const { admin, response } = await adminGuard(request, env, fetchImpl);
  if (response) return response;
  const { method } = request;

  const db = env.DB;
  const readBody = () => request.json().catch(() => null);
  const ok = (data, status = 200) => json(data, status, noStore);

  if (id == null) {
    if (method === 'GET') return ok({ email: admin.email, categorias: CATEGORIAS, articulos: await listAll(db) });
    if (method === 'POST') {
      const r = await createArticle(db, (await readBody()) || {}, admin.email);
      return r.error ? ok({ error: r.error }, 400) : ok({ articulo: r.article }, 201);
    }
    return json({ error: 'Método no permitido' }, 405, { ...noStore, Allow: 'GET, POST' });
  }

  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) return ok({ error: 'No encontrado' }, 404);
  if (method === 'GET') {
    const a = await getById(db, num);
    return a ? ok({ articulo: a }) : ok({ error: 'No encontrado' }, 404);
  }
  if (method === 'PUT') {
    const r = await updateArticle(db, num, (await readBody()) || {}, admin.email);
    if (r.notFound) return ok({ error: 'No encontrado' }, 404);
    return r.error ? ok({ error: r.error }, 400) : ok({ articulo: r.article });
  }
  if (method === 'DELETE') return (await deleteArticle(db, num)) ? ok({ ok: true }) : ok({ error: 'No encontrado' }, 404);
  return json({ error: 'Método no permitido' }, 405, { ...noStore, Allow: 'GET, PUT, DELETE' });
}
