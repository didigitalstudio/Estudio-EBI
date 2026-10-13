# Estudio EBI

Landing del estudio. Página estática (`index.html`) más dos funciones serverless en `api/` para publicar en Vercel.

## Noticias migratorias (`/api/noticias`)

Trae las últimas notas de Google News sobre migraciones en Argentina y las guarda en la CDN 30 minutos. No necesita configuración. Si el feed falla, la página muestra un link a las novedades oficiales de la DNM.

## Opiniones de Google (`/api/resenas`)

Muestra la calificación y las reseñas del perfil de Google del estudio con la Places API (New). En Vercel, en Settings → Environment Variables, cargar:

- `GOOGLE_PLACES_API_KEY`: clave de Google Cloud con **Places API (New)** habilitada y facturación activa. Restringirla solo a esa API.
- `GOOGLE_PLACE_ID`: ID del perfil del estudio. Se busca en https://developers.google.com/maps/documentation/places/web-service/place-id

Google devuelve hasta 5 reseñas. Mientras no estén cargadas las variables, la sección muestra solo el botón "Ver reseñas en Google".

## Tests

```
npm test
```
