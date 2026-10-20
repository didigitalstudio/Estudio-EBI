import { json } from './http.js';
import { adminGuard } from './access.js';

// Repositorio jurídico (tabla normas en D1): leyes, decretos y disposiciones con enlace a la fuente oficial.
export const TIPOS = {
  ley: 'Ley',
  decreto: 'Decreto',
  dnu: 'DNU',
  disposicion: 'Disposición',
  resolucion: 'Resolución',
  boletin: 'Boletín Oficial',
  otro: 'Otro',
};

function line(value, max) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

function fecha(value) {
  const s = line(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(+d) && d.toISOString().slice(0, 10) === s ? s : null;
}

function https(value) {
  const s = line(value, 500);
  try {
    return new URL(s).protocol === 'https:' ? s : '';
  } catch {
    return '';
  }
}

export function validate(input = {}) {
  const titulo = line(input.titulo, 200);
  if (!titulo) return { error: 'Falta el título' };
  const url = https(input.url);
  if (!url) return { error: 'Falta el enlace a la fuente oficial (tiene que empezar con https://)' };
  return {
    data: {
      titulo,
      tipo: Object.hasOwn(TIPOS, input.tipo) ? input.tipo : 'otro',
      numero: line(input.numero, 40),
      fecha: fecha(input.fecha),
      url,
      resumen: line(input.resumen, 400),
    },
  };
}

// Las más nuevas primero; las que no tienen fecha (ej. el Boletín Oficial) al final
export async function listNormas(db) {
  const { results } = await db
    .prepare('SELECT id, titulo, tipo, numero, fecha, url, resumen, actualizado_en, editado_por FROM normas ORDER BY fecha IS NULL, fecha DESC, titulo')
    .all();
  return results;
}

export function getNorma(db, id) {
  return db.prepare('SELECT * FROM normas WHERE id = ?').bind(id).first();
}

export async function createNorma(db, input, email) {
  const v = validate(input);
  if (v.error) return v;
  const d = v.data;
  const now = new Date().toISOString();
  const r = await db
    .prepare('INSERT INTO normas (titulo, tipo, numero, fecha, url, resumen, creado_en, actualizado_en, editado_por) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(d.titulo, d.tipo, d.numero, d.fecha, d.url, d.resumen, now, now, email)
    .run();
  return { norma: await getNorma(db, r.meta.last_row_id) };
}

export async function updateNorma(db, id, input, email) {
  if (!(await getNorma(db, id))) return { notFound: true };
  const v = validate(input);
  if (v.error) return v;
  const d = v.data;
  await db
    .prepare('UPDATE normas SET titulo = ?, tipo = ?, numero = ?, fecha = ?, url = ?, resumen = ?, actualizado_en = ?, editado_por = ? WHERE id = ?')
    .bind(d.titulo, d.tipo, d.numero, d.fecha, d.url, d.resumen, new Date().toISOString(), email, id)
    .run();
  return { norma: await getNorma(db, id) };
}

export async function deleteNorma(db, id) {
  const r = await db.prepare('DELETE FROM normas WHERE id = ?').bind(id).run();
  return r.meta.changes > 0;
}

// API del panel: /api/admin/normas y /api/admin/normas/:id
export async function handleAdminNormas(request, env, id = null, fetchImpl = fetch) {
  const noStore = { 'Cache-Control': 'no-store' };
  const { admin, response } = await adminGuard(request, env, fetchImpl);
  if (response) return response;
  const { method } = request;
  const db = env.DB;
  const readBody = () => request.json().catch(() => null);
  const ok = (data, status = 200) => json(data, status, noStore);

  if (id == null) {
    if (method === 'GET') return ok({ email: admin.email, tipos: TIPOS, normas: await listNormas(db) });
    if (method === 'POST') {
      const r = await createNorma(db, (await readBody()) || {}, admin.email);
      return r.error ? ok({ error: r.error }, 400) : ok({ norma: r.norma }, 201);
    }
    return json({ error: 'Método no permitido' }, 405, { ...noStore, Allow: 'GET, POST' });
  }

  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) return ok({ error: 'No encontrado' }, 404);
  if (method === 'GET') {
    const n = await getNorma(db, num);
    return n ? ok({ norma: n }) : ok({ error: 'No encontrado' }, 404);
  }
  if (method === 'PUT') {
    const r = await updateNorma(db, num, (await readBody()) || {}, admin.email);
    if (r.notFound) return ok({ error: 'No encontrado' }, 404);
    return r.error ? ok({ error: r.error }, 400) : ok({ norma: r.norma });
  }
  if (method === 'DELETE') return (await deleteNorma(db, num)) ? ok({ ok: true }) : ok({ error: 'No encontrado' }, 404);
  return json({ error: 'Método no permitido' }, 405, { ...noStore, Allow: 'GET, PUT, DELETE' });
}
