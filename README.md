# Estudio EBI

Sitio del estudio hecho con [Astro](https://astro.build) y publicado en Cloudflare Workers.

- Las páginas (inicio, `/empresas` y `/quienes-somos`, en cinco idiomas) se generan en el build como HTML estático.
- Actualidad Migratoria (`/actualidad`), el panel de los socios (`/admin`) y la API (`/api/*`) corren en el Worker.
- Los artículos y el repositorio jurídico se guardan en Cloudflare D1. El panel queda protegido con Cloudflare Access: cada socio entra con un código que le llega por email, así que no hay contraseñas que mantener.

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Textos del sitio | `src/i18n/es.js` y sus traducciones `en.js`, `pt.js`, `zh.js`, `ru.js` |
| WhatsApp del formulario, email, redes, logo, foto de portada y apellidos | `src/data/sitio.js` |
| Secciones | `src/components/` |
| Páginas | `src/pages/` (`[...lang]/` son las páginas traducidas) |
| Estilos | `src/styles/site.css` |
| Script del navegador (guía de sección, carrusel, formulario, reseñas, repositorio) | `src/scripts/site.js` |
| Base de artículos y normas | `migrations/` |

Lo que todavía no pasó el estudio queda con un marcador entre corchetes ([EMAIL], [Reseña profesional del estudio…]). En `src/data/sitio.js` se cargan:

- `email`: casilla de contacto (se muestra en Contacto y en el pie).
- `facebook`, `facebookGrupo`, `linkedin`: los íconos del pie aparecen solo si tienen dirección.
- `logo`: archivo en `public/` (hoy `'/logo.png'`, el sello recortado sobre fondo transparente). Si se deja vacío, el encabezado muestra el logo de texto.
- `portada`: foto de fondo de la portada en `public/` (hoy `'/portada.jpg'`, el Obelisco). Se muestra difuminada bajo un velo verde; si se deja vacía se ve una silueta de Buenos Aires. Conviene que sea de al menos 2000 px de ancho y con licencia de uso.

En `public/` también están `favicon.png`, `apple-touch-icon.png` y `og.jpg` (la imagen que aparece al compartir el link: foto difusa con el logo). Si cambian el logo o la foto, hay que regenerarlos.

Por pedido del estudio, el sitio no menciona el paso de los socios por organismos públicos o internacionales y en Quiénes somos muestra solo los apellidos, sin fotos ni currículums. `test/contenido.test.js` lo controla en los cinco idiomas.

## Recorrido del inicio

Portada → Servicios → Personas y familias → Empresas → Actualidad (carrusel de publicaciones y noticias) → Opiniones de Google → Preguntas frecuentes → Contacto. Quiénes somos tiene su página propia. Mientras se recorre la página, el menú marca la sección y una franja debajo del encabezado muestra su nombre (cada sección lo define con `data-guide`). El sitio no tiene botones directos a WhatsApp: las consultas entran por el formulario, que filtra los contactos y ordena la información.

## Idiomas

El español va en la raíz (`/`, `/empresas/`) y el resto con prefijo (`/en/`, `/pt/empresas/`, etc.). Cada idioma tiene su URL, así que Google indexa todas las versiones; el sitemap y las etiquetas hreflang las relacionan entre sí.

Los cinco diccionarios tienen las mismas claves. Al cambiar un texto en `es.js` hay que actualizarlo en los otros cuatro: `npm test` avisa si falta alguna clave o si quedó un texto sin traducir. Conviene que alguien nativo revise portugués, chino y ruso.

El selector del encabezado tiene las banderas de los cinco idiomas y la opción "Más idiomas", que carga el traductor automático de Google recién cuando alguien la elige. Las publicaciones de Actualidad Migratoria están solo en español: en los otros idiomas se marcan como "en español" y se pueden leer con el traductor.

## Desarrollo local

```
npm install
npm run build
npm run db:migrate:local
npx wrangler dev --var DEV_ADMIN_EMAIL:tu@email.com
```

Queda en http://localhost:8787. `DEV_ADMIN_EMAIL` deja entrar a `/admin` sin Access, y solo funciona en localhost.

Tests: `npm test`.

## Publicar en Cloudflare

1. La base de artículos (`ebi`) ya está creada en la cuenta de Cloudflare, con la tabla armada, y su `database_id` está en `wrangler.jsonc`. Si el sitio se publica en otra cuenta, crearla ahí con `npx wrangler d1 create ebi`, reemplazar el `database_id` y correr `npm run db:migrate`. Las tablas nuevas que se agreguen en `migrations/` se aplican con ese mismo comando.
2. Cargar las variables (ver la tabla de abajo) con `npx wrangler secret put NOMBRE`, o desde el panel de Cloudflare en Workers → estudio-ebi → Settings → Variables and Secrets.
3. Publicar con `npm run deploy`, o conectando el repo en Workers → Create → Import a repository para que cada push publique solo. El Worker ya está conectado así, con esta configuración (Settings → Build):
   - Rama de producción: `claude/funny-archimedes-lmzba4`. La rama por defecto del repo (`claude/peaceful-wozniak-cae5d7`) tiene la versión anterior del sitio y no compila con esta configuración.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Node: lo toma de `.nvmrc` (22).
4. Asignar el dominio en Workers → estudio-ebi → Settings → Domains & Routes. La caché de reseñas y noticias funciona en el dominio propio, no en la dirección `workers.dev`.

En el build conviene definir `SITE_URL` con el dominio final (por ejemplo `https://estudioebi.com.ar`), o mientras tanto con el link de workers.dev, para que las páginas tengan su URL canónica, las alternativas por idioma y la imagen para compartir con dirección completa (WhatsApp y las redes la necesitan así para mostrar la vista previa).

| Variable | Para qué | |
| --- | --- | --- |
| `ACCESS_TEAM_DOMAIN` | Dominio del equipo de Cloudflare Access, ej. `ebi.cloudflareaccess.com` | Panel |
| `ACCESS_AUD` | Application Audience (AUD) Tag de la aplicación de Access | Panel |
| `ADMIN_EMAILS` | Opcional: emails de los socios separados por coma, como segundo control | Panel |
| `RESEND_API_KEY` | Clave de [Resend](https://resend.com) para mandar las consultas por email | Formulario |
| `CONSULTAS_EMAIL` | Casilla que recibe las consultas (pueden ser varias separadas por coma) | Formulario |
| `CONSULTAS_FROM` | Opcional: remitente con dominio verificado en Resend, ej. `Web Estudio EBI <web@dominio.com>` | Formulario |
| `GOOGLE_PLACES_API_KEY` | Clave de Google Cloud con Places API (New) habilitada | Reseñas |
| `GOOGLE_PLACE_ID` | ID del perfil de Google del estudio | Reseñas |

Sin las variables del formulario, la consulta se manda por WhatsApp. Sin las de reseñas, la sección muestra solo el botón "Ver reseñas en Google".

## Panel de Actualidad Migratoria (`/admin`)

Para habilitar el acceso de los socios, en Cloudflare Zero Trust:

1. Access → Applications → Add an application → Self-hosted.
2. Dominio del sitio con la ruta `admin`, y una segunda ruta `api/admin` en la misma aplicación.
3. Política Allow con los emails de los tres socios. Como método de login alcanza con One-time PIN (código por email).
4. Copiar el Application Audience (AUD) Tag a `ACCESS_AUD` y el dominio del equipo a `ACCESS_TEAM_DOMAIN`.

Además de Access, la API verifica en cada pedido el token que firma Cloudflare, así que si alguien entra por otra dirección del Worker no puede leer ni modificar nada.

El panel tiene dos pestañas: Publicaciones y Repositorio jurídico.

Para publicar: entrar a `/admin`, poner el email y el código que llega, tocar "Nueva publicación", completar título, categoría, autor, resumen y contenido, y "Publicar". "Guardar borrador" la guarda sin mostrarla en el sitio. El contenido se escribe en Markdown y al lado se ve cómo va a quedar. Cada publicación tiene botones para compartir en LinkedIn, Facebook y WhatsApp.

Repositorio jurídico: leyes, decretos, DNU, disposiciones y resoluciones con su enlace a la fuente oficial (tiene que empezar con `https://`). Se muestran en `/actualidad#repositorio` apenas se guardan, ordenadas por fecha, con filtro por tipo y buscador. La migración `0002_normas.sql` carga las normas base (Ley 25.871, Decreto 616/2010, DNU 366/2025, Ley 346 y el Boletín Oficial).

## Formulario de consultas (`/api/consulta`)

Distingue persona y empresa. Con Resend configurado, el botón principal manda la consulta por email a la casilla del estudio, con respuesta directa a quien consultó, y WhatsApp queda como alternativa. El email indica desde qué página y en qué idioma llegó la consulta. Las opciones elegidas llegan siempre en español.

## Noticias de medios (`/api/noticias`)

Las últimas notas de Google News sobre migraciones en Argentina, con un área según palabras del título, guardadas 30 minutos en la caché. Si el feed falla, se muestra un link a las novedades oficiales de la DNM.
