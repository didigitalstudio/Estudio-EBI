import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graph, estudio, faqPage, breadcrumb, webpage } from '../src/lib/seo.js';
import { LANGS, DICTS } from '../src/i18n/index.js';

const site = new URL('https://estudioebi.com');

test('el estudio tiene los datos que leen Google y los buscadores con IA, en los cinco idiomas', () => {
  for (const { code } of LANGS) {
    const e = estudio(code, site);
    assert.equal(e['@type'], 'LegalService');
    assert.equal(e['@id'], 'https://estudioebi.com/#estudio');
    assert.equal(e.address.addressCountry, 'AR');
    assert.ok(e.email && e.telephone.startsWith('+54'));
    assert.equal(e.hasOfferCatalog.itemListElement.length, DICTS[code].servicios.areas.length);
    for (const o of e.hasOfferCatalog.itemListElement) assert.ok(o.itemOffered.name && !o.itemOffered.name.includes('**'));
  }
});

test('preguntas frecuentes, migas y grafo', () => {
  const f = faqPage(DICTS.es.faq.items, { site, path: '/' });
  assert.equal(f.mainEntity.length, DICTS.es.faq.items.length);
  assert.ok(f.mainEntity.every((q) => q.name && q.acceptedAnswer.text));
  assert.equal(faqPage([], { site, path: '/' }), null);
  const b = breadcrumb('en', site, [{ name: 'Companies', path: '/en/empresas/' }]);
  assert.deepEqual(b.itemListElement.map((i) => i.item), ['https://estudioebi.com/en/', 'https://estudioebi.com/en/empresas/']);
  const g = graph(webpage({ lang: 'zh', site, path: '/zh/', title: 't', description: 'd' }), null);
  assert.equal(g['@graph'].length, 1);
  assert.equal(g['@graph'][0].inLanguage, 'zh-Hans');
  assert.doesNotThrow(() => JSON.stringify(g));
});
