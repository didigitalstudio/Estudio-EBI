// Script común a todas las páginas. Los textos vienen del JSON #ui que arma el layout en cada idioma.
const ui = JSON.parse(document.getElementById('ui').textContent);
const lang = ui.lang;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}
const safe = (u) => (/^https:\/\//.test(u || '') ? u : null);
const num = (r) => r.toLocaleString(ui.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const getJSON = (u) => fetch(u).then((r) => r.json().then((d) => { if (!r.ok) throw d; return d; }));

// Menú mobile
const menuBtn = $('.menu-btn');
const nav = $('#menu');
function menu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? ui.menuClose : ui.menuOpen);
}
menuBtn.addEventListener('click', () => menu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) menu(false); });

// Guía de sección y menú: marcan la parte de la página que se está viendo
const topBar = $('.top');
const guide = $('#guide');
const guideLabel = $('.guide-label', guide);
const guideBar = $('.guide-bar i', guide);
const spied = $$('[data-guide]');
const navLinks = $$('#menu a[data-sec]');
let spyQueued = false;
function spy() {
  spyQueued = false;
  const line = topBar.getBoundingClientRect().bottom + 48;
  let cur = null;
  // El último que cruza la línea es el más interno (ej. Nuestro enfoque dentro de Quiénes somos)
  for (const s of spied) {
    const r = s.getBoundingClientRect();
    if (r.top <= line && r.bottom > line) cur = s;
  }
  const label = cur?.dataset.guide || '';
  if (label && guideLabel.textContent !== label) guideLabel.textContent = label;
  guide.classList.toggle('on', !!label);
  const sec = cur?.closest('[data-nav]')?.dataset.nav;
  navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.sec === sec));
  const max = document.documentElement.scrollHeight - innerHeight;
  guideBar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  topBar.classList.toggle('scrolled', scrollY > 4);
}
const queueSpy = () => { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } };
addEventListener('scroll', queueSpy, { passive: true });
addEventListener('resize', queueSpy);
spy();

// Selector de idiomas: se cierra al tocar afuera o con Escape
const langMenu = $('.lang-menu');
document.addEventListener('click', (e) => { if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && langMenu.open) { langMenu.open = false; $('summary', langMenu).focus(); } });

// "Más idiomas": el traductor de Google se carga recién cuando alguien lo pide
const gtBtn = $('.gt-open');
gtBtn.addEventListener('click', () => {
  const box = $('#gt');
  box.hidden = false;
  gtBtn.hidden = true;
  if (window.google?.translate) return;
  window.ebiTranslateInit = () => {
    new window.google.translate.TranslateElement({ pageLanguage: gtBtn.dataset.gtLang, autoDisplay: false }, 'gt');
  };
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=ebiTranslateInit';
  document.head.appendChild(s);
});

// Botón para copiar el link de un artículo
$$('[data-copy]').forEach((b) => b.addEventListener('click', () => {
  navigator.clipboard?.writeText(location.href).then(() => { b.textContent = b.dataset.copied; });
}));

