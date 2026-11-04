// Texto de los diccionarios a HTML: escapa todo y solo convierte **así** en negrita.
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function rich(text = '') {
  return String(text)
    .replace(/[&<>"']/g, (c) => ESC[c])
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// Sin las marcas (para meta tags y textos planos)
export const plain = (text = '') => String(text).replace(/\*\*(.+?)\*\*/g, '$1');

// Un texto o una lista de párrafos, siempre como lista
export const paras = (v) => (Array.isArray(v) ? v : v ? [v] : []);
