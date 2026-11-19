// Datos de contacto y del estudio. Lo que está vacío todavía no lo pasó el estudio: mientras tanto la
// página muestra un marcador o directamente no muestra ese elemento.
// Líneas de WhatsApp de los tres integrantes: se muestran en Contacto y en el pie, sin nombres (perfil bajo).
// numero va sin + ni espacios (formato de wa.me); texto es como se lee en la página.
const WHATSAPP = [
  { numero: '541155141164', texto: '+54 11 5514-1164' },
  { numero: '541156209763', texto: '+54 11 5620-9763' },
  { numero: '541150380152', texto: '+54 11 5038-0152' },
];

export const SITIO = {
  whatsappLineas: WHATSAPP,
  // Número que recibe las consultas del botón "Consultar por WhatsApp" del formulario (pedido del estudio del 11/11)
  whatsapp: '541156209763',
  // Correo institucional: se muestra en Contacto y en el pie. Las consultas del formulario llegan a la casilla
  // de la variable CONSULTAS_EMAIL (ver README).
  email: 'contacto@estudioebi.com',
  facebook: 'https://www.facebook.com/share/14piweWKD8q/',
  facebookGrupo: '',
  linkedin: 'https://www.linkedin.com/company/estudio-juridico-ebi/',
  // Archivos en public/: logo del encabezado (ej. '/logo.png') y foto de fondo de la portada (ej. '/portada.jpg')
  logo: '/logo.png',
  portada: '/portada.jpg',
  // Fondo de la franja de Actualidad (inicio) y de la portada de /actualidad: aeropuerto y paso fronterizo
  fotosActualidad: ['/img/aeropuerto.webp', '/img/frontera.webp'],
  // Opiniones de Google: el estudio todavía no tiene su perfil de empresa en Google, así que la sección no se
  // muestra (pedido del 19/11). Cuando lo tenga, cargar GOOGLE_PLACE_ID (ver README) y pasar esto a true.
  opiniones: false,
  // Link directo al perfil de Google del estudio. Nunca una búsqueda por nombre: buscar "Estudio EBI" en Maps
  // abría el perfil de otro estudio. Vacío, el botón "Ver reseñas en Google" aparece solo si la API manda el link.
  googleMaps: '',
};

// Firma de las publicaciones de Actualidad Migratoria
export const AUTORES = ['Estudio EBI'];