// Formulario de consultas: persona o empresa, por email si está configurado y si no por WhatsApp
const form = $('#form');
if (form) {
  const msgEl = $('#form-msg');
  const sendMail = $('#send-email');
  const sendWa = $('#send-wa');
  let mailOn = false;

  const setPerfil = (p) => {
    $$('input[name="perfil"]', form).forEach((r) => { r.checked = r.value === p; r.parentNode.classList.toggle('on', r.checked); });
    $$('[data-only]', form).forEach((e) => {
      const on = e.dataset.only === p;
      e.hidden = !on;
      $$('input,select,textarea', e).forEach((c) => { c.disabled = !on; });
    });
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'perfil') setPerfil(e.target.value); });
  // Los botones con data-perfil / data-tipo dejan el formulario listo para ese caso
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-perfil]');
    if (!a) return;
    const p = a.dataset.perfil;
    setPerfil(p);
    const opt = a.dataset.tipo && $(`#tipo-${p} option[data-key="${a.dataset.tipo}"]`);
    if (opt) opt.selected = true;
  });

  const data = () => {
    const fd = new FormData(form);
    const d = { lang, pagina: ui.page };
    ['perfil', 'nombre', 'empresa', 'cargo', 'email', 'tel', 'pais', 'personas', 'tipo', 'msg', 'website'].forEach((k) => { d[k] = String(fd.get(k) || '').trim(); });
    return d;
  };
  // Para WhatsApp va el texto visible de cada opción, en el idioma de la página
  const shown = (name) => {
    const s = $(`select[name="${name}"]:not(:disabled)`, form);
    return s && s.selectedIndex >= 0 ? s.options[s.selectedIndex].textContent : '';
  };
  const waLink = (d) => {
    let s = `${ui.waHello} ${d.nombre}${d.pais ? ` (${d.pais})` : ''}.`;
    if (d.perfil === 'empresa') s += `\n${ui.waCompany}: ${d.empresa}${d.cargo ? ` (${d.cargo})` : ''} · ${ui.waPeople}: ${shown('personas')}`;
    s += `\n${ui.waTopic}: ${shown('tipo')}\n${d.msg}`;
    if (d.email) s += `\nEmail: ${d.email}`;
    if (d.tel) s += `\n${ui.waPhone}: ${d.tel}`;
    return `https://wa.me/${ui.wa}?text=${encodeURIComponent(s)}`;
  };
  const say = (txt, ok) => { msgEl.textContent = txt; msgEl.classList.toggle('ok', !!ok); };
  const invalid = (name, key) => {
    const f = form.elements[name];
    f.setAttribute('aria-invalid', 'true');
    f.focus();
    say(ui[key]);
  };
  form.addEventListener('input', (e) => e.target.removeAttribute('aria-invalid'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const via = e.submitter?.value === 'wa' || !mailOn ? 'wa' : 'email';
    const d = data();
    $$('[aria-invalid]', form).forEach((f) => f.removeAttribute('aria-invalid'));
    if (!d.nombre) return invalid('nombre', 'errRequired');
    if (d.perfil === 'empresa' && !d.empresa) return invalid('empresa', 'errEmpresa');
    if (!d.msg) return invalid('msg', 'errRequired');
    if (via === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return invalid('email', 'errEmail');
    if (via === 'wa') {
      say('');
      window.open(waLink(d), '_blank');
      return;
    }
    sendMail.disabled = sendWa.disabled = true;
    say(ui.sending, true);
    fetch('/api/consulta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then((r) => {
        if (!r.ok) throw r;
        form.reset();
        setPerfil(d.perfil);
        say(ui.sent, true);
      })
      .catch(() => {
        say(ui.sendError);
        const a = el('a', null, ui.sendErrorLink);
        a.href = waLink(d);
        a.target = '_blank';
        a.rel = 'noopener';
        msgEl.append(a, '.');
      })
      .finally(() => { sendMail.disabled = sendWa.disabled = false; });
  });
  getJSON('/api/consulta').then((d) => {
    if (!d.configured) return;
    mailOn = true;
    sendMail.hidden = false;
    sendWa.className = 'btn btn-out';
  }).catch(() => {});
}

// Opiniones de Google
const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z';
function stars(r) {
  const w = el('span', 'stars');
  w.setAttribute('role', 'img');
  w.setAttribute('aria-label', num(r) + ui.stars);
  for (let i = 0; i < 5; i++) {
    const f = Math.max(0, Math.min(1, r - i));
    const id = `s${Math.random().toString(36).slice(2)}`;
    w.insertAdjacentHTML('beforeend', `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="${id}"><stop offset="${f}" stop-color="#C9A86B"/><stop offset="${f}" stop-color="#DDD5C3"/></linearGradient></defs><path d="${STAR}" fill="url(#${id})"/></svg>`);
  }
  return w;
}
// Antigüedad de la reseña en el idioma de la página; si no hay fecha, el texto que manda Google
function when(v) {
  const d = new Date(v.date);
  if (!v.date || Number.isNaN(+d) || !window.Intl?.RelativeTimeFormat) return v.when || '';
  const s = (d - Date.now()) / 1000;
  const f = new Intl.RelativeTimeFormat(ui.locale, { numeric: 'auto' });
  for (const [unit, secs] of [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600]]) {
    if (Math.abs(s) >= secs) return f.format(Math.round(s / secs), unit);
  }
  return f.format(Math.round(s / 60), 'minute');
}

