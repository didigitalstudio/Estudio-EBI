import { json } from './http.js';

// Reseñas del perfil de Google del estudio (Places API New).
// Requiere GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID.
export async function getResenas(env, fetchImpl = fetch) {
  const key = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return json({ configured: false }, 503, { 'Cache-Control': 'no-store' });
  try {
    const r = await fetchImpl(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es&regionCode=AR`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri',
      },
    });
    if (!r.ok) throw new Error(`places ${r.status}`);
    const p = await r.json();
    const reviews = (p.reviews || [])
      .filter((v) => v.text?.text)
      .map((v) => ({
        author: v.authorAttribution?.displayName || 'Usuario de Google',
        authorUrl: v.authorAttribution?.uri || null,
        photo: v.authorAttribution?.photoUri || null,
        rating: v.rating,
        text: v.text.text,
        when: v.relativePublishTimeDescription || '',
        date: v.publishTime || null,
      }));
    return json({
      configured: true,
      rating: p.rating ?? null,
      total: p.userRatingCount ?? 0,
      mapsUrl: p.googleMapsUri || null,
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews,
    });
  } catch (e) {
    return json({ configured: true, error: 'No se pudieron obtener las reseñas' }, 502, { 'Cache-Control': 'no-store' });
  }
}
