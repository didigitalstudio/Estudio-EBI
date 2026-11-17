// Datos estructurados (schema.org, JSON-LD) para Google y para los buscadores con IA (ChatGPT, Perplexity,
// Gemini, Claude). Describen el estudio, sus servicios, las preguntas frecuentes y la ubicación de cada página.
import { DICTS, langInfo, localePath } from '../i18n/index.js';
import { SITIO } from '../data/sitio.js';

const strip = (s = '') => String(s).replace(/\*\*/g, '').trim();

// '+54 11 5620-9763' -> '+541156209763' (formato que entienden los buscadores)
const tel = (t) => t.replace(/[^\d+]/g, '');

export function orgId(site) {
  return new URL('/#estudio', site).href;
}

// El estudio como LegalService (subtipo de LocalBusiness/Organization), con sus áreas de práctica
export function estudio(lang, site) {
  const t = DICTS[lang];
  const abs = (p) => new URL(p, site).href;
  const telForm = SITIO.whatsappLineas.find((w) => w.numero === SITIO.whatsapp) || SITIO.whatsappLineas[0];
  return {
    '@type': 'LegalService',
    '@id': orgId(site),
    name: 'Estudio EBI',
    alternateName: ['EBI Estudio Jurídico', 'Estudio Jurídico EBI'],
    description: t.meta.home.description,
    url: abs(localePath(lang, '/')),
    logo: { '@type': 'ImageObject', url: abs(SITIO.logo || '/apple-touch-icon.png') },
    image: abs('/og.jpg'),
    email: SITIO.email || undefined,
    telephone: telForm ? tel(telForm.texto) : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ciudad Autónoma de Buenos Aires',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    knowsLanguage: ['es', 'en'],
    knowsAbout: [
      'Derecho migratorio',
      'Ley de Migraciones 25.871',
      'Residencias en Argentina',
      'Residencia MERCOSUR',
      'Ciudadanía argentina',
      'DNI para extranjeros',
      'RENURE',
      'Movilidad internacional de personal',
      'Recursos contra expulsiones y denegatorias de residencia',
      'Dirección Nacional de Migraciones',
    ],
    contactPoint: SITIO.whatsappLineas.map((w) => ({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: tel(w.texto),
      email: SITIO.email || undefined,
      areaServed: 'AR',
      availableLanguage: ['Spanish', 'English'],
    })),
    sameAs: [SITIO.facebook, SITIO.linkedin, SITIO.facebookGrupo].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: strip(t.servicios.title),
      itemListElement: t.servicios.areas.map((a) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: strip(a.title), description: strip(a.text), provider: { '@id': orgId(site) } },
      })),
    },
  };
}

export function website(lang, site) {
  return {
    '@type': 'WebSite',
    '@id': new URL('/#web', site).href,
    url: new URL('/', site).href,
    name: 'Estudio EBI',
    inLanguage: ['es', 'en', 'pt', 'zh-Hans', 'ru'],
    publisher: { '@id': orgId(site) },
  };
}

export function webpage({ lang, site, path, title, description, type = 'WebPage' }) {
  const url = new URL(path, site).href;
  return {
    '@type': type,
    '@id': `${url}#pagina`,
    url,
    name: title,
    description,
    inLanguage: langInfo(lang).hreflang,
    isPartOf: { '@id': new URL('/#web', site).href },
    about: { '@id': orgId(site) },
  };
}

export function faqPage(items, { site, path }) {
  if (!items?.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${new URL(path, site).href}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: strip(f.q),
      acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
    })),
  };
}

// crumbs: [{ name, path }] sin incluir el inicio
export function breadcrumb(lang, site, crumbs) {
  const all = [{ name: 'Estudio EBI', path: localePath(lang, '/') }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.path, site).href })),
  };
}

export const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