const revList = $('#rev-list');
if (revList) {
  const summary = $('#rev-summary');
  getJSON('/api/resenas').then((d) => {
    if (!d.reviews?.length) throw d;
    if (safe(d.mapsUrl)) $('#rev-all').href = d.mapsUrl;
    const wr = $('#rev-write');
    wr.href = d.writeReviewUrl;
    wr.hidden = false;
    revList.textContent = '';
    if (d.rating) {
      summary.append(el('span', 'rev-num', num(d.rating)), stars(d.rating), el('span', null, d.total + ui.reviews));
      summary.hidden = false;
    }
    d.reviews.slice(0, 6).forEach((v) => {
      const c = el('article', 'rev');
      const h = el('div', 'rev-head');
      const av = el('div', 'rev-av');
      const who = el('div');
      if (safe(v.photo)) {
        const im = el('img');
        im.src = v.photo;
        im.alt = '';
        im.loading = 'lazy';
        im.referrerPolicy = 'no-referrer';
        av.appendChild(im);
      } else av.textContent = (v.author || '?').charAt(0).toUpperCase();
      const n = el(safe(v.authorUrl) ? 'a' : 'span', 'rev-name', v.author);
      if (n.tagName === 'A') { n.href = v.authorUrl; n.target = '_blank'; n.rel = 'noopener'; }
      who.append(n, el('div', 'rev-when', when(v)));
      h.append(av, who);
      c.appendChild(h);
      if (v.rating) c.appendChild(stars(v.rating));
      c.appendChild(el('p', 'rev-text', v.text));
      revList.appendChild(c);
    });
  }).catch(() => {
    revList.textContent = '';
    const c = el('div', 'rev');
    c.style.gridColumn = '1/-1';
    c.appendChild(el('p', 'rev-text', ui.revFallback));
    revList.appendChild(c);
  });
}

const dateTxt = (iso) => new Date(iso).toLocaleDateString(ui.locale, { day: 'numeric', month: 'long', year: 'numeric' });

// Carrusel de Actualidad en el inicio: publicaciones del estudio primero y después noticias de medios
const track = $('#news-track');
if (track) {
  const card = (href, own, cat, date, extra, title, sum, external) => {
    const a = el('a', own ? 'news own' : 'news');
    a.href = href;
    if (external) { a.target = '_blank'; a.rel = 'noopener'; } else if (lang !== 'es') a.hreflang = 'es';
    if (own) a.appendChild(el('span', 'news-badge', ui.studio));
    const meta = el('span', 'news-meta');
    meta.appendChild(el('span', 'news-cat', cat));
    const dt = new Date(date);
    if (date && !Number.isNaN(+dt)) { const t = el('time', null, dateTxt(date)); t.dateTime = date; meta.appendChild(t); }
    if (extra) meta.appendChild(el('span', null, extra));
    const h = el('span', 'news-title', title);
    if (lang !== 'es') h.lang = 'es';
    a.append(meta, h);
    if (sum) { const s = el('span', 'news-sum', sum); if (lang !== 'es') s.lang = 'es'; a.appendChild(s); }
    a.appendChild(el('span', 'news-more', own ? ui.read : ui.more));
    return a;
  };
  Promise.allSettled([getJSON('/api/articulos?limit=6'), getJSON('/api/noticias')]).then(([pubs, media]) => {
    const cards = [];
    (pubs.value?.articulos || []).forEach((a) => {
      cards.push(card(`/actualidad/${encodeURIComponent(a.slug)}`, true, ui.cats[a.categoria] || ui.catDefault, a.publicado_en, ui.inSpanish, a.titulo, a.resumen));
    });
    (media.value?.items || []).forEach((n) => {
      if (safe(n.link)) cards.push(card(n.link, false, ui.cats[n.category] || ui.catDefault, n.date, n.source, n.title, '', true));
    });
    if (!cards.length) cards.push(card('https://www.argentina.gob.ar/interior/migraciones', false, ui.catDefault, '', '', ui.newsFallback, '', true));
    track.textContent = '';
    track.append(...cards);
    carousel(track);
  });
}

