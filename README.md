# Estudio EBI

Sitio del estudio hecho con [Astro](https://astro.build) y publicado en Cloudflare Workers.

- Las páginas (inicio y `/empresas`, en cinco idiomas) se generan en el build como HTML estático.
- Actualidad Migratoria (`/actualidad`), el panel de los socios (`/admin`) y la API (`/api/*`) corren en el Worker.
- Los artículos se guardan en Cloudflare D1. El panel queda protegido con Cloudflare Access: cada socio entra con un código que le llega por email, así que no hay contraseñas que mantener.

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Textos del sitio | `src/i18n/es.js` y sus traducciones `en.js`, `pt.js`, `zh.js`, `ru.js` |
| WhatsApp, email, Facebook, LinkedIn, socios y fotos | `src/data/sitio.js` |
| Secciones | `src/components/` |
| Páginas | `src/pages/` (`[...lang]/` son las páginas traducidas) |
| Estilos | `src/styles/site.css` |
| Script del navegador (formulario, reseñas, noticias) | `src/scripts/site.js` |
| Base de artículos | `migrations/` |

Lo que todavía no pasó el estudio queda con un marcador entre corchetes ([FOTO], [EMAIL], [Formación académica y matrícula profesional]). El email, el LinkedIn institucional y los LinkedIn de los socios se cargan en `src/data/sitio.js`. Mientras estén vacíos, la página muestra el marcador o no muestra el botón.

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

1. Crear la base de artículos: `npx wrangler d1 create ebi` y pegar el `database_id` que devuelve en `wrangler.jsonc`.
2. Crear la tabla: `npm run db:migrate`.
3. Cargar las variables (ver la tabla de abajo) con `npx wrangler secret put NOMBRE`, o desde el panel de Cloudflare en Workers → estudio-ebi → Settings → Variables and Secrets.
4. Publicar con `npm run deploy`. También se puede conectar el repo en Workers → Create → Import a repository, con `npm run build` como comando de build y `npx wrangler deploy` como comando de deploy: así cada push publica solo.
5. Asignar el dominio en Workers → estudio-ebi → Settings → Domains & Routes. La caché de reseñas y noticias funciona en el dominio propio, no en la dirección `workers.dev`.

En el build conviene definir `SITE_URL` con el dominio final (por ejemplo `https://estudioebi.com.ar`) para que las páginas tengan su URL canónica y las alternativas por idioma.

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

Para publicar: entrar a `/admin`, poner el email y el código que llega, tocar "Nueva publicación", completar título, categoría, autor, resumen y contenido, y "Publicar". "Guardar borrador" la guarda sin mostrarla en el sitio. El contenido se escribe en Markdown y al lado se ve cómo va a quedar. Cada publicación tiene botones para compartir en LinkedIn, Facebook y WhatsApp.

## Formulario de consultas (`/api/consulta`)

Distingue persona y empresa. Con Resend configurado, el botón principal manda la consulta por email a la casilla del estudio, con respuesta directa a quien consultó, y WhatsApp queda como alternativa. El email indica desde qué página y en qué idioma llegó la consulta. Las opciones elegidas llegan siempre en español.

## Noticias de medios (`/api/noticias`)

Las últimas notas de Google News sobre migraciones en Argentina, con un área según palabras del título, guardadas 30 minutos en la caché. Si el feed falla, se muestra un link a las novedades oficiales de la DNM.
