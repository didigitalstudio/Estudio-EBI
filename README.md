# Estudio EBI

Landing del estudio. Página estática (`index.html`) más funciones serverless en `api/` para publicar en Vercel.

## Español e inglés

La página está en español y tiene versión en inglés con el selector ES | EN del encabezado. La elección queda guardada en el navegador y se puede compartir un link directo con `?lang=en`.

Cada texto tiene su traducción al lado, en el atributo `data-en` (y `data-en-label` para los `aria-label`). Si se cambia un texto en español, hay que actualizar también su `data-en`. El elemento con `data-en` tiene que contener solo texto: si lleva un ícono, el texto va en un `<span>` aparte. Los textos que arma el script (reseñas, noticias, mensajes del formulario y de WhatsApp) están en el objeto `T` al final de `index.html`.

## Formulario de consultas (`/api/consulta`)

El formulario distingue entre personas y empresas. Si el envío por email está configurado, el botón principal manda la consulta a la casilla del estudio y WhatsApp queda como alternativa. Si no está configurado, la consulta se envía por WhatsApp como hasta ahora.

El email sale por [Resend](https://resend.com). En Vercel, en Settings → Environment Variables, cargar:

- `RESEND_API_KEY`: clave de la cuenta de Resend.
- `CONSULTAS_EMAIL`: casilla del estudio que recibe las consultas. Pueden ser varias separadas por coma.
- `CONSULTAS_FROM` (opcional): remitente, por ejemplo `Web Estudio EBI <web@dominio-del-estudio.com>`. El dominio tiene que estar verificado en Resend. Sin esta variable se usa `onboarding@resend.dev`, que sirve solo para probar porque entrega únicamente a la casilla dueña de la cuenta de Resend.

Al responder el email, la respuesta va directo a quien hizo la consulta. Si la consulta llega desde la versión en inglés, el email lo indica.

## Actualidad migratoria (`/api/noticias`)

Trae las últimas notas de Google News sobre migraciones en Argentina y las guarda en la CDN 30 minutos. Cada nota lleva un área (Normativa, Expulsiones, Ciudadanía, Trabajo y empresas o Residencias) según palabras del título; si no coincide ninguna, se muestra como Migraciones. No necesita configuración. Si el feed falla, la página muestra un link a las novedades oficiales de la DNM.

## Opiniones de Google (`/api/resenas`)

Muestra la calificación y las reseñas del perfil de Google del estudio con la Places API (New). En Vercel, en Settings → Environment Variables, cargar:

- `GOOGLE_PLACES_API_KEY`: clave de Google Cloud con **Places API (New)** habilitada y facturación activa. Restringirla solo a esa API.
- `GOOGLE_PLACE_ID`: ID del perfil del estudio. Se busca en https://developers.google.com/maps/documentation/places/web-service/place-id

Google devuelve hasta 5 reseñas. Mientras no estén cargadas las variables, la sección muestra solo el botón "Ver reseñas en Google".

## Tests

```
npm test
```