// Avanza solo cada 6 segundos (salvo movimiento reducido) y se detiene con el botón de pausa; también se
// frena con el mouse encima, con el foco adentro, al tocarlo o fuera de pantalla
function carousel(tr) {
  const prev = $('[data-car="prev"]');
  const next = $('[data-car="next"]');
  const toggle = $('[data-car="toggle"]');
  const step = () => (tr.firstElementChild ? tr.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(tr).columnGap || 0) : tr.clientWidth);
  const atEnd = () => tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
  const sync = () => {
    const over = tr.scrollWidth > tr.clientWidth + 4;
    prev.parentNode.hidden = !over;
    prev.disabled = tr.scrollLeft <= 4;
  };
  const go = (dir) => {
    if (dir > 0 && atEnd()) tr.scrollTo({ left: 0 });
    else tr.scrollBy({ left: dir * step() });
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  tr.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync);
  sync();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    toggle.hidden = true;
    return;
  }
  let stopped = false;
  let hold = false;
  let seen = false;
  let touchTimer = 0;
  toggle.addEventListener('click', () => {
    stopped = !stopped;
    toggle.setAttribute('aria-label', stopped ? toggle.dataset.play : toggle.dataset.pause);
    $('use', toggle).setAttribute('href', stopped ? '#i-play' : '#i-pause');
  });
  const box = tr.closest('section') || tr;
  box.addEventListener('mouseenter', () => { hold = true; });
  box.addEventListener('mouseleave', () => { hold = false; });
  box.addEventListener('focusin', (e) => { hold = e.target !== toggle; });
  box.addEventListener('focusout', () => { hold = false; });
  box.addEventListener('touchstart', () => { hold = true; clearTimeout(touchTimer); }, { passive: true });
  box.addEventListener('touchend', () => { touchTimer = setTimeout(() => { hold = false; }, 5000); }, { passive: true });
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; }).observe(tr);
  setInterval(() => {
    if (!stopped && !hold && seen && !document.hidden && tr.scrollWidth > tr.clientWidth + 4) go(1);
  }, 6000);
}

// Noticias de medios (Google News)
const newsList = $('#news-list');
if (newsList) {
  getJSON('/api/noticias').then((d) => {
    if (!d.items?.length) throw d;
    newsList.textContent = '';
    d.items.forEach((n) => {
      if (!safe(n.link)) return;
      const a = el('a', 'pub');
      const b = el('span', 'pub-body');
      const m = el('span', 'pub-meta');
      const dt = new Date(n.date);
      a.href = n.link;
      a.target = '_blank';
      a.rel = 'noopener';
      if (n.date && !Number.isNaN(+dt)) {
        const tm = el('time', 'pub-date');
        tm.dateTime = n.date;
        tm.append(el('span', 'pub-day', String(dt.getDate())), el('span', 'pub-mon', dt.toLocaleDateString(ui.locale, { month: 'short' }).replace('.', '')));
        a.appendChild(tm);
      } else a.appendChild(el('span', 'pub-date'));
      m.appendChild(el('span', 'pub-cat', ui.cats[n.category] || ui.catDefault));
      if (n.source) m.appendChild(el('span', null, n.source));
      const title = el('span', 'pub-title', n.title);
      if (lang !== 'es') title.lang = 'es';
      b.append(m, title, el('span', 'pub-more', ui.more));
      a.appendChild(b);
      newsList.appendChild(a);
    });
  }).catch(() => {
    newsList.textContent = '';
    const a = el('a', 'pub pub-wide');
    const b = el('span', 'pub-body');
    a.href = 'https://www.argentina.gob.ar/interior/migraciones';
    a.target = '_blank';
    a.rel = 'noopener';
    b.append(el('span', 'pub-title', ui.newsFallback), el('span', 'pub-more', ui.newsFallbackLink));
    a.appendChild(b);
    newsList.appendChild(a);
  });
}

// Repositorio jurídico (página de Actualidad): filtro por tipo de norma y búsqueda
const repoQ = $('#repo-q');
if (repoQ) {
  const repo = $('#repo');
  const plain = (v) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const items = $$('.norma', repo).map((it) => [it, plain(`${$('.norma-tipo', it).textContent} ${$('.norma-body', it).textContent}`)]);
  const chips = $$('.chip', repo);
  let tipo = '';
  const apply = () => {
    const s = plain(repoQ.value.trim());
    let n = 0;
    items.forEach(([it, txt]) => {
      const on = (!tipo || it.dataset.tipo === tipo) && (!s || txt.includes(s));
      it.hidden = !on;
      if (on) n++;
    });
    $('#repo-empty', repo).hidden = n > 0;
    const count = $('#repo-count', repo);
    count.textContent = n === 1 ? count.dataset.one : `${n} ${count.dataset.many}`;
  };
  chips.forEach((c) => c.addEventListener('click', () => {
    tipo = c.dataset.tipo;
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
    apply();
  }));
  repoQ.addEventListener('input', apply);
}
