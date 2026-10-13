import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRss, decode } from '../api/_rss.js';

const xml = `<?xml version="1.0"?><rss><channel>
<item><title>Cambios en la residencia Mercosur - Infobae</title><link>https://news.google.com/a</link><pubDate>Mon, 12 Oct 2026 10:00:00 GMT</pubDate><source url="https://infobae.com">Infobae</source></item>
<item><title><![CDATA[Migraciones &amp; DNI: nuevos turnos - La Nación]]></title><link>https://news.google.com/b</link><pubDate>Tue, 13 Oct 2026 09:00:00 GMT</pubDate><source url="https://lanacion.com.ar">La Nación</source></item>
<item><title>Cambios en la residencia Mercosur - Infobae</title><link>https://news.google.com/dup</link><pubDate>Mon, 12 Oct 2026 11:00:00 GMT</pubDate><source>Infobae</source></item>
<item><title>Link roto</title><link>javascript:alert(1)</link><pubDate>Mon, 12 Oct 2026 11:00:00 GMT</pubDate></item>
</channel></rss>`;

test('parsea, limpia el medio del título, ordena y deduplica', () => {
  const items = parseRss(xml);
  assert.equal(items.length, 2);
  assert.deepEqual(items[0], { title: 'Migraciones & DNI: nuevos turnos', link: 'https://news.google.com/b', source: 'La Nación', date: '2026-10-13T09:00:00.000Z' });
  assert.equal(items[1].title, 'Cambios en la residencia Mercosur');
});

test('respeta el límite', () => {
  assert.equal(parseRss(xml, { limit: 1 }).length, 1);
});

test('decodifica entidades numéricas', () => {
  assert.equal(decode('Ciudadan&#237;a &#x2014; ok'), 'Ciudadanía — ok');
});
