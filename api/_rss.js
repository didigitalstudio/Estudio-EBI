const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') {
        const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .trim();
}

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
}

// Google News agrega " - Medio" al final del título; lo sacamos si coincide con <source>.
function cleanTitle(title, source) {
  const suffix = ` - ${source}`;
  return source && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

// Área de cada nota según el título. Gana la primera que coincide; sin coincidencia queda en null.
const CATEGORIES = [
  ['normativa', /\bdnu\b|decreto|bolet[ií]n oficial|\bley\b|resoluci[oó]n|disposici[oó]n|reforma migratoria|normativa/i],
  ['expulsiones', /expuls|deportad|deportaci|prohibici[oó]n de (ingreso|reingreso)/i],
  ['ciudadania', /ciudadan[ií]a|naturalizaci/i],
  ['trabajo', /permisos? de trabajo|visas? de trabajo|trabajadores (extranjeros|migrantes)|renure|n[oó]madas? digital/i],
  ['residencias', /residencia|radicaci[oó]n|\bdni\b|regularizaci[oó]n/i],
];

export function categorize(title) {
  const hit = CATEGORIES.find(([, re]) => re.test(title));
  return hit ? hit[0] : null;
}

export function parseRss(xml, { limit = 6 } = {}) {
  const items = [];
  const seen = new Set();
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const source = tag(block, 'source');
    const title = cleanTitle(tag(block, 'title'), source);
    const link = tag(block, 'link');
    const date = new Date(tag(block, 'pubDate'));
    const key = title.toLowerCase();
    if (!title || !/^https?:\/\//.test(link) || seen.has(key)) continue;
    seen.add(key);
    items.push({ title, link, source, date: isNaN(date) ? null : date.toISOString(), category: categorize(title) });
  }
  items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return items.slice(0, limit);
}
