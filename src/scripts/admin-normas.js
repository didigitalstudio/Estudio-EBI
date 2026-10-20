import { fechaLarga } from '../lib/fechas.js';

// Pestañas del panel y repositorio jurídico contra /api/admin/normas
const $ = (id) => document.getElementById(id);
const msg = $('nm-msg');
const form = $('nm');
const tabs = [$('tab-pubs'), $('tab-normas')];
let tipos = {};
let current = null;
let dirty = false;
let loaded = false;

function say(text, kind = '') {
  msg.textContent = text;
  msg.className = `adm-msg ${kind}`;
  msg.hidden = !text;
}

async function api(path = '', options = {}) {
  const r = await fetch(`/api/admin/normas${path}`, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401) throw new Error('Tu sesión venció o no tenés acceso. Volvé a entrar desde /admin con tu email.');
  if (!r.ok) throw new Error(data.error || 'No se pudo completar la operación. Probá de nuevo.');
  return data;
}

function select(tab, focus = false) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    $(t.getAttribute('aria-controls')).hidden = !on;
  });
  if (focus) tab.focus();
  const normas = tab.id === 'tab-normas';
  history.replaceState(null, '', normas ? '#repositorio' : location.pathname);
  if (normas && !loaded) loadList().then(() => show('list')).catch((e) => say(e.message, 'err'));
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
  });
});

function show(view) {
  $('nm-list-view').hidden = view !== 'list';
  $('nm-edit-view').hidden = view !== 'edit';
  window.scrollTo(0, 0);
}

function td(text, cls) {
  const c = document.createElement('td');
  if (cls) c.className = cls;
  if (text != null) c.textContent = text;
  return c;
}

const nombre = (n) => `${tipos[n.tipo] || n.tipo}${n.numero ? ` ${n.numero}` : ''}`;

async function loadList() {
  const data = await api();
  tipos = data.tipos;
  loaded = true;
  const box = $('nm-list');
  box.textContent = '';
  if (!data.normas.length) {
    const p = document.createElement('p');
    p.className = 'adm-empty';
    p.textContent = 'Todavía no hay normas. Cargá la primera con "Nueva norma".';
    box.appendChild(p);
    return;
  }
  const table = document.createElement('table');
  table.className = 'adm-table';
  table.innerHTML = '<thead><tr><th>Norma</th><th class="hide-sm">Fecha</th><th class="hide-sm">Fuente</th><th class="hide-sm">Editada por</th></tr></thead>';
  const body = document.createElement('tbody');
  for (const n of data.normas) {
    const tr = document.createElement('tr');
    const title = td();
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `${nombre(n)} · ${n.titulo}`;
    b.addEventListener('click', () => openEditor(n.id).catch((e) => say(e.message, 'err')));
    title.appendChild(b);
    const src = td(null, 'hide-sm');
    const a = document.createElement('a');
    a.href = n.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = new URL(n.url).hostname.replace(/^www\./, '');
    src.appendChild(a);
    tr.append(title, td(n.fecha ? fechaLarga(`${n.fecha}T12:00:00Z`) : '', 'hide-sm'), src, td(n.editado_por, 'hide-sm'));
    body.appendChild(tr);
  }
  table.appendChild(body);
  box.appendChild(table);
}

function fill(n) {
  current = n;
  form.reset();
  form.tipo.value = n?.tipo || 'ley';
  form.numero.value = n?.numero || '';
  form.fecha.value = n?.fecha || '';
  form.titulo.value = n?.titulo || '';
  form.url.value = n?.url || '';
  form.resumen.value = n?.resumen || '';
  $('nm-count').textContent = form.resumen.value.length;
  $('nm-heading').textContent = n ? 'Editar norma' : 'Nueva norma';
  $('nm-view').hidden = !n;
  if (n) $('nm-view').href = n.url;
  $('nm-delete').hidden = !n;
  dirty = false;
}

async function openEditor(id) {
  say('');
  fill(id ? (await api(`/${id}`)).norma : null);
  show('edit');
  form.titulo.focus();
}

form.addEventListener('input', () => {
  dirty = true;
  $('nm-count').textContent = form.resumen.value.length;
});
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.titulo.value.trim()) {
    say('Poné un título antes de guardar.', 'err');
    form.titulo.focus();
    return;
  }
  if (!/^https:\/\//.test(form.url.value.trim())) {
    say('El enlace a la fuente oficial tiene que empezar con https://', 'err');
    form.url.focus();
    return;
  }
  const body = JSON.stringify({
    tipo: form.tipo.value,
    numero: form.numero.value,
    fecha: form.fecha.value,
    titulo: form.titulo.value,
    url: form.url.value,
    resumen: form.resumen.value,
  });
  const buttons = form.querySelectorAll('button');
  buttons.forEach((b) => { b.disabled = true; });
  try {
    const { norma } = current
      ? await api(`/${current.id}`, { method: 'PUT', body })
      : await api('', { method: 'POST', body });
    fill(norma);
    say('Listo, la norma está en el repositorio del sitio.', 'ok');
  } catch (err) {
    say(err.message, 'err');
  } finally {
    buttons.forEach((b) => { b.disabled = false; });
  }
});

$('nm-delete').addEventListener('click', async () => {
  if (!current || !confirm(`¿Eliminar "${current.titulo}" del repositorio? No se puede deshacer.`)) return;
  try {
    await api(`/${current.id}`, { method: 'DELETE' });
    dirty = false;
    await loadList();
    show('list');
    say('Norma eliminada.', 'ok');
  } catch (err) {
    say(err.message, 'err');
  }
});

$('nm-new').addEventListener('click', () => openEditor(null));
$('nm-back').addEventListener('click', async () => {
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

if (location.hash === '#repositorio') select(tabs[1]);
