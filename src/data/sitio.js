// Datos de contacto y de los socios. Lo que está vacío todavía no lo pasó el estudio:
// mientras tanto la página muestra un marcador o directamente no muestra el botón.
export const SITIO = {
  whatsapp: [
    { numero: '541155141164', texto: '+54 11 5514-1164' },
    { numero: '541156209763', texto: '+54 11 5620-9763' },
    { numero: '541150380152', texto: '+54 11 5038-0152' },
  ],
  email: '',
  facebook: 'https://www.facebook.com/share/14piweWKD8q/',
  linkedin: '',
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Estudio%20EBI%20derecho%20migratorio',
};

export const waLink = (texto = '', numero = SITIO.whatsapp[0].numero) =>
  `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

// El orden sigue las siglas: E, B, I. `socia` define el femenino del cargo.
export const SOCIOS = [
  { id: 'estomba', inicial: 'E', nombre: 'Laura Estomba', socia: true, linkedin: '', foto: '' },
  { id: 'boquicio', inicial: 'B', nombre: 'Miguel Á. Santiago Boquicio', socia: false, linkedin: '', foto: '' },
  { id: 'izura', inicial: 'I', nombre: 'Conrado Izura', socia: false, linkedin: '', foto: '' },
];

export const AUTORES = [...SOCIOS.map((s) => s.nombre), 'Estudio EBI'];
