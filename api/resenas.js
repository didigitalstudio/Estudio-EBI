// Reseñas del perfil de Google del estudio (Places API New).
// Requiere en Vercel: GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID.
export default async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ configured: false });
  }
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es&regionCode=AR`, {
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
      }));
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      configured: true,
      rating: p.rating ?? null,
      total: p.userRatingCount ?? 0,
      mapsUrl: p.googleMapsUri || null,
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews,
    });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ configured: true, error: 'No se pudieron obtener las reseñas' });
  }
}
