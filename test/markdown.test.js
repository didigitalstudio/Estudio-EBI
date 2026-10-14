import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/lib/markdown.js';

test('convierte el Markdown básico de los artículos', () => {
  const html = renderMarkdown('## Requisitos\n\n- Pasaporte\n- **DNI**\n\nMás en [la DNM](https://www.argentina.gob.ar/interior/migraciones).');
  assert.match(html, /<h2>Requisitos<\/h2>/);
  assert.match(html, /<li><strong>DNI<\/strong><\/li>/);
  assert.match(html, /<a href="https:\/\/www.argentina.gob.ar\/interior\/migraciones" target="_blank" rel="noopener">la DNM<\/a>/);
});

test('no deja pasar HTML ni links peligrosos', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)> [clic](javascript:alert(1)) ![x](javascript:alert(2))');
  assert.doesNotMatch(html, /<script|<img src=x|href="javascript/i);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /clic/);
});
