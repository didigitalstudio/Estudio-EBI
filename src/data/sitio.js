// Datos de contacto y del estudio. Lo que está vacío todavía no lo pasó el estudio: mientras tanto la
// página muestra un marcador o directamente no muestra ese elemento.
export const SITIO = {
  // WhatsApp del estudio: recibe las consultas del botón "Consultar por WhatsApp" y se muestra en Contacto y en
  // el pie. whatsapp va sin + ni espacios (formato de wa.me); whatsappTexto es como se lee en la página.
  whatsapp: '541155141164',
  whatsappTexto: '+54 11 5514-1164',
  // Correo institucional: se muestra en Contacto y en el pie. Las consultas del formulario llegan a la casilla
  // de la variable CONSULTAS_EMAIL (ver README).
  email: '',
  facebook: 'https://www.facebook.com/share/14piweWKD8q/',
  facebookGrupo: '',
  linkedin: 'https://www.linkedin.com/company/estudio-juridico-ebi/',
  // Archivos en public/: logo del encabezado (ej. '/logo.png') y foto de fondo de la portada (ej. '/portada.jpg')
  logo: '/logo.png',
  portada: '/portada.jpg',
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Estudio%20EBI%20derecho%20migratorio',
};

// Firma de las publicaciones de Actualidad Migratoria
export const AUTORES = ['Estudio EBI'];
