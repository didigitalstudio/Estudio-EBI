import { Marked } from 'marked';

// Markdown de los artículos a HTML. El HTML suelto se muestra como texto y los links
// solo pueden ir a http(s), mailto, tel o rutas del sitio.
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

function safeUrl(href) {
  const url = String(href || '').trim();
  return /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : null;
}

const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const url = safeUrl(href);
      if (!url) return text;
      const external = /^https?:/i.test(url);
      return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
    },
    image({ href, title, text }) {
      const url = safeUrl(href);
      if (!url || !/^https?:|^\//i.test(url)) return escapeHtml(text);
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ''} loading="lazy">`;
    },
  },
});

export function renderMarkdown(src) {
  return md.parse(String(src || ''));
}
