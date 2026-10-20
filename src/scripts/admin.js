import { renderMarkdown } from '../lib/markdown.js';
import { fechaLarga } from '../lib/fechas.js';

// Panel de Actualidad Migratoria: listado y editor contra /api/admin/articulos
const $ = (id) => document.getElementById(id);
const cats = JSON.parse($('cats').textContent);
const msg = $('msg');
const form = $('ed');
let current = null;
let dirty = false;
let loaded = false;

function say(text, kind = '') {
  msg.textContent = text;
  msg.className = `adm-msg ${kind}`;
  msg.hidden = !text;
}

async function api(path = '', options = {}) {
  const r = await fetch(`/api/admin/articulos${path}`, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401) throw new Error('Tu sesión venció o no tenés acceso. Volvé a entrar desde /admin con tu email.');
  if (!r.ok) throw new Error(data.error || 'No se pudo completar la operación. Probá de nuevo.');
  return data;
}

function show(view) {
  $('list-view').hidden = view !== 'list';
  $('edit-view').hidden = view !== 'edit';
  if (!$('pubs').hidden) window.scrollTo(0, 0);
}

function td(text, cls) {
  const c = document.createElement('td');
  if (cls) c.className = cls;
  if (text != null) c.textContent = text;
  return c;
}

async function loadList() {
  const { email, articulos } = await api();
  $('user').textContent = email;
  loaded = true;
  const box = $('list');
  box.textContent = '';
  if (!articulos.length) {
    const p = document.createElement('p');
    p.className = 'adm-empty';
    p.textContent = 'Todavía no hay publicaciones. Creá la primera con "Nueva publicación".';
    box.appendChild(p);
    return;
  }
  const table = document.createElement('table');
  table.className = 'adm-table';
  table.innerHTML = '<thead><tr><th>Título</th><th>Estado</th><th class="hide-sm">Categoría</th><th class="hide-sm">Autor</th><th class="hide-sm">Fecha</th></tr></thead>';
  const body = document.createElement('tbody');
  for (const a of articulos) {
    const tr = document.createElement('tr');
    const title = td();
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = a.titulo;
    b.addEventListener('click', () => openEditor(a.id).catch((e) => say(e.message, 'err')));
    title.appendChild(b);
    const state = td();
    const s = document.createElement('span');
    s.className = `state ${a.estado}`;
    s.textContent = a.estado === 'publicado' ? 'Publicado' : 'Borrador';
    state.appendChild(s);
    const date = a.publicado_en || a.actualizado_en;
    tr.append(title, state, td(cats[a.categoria] || a.categoria, 'hide-sm'), td(a.autor, 'hide-sm'), td(date ? fechaLarga(date) : '', 'hide-sm'));
    body.appendChild(tr);
  }
  table.appendChild(body);
  box.appendChild(table);
}

function preview() {
  $('pv-title').textContent = form.titulo.value || 'Título de la publicación';
  $('pv-sum').textContent = form.resumen.value;
  $('pv-body').innerHTML = renderMarkdown(form.cuerpo.value);
  $('res-count').textContent = form.resumen.value.length;
}

function fill(a) {
  current = a;
  form.reset();
  form.titulo.value = a?.titulo || '';
  form.categoria.value = a?.categoria || 'newsletter';
  if (a?.autor) {
    if (![...form.autor.options].some((o) => o.value === a.autor)) form.autor.add(new Option(a.autor, a.autor));
    form.autor.value = a.autor;
  }
  form.resumen.value = a?.resumen || '';
  form.cuerpo.value = a?.cuerpo || '';
  form.slug.value = a?.slug || '';
  const published = a?.estado === 'publicado';
  $('ed-heading').textContent = a ? 'Editar publicación' : 'Nueva publicación';
  $('publish').textContent = published ? 'Guardar cambios' : 'Publicar';
  $('draft').textContent = published ? 'Despublicar' : 'Guardar borrador';
  $('view').hidden = !published;
  if (published) $('view').href = `/actualidad/${encodeURIComponent(a.slug)}`;
  $('delete').hidden = !a;
  dirty = false;
  preview();
}

async function openEditor(id) {
  say('');
  fill(id ? (await api(`/${id}`)).articulo : null);
  show('edit');
  form.titulo.focus();
}

form.addEventListener('input', () => { dirty = true; preview(); });
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const estado = e.submitter?.value || 'borrador';
  if (!form.titulo.value.trim()) {
    say('Poné un título antes de guardar.', 'err');
    form.titulo.focus();
    return;
  }
  const body = JSON.stringify({
    titulo: form.titulo.value,
    categoria: form.categoria.value,
    autor: form.autor.value,
    resumen: form.resumen.value,
    cuerpo: form.cuerpo.value,
    slug: form.slug.value,
    estado,
  });
  const buttons = form.querySelectorAll('button');
  buttons.forEach((b) => { b.disabled = true; });
  try {
    const { articulo } = current
      ? await api(`/${current.id}`, { method: 'PUT', body })
      : await api('', { method: 'POST', body });
    fill(articulo);
    say(estado === 'publicado' ? 'Listo, la publicación está en el sitio.' : 'Guardado como borrador: no se ve en el sitio.', 'ok');
  } catch (err) {
    say(err.message, 'err');
  } finally {
    buttons.forEach((b) => { b.disabled = false; });
  }
});

$('delete').addEventListener('click', async () => {
  if (!current || !confirm(`¿Eliminar "${current.titulo}"? No se puede deshacer.`)) return;
  try {
    await api(`/${current.id}`, { method: 'DELETE' });
    dirty = false;
    await loadList();
    show('list');
    say('Publicación eliminada.', 'ok');
  } catch (err) {
    say(err.message, 'err');
  }
});

$('new').addEventListener('click', () => openEditor(null));
$('back').addEventListener('click', async () => {
  if (dirty && !confirm('Hay cambios sin guardar. ¿Salir igual?')) return;
  say('');
  dirty = false;
  try {
    await loadList();
    show('list');
  } catch (err) {
    say(err.message, 'err');
  }
});
window.addEventListener('beforeunload', (e) => { if (dirty) e.preventDefault(); });

const start = () => loadList().then(() => { say(''); show('list'); }).catch((err) => say(err.message, 'err'));
// Si la primera carga falló, volver a la pestaña la reintenta
$('tab-pubs').addEventListener('click', () => { if (!loaded) start(); });
start();
