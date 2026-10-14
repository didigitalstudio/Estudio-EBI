import es from './es.js';
import en from './en.js';
import pt from './pt.js';
import zh from './zh.js';
import ru from './ru.js';

// Idiomas del sitio. El español va en la raíz (/empresas) y el resto con prefijo (/en/empresas).
// La bandera es la del país que usamos para cada idioma en el selector.
export const LANGS = [
  { code: 'es', name: 'Español', flag: 'ar', hreflang: 'es', locale: 'es-AR' },
  { code: 'en', name: 'English', flag: 'gb', hreflang: 'en', locale: 'en-GB' },
  { code: 'pt', name: 'Português', flag: 'br', hreflang: 'pt', locale: 'pt-BR' },
  { code: 'zh', name: '中文', flag: 'cn', hreflang: 'zh-Hans', locale: 'zh-CN' },
  { code: 'ru', name: 'Русский', flag: 'ru', hreflang: 'ru', locale: 'ru-RU' },
];

export const DICTS = { es, en, pt, zh, ru };

export const langInfo = (code) => LANGS.find((l) => l.code === code) || LANGS[0];

// Las páginas estáticas se sirven con barra final (/empresas/): los links van directo ahí, sin redirección
export function localePath(lang, path = '/') {
  const p = path.endsWith('/') ? path : `${path}/`;
  return lang === 'es' ? p : `/${lang}${p}`;
}

// Para getStaticPaths de las páginas traducidas: undefined es la versión en español, en la raíz.
export const langPaths = () => LANGS.map(({ code }) => ({ params: { lang: code === 'es' ? undefined : code }, props: { lang: code } }));
