import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DICTS } from '../src/i18n/index.js';

// Pedido del estudio (reunión del 20/10, ajustado con los textos del 3/11): Quiénes somos describe la
// trayectoria del equipo en términos generales (gestión pública, cooperación internacional), pero ningún
// texto nombra los organismos donde trabajaron los socios ni los presenta como ex integrantes, y el sitio
// muestra solo apellidos, sin nombres de pila.
const PROHIBIDO = [
  /\bOIM\b/, /\bIOM\b/, /\bМОМ\b/, /国际移民组织/,
  /Organizaci[oó]n Internacional para las Migraciones/i, /International Organization for Migration/i,
  /Organiza[çc][aã]o Internacional para as Migra[çc][oõ]es/i, /Международн\S* организаци\S* по миграции/i,
  /por dentro/i, /desde adentro/i, /from the inside/i, /изнутри/i, /内部运作/,
  /ex[- ]integrante/i, /ex[- ]funcionari/i, /former member/i, /former official/i, /бывш\S* сотрудник/i, /曾任职/,
  /\bLaura\b/, /\bMiguel\b/, /\bConrado\b/,
];

function strings(v, path = '', out = []) {
  if (typeof v === 'string') out.push([path, v]);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
  return out;
}

test('ningún texto nombra los organismos donde trabajaron los socios', () => {
  for (const [code, dict] of Object.entries(DICTS)) {
    for (const [path, value] of strings(dict)) {
      for (const re of PROHIBIDO) assert.doesNotMatch(value, re, `${code}${path}: "${value}"`);
    }
  }
});

test('los datos del sitio no publican nombres de pila de los socios', () => {
  const data = readFileSync(new URL('../src/data/sitio.js', import.meta.url), 'utf8');
  assert.doesNotMatch(data, /\b(Laura|Miguel|Conrado)\b/);
});

test('Quiénes somos nombra a los socios por apellido en todos los idiomas', () => {
  for (const [code, dict] of Object.entries(DICTS)) {
    for (const ap of ['Estomba', 'Boquicio', 'Izura']) assert.match(dict.nosotros.lead, new RegExp(ap), `${code}: falta ${ap}`);
  }
});
