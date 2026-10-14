import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Las páginas del sitio se generan en el build; artículos, admin y api/ corren en el Worker.
export default defineConfig({
  // Dominio público (para canonical y hreflang). Se carga como variable SITE_URL en el build.
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'ignore',
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' }),
});
