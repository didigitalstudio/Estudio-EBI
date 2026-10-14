// Fechas de los artículos en hora de Buenos Aires
export const fechaLarga = (iso, locale = 'es-AR') =>
  new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' });
