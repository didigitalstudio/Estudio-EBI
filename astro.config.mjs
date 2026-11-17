import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Las páginas del sitio se generan en el build; artículos, admin y api/ corren en el Worker.
export default defineConfig({
  // Dominio público (canonical, hreflang, sitemap, datos estructurados). SITE_URL en el build lo reemplaza.
  site: process.env.SITE_URL || 'https://estudioebi.com',
  trailingSlash: 'ignore',
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' }),
  vite: { define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) } },
});
