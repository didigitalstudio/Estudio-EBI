// Textos del sitio en español. Los otros idiomas (en, pt, zh, ru) tienen exactamente las mismas claves:
// test/i18n.test.js avisa si falta alguna.
// Criterio del estudio: no vincular el servicio con el paso de los socios por organismos públicos o
// internacionales, y en Quiénes somos mostrar solo apellidos y una reseña, sin fotos ni currículums.
export default {
  meta: {
    home: {
      title: 'Estudio EBI — Estudio jurídico especializado en derecho migratorio',
      description: 'Estudio jurídico especializado en derecho migratorio en Argentina. Residencias, DNI, ciudadanía, trámites para empresas y recursos contra expulsiones y denegatorias.',
    },
    empresas: {
      title: 'Migraciones para empresas: RENURE, residencias y trámite VIP | Estudio EBI',
      description: 'Asistencia integral a empresas que contratan o trasladan personal extranjero a la Argentina: RENURE, residencias por trabajo, trámite VIP, abono de seguimiento y trámites para la familia.',
    },
    quienes: {
      title: 'Quiénes somos | Estudio EBI',
      description: 'Estudio jurídico especializado en derecho migratorio. Asistencia y asesoramiento legal a personas extranjeras, empresas e instituciones en Argentina.',
    },
  },

  nav: {
    main: 'Principal',
    servicios: 'Servicios',
    empresas: 'Empresas',
    nosotros: 'Quiénes somos',
    actualidad: 'Actualidad',
    consultar: 'Consultar',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    language: 'Idioma',
    moreLanguages: 'Más idiomas',
    moreLanguagesNote: 'Traducción automática de Google',
  },

  // Nombres que muestra la guía de sección mientras se recorre la página
  guide: {
    servicios: 'Servicios',
    personas: 'Personas y familias',
    empresas: 'Empresas',
    porque: 'Por qué EBI',
    actualidad: 'Actualidad migratoria',
    opiniones: 'Opiniones',
    faq: 'Preguntas frecuentes',
    nosotros: 'Quiénes somos',
    contacto: 'Contacto',
  },

  common: {
    consult: 'Solicitar una consulta',
    proposal: 'Solicitar propuesta',
    solves: 'Lo que resolvemos',
    faqTitle: 'Preguntas frecuentes',
  },

  hero: {
    title: 'Estudio jurídico especializado en derecho migratorio',
    lead: 'Acompañamos a personas, familias y empresas en sus trámites migratorios y de ciudadanía en la Argentina, con información clara y seguimiento de cada caso.',
    links: { personas: 'Personas y familias', empresas: 'Empresas' },
    // Portada del inicio: línea de lugar sobre el título y la parte del título que va en cursiva
    // (tiene que aparecer tal cual dentro de title)
    place: 'Buenos Aires · Argentina',
    accent: 'derecho migratorio',
  },

  why: {
    eyebrow: 'Por qué EBI',
    title: 'Un estudio jurídico dedicado al derecho migratorio',
    lead: 'Cada trámite migratorio tiene consecuencias legales. Por eso lo encaramos como un estudio jurídico y no como una gestoría: analizamos tu caso, te explicamos las opciones y nos hacemos cargo del proceso completo.',
    items: [
      { title: 'Especialización', text: 'Nos dedicamos al derecho migratorio: residencias, ciudadanía, trámites para empresas y defensa frente a decisiones de Migraciones.' },
      { title: 'Información clara', text: 'Antes de empezar sabés qué requisitos, plazos y costos tiene tu trámite.' },
      { title: 'Seguimiento real', text: 'Seguimos cada expediente hasta su resolución y te avisamos cada novedad, lejos de las gestorías informales.' },
    ],
    rights: 'Trabajamos con un enfoque técnico y de protección de los derechos humanos, desde una posición profesional e independiente.',
  },

  servicios: {
    eyebrow: 'Servicios',
    title: 'Trámites migratorios para personas, familias y empresas',
    lead: 'Organizamos nuestro trabajo en seis áreas. En cada una te explicamos los requisitos, los plazos y los costos antes de empezar, y seguimos el expediente hasta su resolución.',
    areas: [
      { title: 'Residencias', text: 'Todas las categorías de residencia ante la Dirección Nacional de Migraciones.', items: ['Residencia Mercosur', 'Residencia temporaria y permanente', 'Renovación de residencia', 'Cambio de categoría migratoria'] },
      { title: 'Autorizaciones de trabajo', text: 'Para empresas que contratan personal extranjero y profesionales que vienen a trabajar al país.', items: ['Inscripción en el RENURE', 'Residencia por contrato de trabajo', 'Traslados intracompañía', 'Visas de negocios y cartas de invitación'] },
      { title: 'Ciudadanía y familia', text: 'Ciudadanía argentina y trámites para todo el grupo familiar.', items: ['Ciudadanía argentina', 'Situaciones de arraigo familiar', 'Reunificación familiar'] },
      { title: 'Recursos administrativos y judiciales', text: 'Defensa frente a decisiones infundadas o arbitrarias de Migraciones.', items: ['Órdenes de expulsión', 'Denegatorias y cancelaciones de residencia', 'Prohibiciones de ingreso', 'Recursos ante la DNM y la justicia federal'] },
      { title: 'DNI y documentación', text: 'Tu documentación personal, completa y al día.', items: ['Obtención de DNI para personas extranjeras', 'Actualización de documentación', 'Revisión de partidas y certificados', 'Documentación incompleta o vencida', 'Turnos y uso de plataformas digitales'] },
      { title: 'Gestión ante Migraciones', text: 'Seguimos cada expediente hasta su resolución.', items: ['Orientación y acompañamiento en procesos', 'Seguimiento de expedientes', 'Demoras o requerimientos pendientes'] },
    ],
  },

  personas: {
    eyebrow: 'Personas y familias',
    title: 'Para quienes llegan de países vecinos y de todo el mundo',
    lead: 'La mayor parte de la migración en la Argentina viene de países limítrofes. Te ayudamos con la residencia Mercosur, el DNI y todo lo que necesitás para vivir, trabajar o tener tu comercio en regla, y también con los trámites de cualquier otra nacionalidad.',
    items: [
      { title: 'Querés radicarte en Argentina', text: 'Residencia Mercosur, temporaria o permanente según tu nacionalidad y tu actividad.' },
      { title: 'Trabajás o tenés un comercio', text: 'Tu residencia y tu DNI en regla para trabajar por tu cuenta, en relación de dependencia o al frente de tu negocio.' },
      { title: 'Tu residencia venció o tu trámite está demorado', text: 'Regularización migratoria, renovaciones, cambios de categoría y respuesta a requerimientos.' },
      { title: 'Querés reunirte con tu familia', text: 'Reunificación familiar y residencia para tu cónyuge, hijos o padres.' },
      { title: 'Querés obtener la ciudadanía argentina', text: 'Preparamos tu legajo y te acompañamos hasta obtener tu carta de ciudadanía.' },
    ],
    other: { title: '¿Tu caso es otro?', text: 'Contanos tu situación y te orientamos sobre el camino más conveniente.', more: 'Consultar →' },
    urgent: {
      tag: 'Nuevo',
      title: 'Defensa ante expulsiones y denegatorias de residencia',
      text: 'Si la DNM dictó una orden de expulsión, prohibió tu ingreso o denegó tu residencia de forma infundada o arbitraria, podemos defenderte con recursos administrativos y judiciales. Los plazos son cortos: consultá cuanto antes.',
      cta: 'Consulta urgente',
    },
  },

  nosotros: {
    eyebrow: 'Quiénes somos',
    title: 'Asesoría migratoria y acceso a derechos',
    lead: 'Somos un estudio jurídico especializado en derecho migratorio. Brindamos asistencia y asesoramiento legal a personas extranjeras y a las empresas e instituciones que las convocan, para visitar el país, trabajar, estudiar, radicarse o defender sus derechos frente a decisiones arbitrarias.',
    resena: '[Reseña profesional del estudio: la envía el equipo]',
    nameTitle: 'Nuestro nombre',
    nameText: 'EBI reúne las iniciales de los apellidos de los socios.',
    enfoqueTitle: 'Nuestro enfoque',
    checks: ['Atención clara y personalizada', 'Acompañamiento durante todo el proceso', 'Información transparente sobre requisitos, tiempos y costos', 'Seguimiento real de cada caso', 'Comunicación simple y directa'],
    modesTitle: 'Modalidad de atención',
    modesLead: 'Te atendemos en persona o a distancia, en español o en inglés, y te mantenemos al tanto de cada novedad de tu expediente.',
    modes: [
      { title: 'Consultas presenciales y virtuales', text: 'En reuniones coordinadas o por videollamada, estés donde estés' },
      { title: 'Seguimiento por WhatsApp', text: 'Una vez recibida tu consulta, seguimos en contacto con respuestas rápidas' },
      { title: 'Seguimiento personalizado', text: 'Te avisamos cada novedad de tu expediente' },
      { title: 'Atención en español e inglés', text: 'Para personas, equipos de RR. HH. y empresas internacionales' },
    ],
  },

  opiniones: {
    eyebrow: 'Opiniones en Google',
    title: 'Lo que dicen quienes confiaron en nosotros',
    lead: 'Las reseñas de quienes ya hicieron sus trámites con nosotros, publicadas en nuestro perfil de Google.',
    all: 'Ver reseñas en Google',
    write: 'Dejar una reseña',
  },

  actualidad: {
    eyebrow: 'Actualidad migratoria',
    title: 'Novedades y análisis',
    lead: 'Cada semana publicamos Actualidad Migratoria, con los cambios en la normativa y cómo impactan en los trámites, junto con las noticias del sector. Si una novedad afecta tu caso o a tu empresa, consultanos.',
    carousel: 'Novedades',
    prev: 'Anterior',
    next: 'Siguiente',
    pause: 'Pausar el carrusel',
    play: 'Reanudar el carrusel',
    all: 'Ver todas las publicaciones',
    repositorio: 'Repositorio jurídico',
    repositorioText: 'Leyes, decretos y disposiciones migratorias, con enlace a la fuente oficial.',
    note: 'Las noticias de medios se seleccionan automáticamente y se actualizan cada 30 minutos. Para información oficial visitá',
  },

  faq: {
    lead: 'Respuestas a las consultas más comunes de personas, familias y empresas. Si no encontrás la tuya, escribinos.',
    items: [
      { q: '¿Trabajan con personas de cualquier nacionalidad?', a: 'Sí. Asesoramos a personas de países limítrofes, del Mercosur y de cualquier otra nacionalidad, cada una con sus requisitos y vías de residencia.' },
      { q: '¿En qué se diferencian de una gestoría?', a: 'Somos un estudio jurídico: analizamos cada caso desde lo legal, te explicamos las opciones y sus riesgos, y podemos defenderte si Migraciones rechaza un trámite.' },
      { q: '¿Qué hago si me notificaron una expulsión o me denegaron la residencia?', a: 'Contactanos lo antes posible. Hay plazos cortos para presentar recursos administrativos y judiciales, y es clave revisar el expediente cuanto antes.' },
      { q: '¿Cuánto tarda una residencia o el DNI?', a: 'Los plazos varían según la categoría y la carga de Migraciones. En la consulta te damos una estimación concreta para tu caso, junto con los requisitos y costos.' },
      { q: '¿Asesoran a empresas que contratan personal extranjero?', a: 'Sí. Nos ocupamos de la inscripción de la empresa en el RENURE, de las residencias por trabajo y de los trámites del grupo familiar de cada trabajador. Encontrás el detalle en la sección Empresas.' },
      { q: '¿En qué idiomas atienden?', a: 'Atendemos en español e inglés. El sitio también está en portugués, chino y ruso para que puedas conocer nuestros servicios en tu idioma.' },
      { q: '¿Puedo hacer la consulta desde el exterior?', a: 'Sí. Podemos analizar tu caso por videollamada antes de que viajes y ayudarte a reunir la documentación que tenés que traer.' },
    ],
  },

  contacto: {
    eyebrow: 'Contacto',
    title: 'Estamos para acompañarte en cada paso',
    lead: 'Hacia tu tranquilidad y tus derechos. Completá el formulario con tu consulta y te respondemos a la brevedad.',
    emailPending: '[EMAIL]',
  },

  form: {
    as: 'Consultás como',
    persona: 'Persona',
    empresa: 'Empresa',
    nombre: 'Nombre y apellido',
    empresaLabel: 'Empresa o institución',
    cargo: 'Cargo',
    email: 'Email',
    tel: 'WhatsApp',
    pais: 'Nacionalidad',
    paisEmpresa: 'Nacionalidad del personal',
    personas: 'Cantidad de personas',
    personasOpts: { uno: '1', pocos: '2 a 5', varios: '6 a 20', muchos: 'Más de 20' },
    tipo: 'Tipo de consulta',
    tiposPersona: {
      residencia: 'Residencia',
      regularizacion: 'Regularización migratoria',
      dni: 'DNI y documentación',
      ciudadania: 'Ciudadanía argentina',
      familia: 'Reunificación familiar',
      expulsion: 'Expulsión o denegatoria de residencia',
      otra: 'Otra',
    },
    tiposEmpresa: {
      renure: 'Inscripción en el RENURE',
      trabajo: 'Residencia por trabajo',
      vip: 'Trámite VIP',
      seguimiento: 'Abono de seguimiento',
      traslado: 'Traslado de personal y su familia',
      negocios: 'Visas de negocios o cartas de invitación',
      cumplimiento: 'Cumplimiento migratorio y vencimientos',
      otra: 'Otra',
    },
    msgPersona: 'Contanos brevemente tu situación',
    msgEmpresa: 'Contanos qué necesita tu empresa',
    sendEmail: 'Enviar consulta',
    sendWa: 'Enviar por WhatsApp',
    note: 'Usamos tus datos solo para responder tu consulta.',
  },

  // Textos que arma el script en el navegador
  ui: {
    stars: ' de 5 estrellas',
    reviews: ' reseñas en Google',
    revFallback: 'Conocé las opiniones de quienes ya hicieron sus trámites con nosotros directamente en nuestro perfil de Google.',
    more: 'Leer nota →',
    read: 'Leer →',
    studio: 'Estudio EBI',
    newsFallback: 'Consultá las últimas novedades oficiales de la Dirección Nacional de Migraciones',
    newsFallbackLink: 'Ir a argentina.gob.ar →',
    catDefault: 'Migraciones',
    inSpanish: '',
    errRequired: 'Completá tu nombre y una breve descripción de tu consulta.',
    errEmpresa: 'Indicá el nombre de la empresa.',
    errEmail: 'Dejanos un email válido para responderte.',
    sending: 'Enviando…',
    sent: '¡Gracias! Recibimos tu consulta y te vamos a responder a la brevedad.',
    sendError: 'No pudimos enviar la consulta. Probá de nuevo o ',
    sendErrorLink: 'enviala por WhatsApp',
    waHello: 'Hola Estudio EBI, soy',
    waCompany: 'Empresa',
    waPeople: 'Personas',
    waTopic: 'Consulta',
    waPhone: 'Mi WhatsApp',
  },

  cats: {
    newsletter: 'Newsletter',
    normativa: 'Normativa',
    residencias: 'Residencias',
    ciudadania: 'Ciudadanía',
    trabajo: 'Trabajo y empresas',
    expulsiones: 'Expulsiones',
    general: 'Migraciones',
  },

  footer: {
    tagline: 'Estudio jurídico especializado en derecho migratorio.',
    nav: 'Pie de página',
    sections: 'Secciones',
    contact: 'Contacto',
    formLink: 'Formulario de consulta',
    social: 'Seguinos',
    group: 'Grupo de Facebook',
    rights: 'Todos los derechos reservados.',
  },

  // Sección Empresas (en el inicio) y subpágina /empresas para campañas
  pages: {
    empresas: {
      hero: {
        eyebrow: 'Empresas',
        title: 'Asistencia migratoria integral para empresas y su personal extranjero',
        lead: 'Acompañamos a empresas e instituciones que contratan o trasladan trabajadores y especialistas a la Argentina: desde la inscripción en el RENURE hasta la residencia de cada persona y de su familia, con seguimiento de cada expediente.',
        bullets: ['Inscripción y actualización en el RENURE', 'Residencias, permisos de ingreso y visas de trabajo, con opción de trámite VIP', 'Trámites para el grupo familiar', 'Seguimiento de expedientes y vencimientos de todo el personal'],
      },
      cards: {
        eyebrow: 'Asistencia integral',
        title: 'Para la empresa, el trabajador y su familia',
        lead: 'Un solo equipo para todo el proceso, con información clara de plazos y requisitos para cada puesto.',
        items: [
          { title: 'Para la empresa', items: ['Inscripción y actualización en el RENURE', 'Estrategia migratoria para cada puesto', 'Cartas de invitación y visas de negocios', 'Control de vencimientos y cumplimiento migratorio'] },
          { title: 'Para el trabajador', items: ['Residencias, permisos de ingreso y visas de trabajo', 'Traslados intracompañía', 'Técnicos y profesionales por estadías cortas', 'DNI, CUIL y documentación'] },
          { title: 'Para su familia', items: ['Residencia para cónyuge e hijos', 'Reunificación familiar', 'DNI y documentación del grupo familiar', 'Renovaciones y residencia permanente'] },
        ],
      },
      modalidades: {
        eyebrow: 'Formas de contratar',
        title: 'Por trámite, con abono de seguimiento o por la vía VIP',
        lead: 'Elegí cómo trabajar con nosotros según la cantidad de personas y la urgencia de cada caso.',
        items: [
          { title: 'Por trámite', text: 'Contratás la gestión de cada persona por separado. Ideal para un traslado puntual o una contratación aislada.' },
          { title: 'Abono de seguimiento', text: 'Un abono que cubre el monitoreo permanente de los expedientes y vencimientos de todo tu personal extranjero, con avisos anticipados y un reporte periódico del estado de cada caso.' },
          { title: 'Trámite VIP', text: 'Gestionamos la modalidad de atención prioritaria que ofrece la Dirección Nacional de Migraciones, para los casos que necesitan resolverse con urgencia.' },
        ],
      },
      steps: {
        title: 'Cómo trabajamos con empresas',
        items: [
          { title: 'Diagnóstico', text: 'Analizamos el perfil, el puesto y los plazos de cada traslado.' },
          { title: 'Documentación', text: 'Inscripción en el RENURE, contratos, legalizaciones y apostillas.' },
          { title: 'Presentación', text: 'Iniciamos y gestionamos cada trámite ante la Dirección Nacional de Migraciones.' },
          { title: 'Seguimiento', text: 'Monitoreamos cada expediente y los vencimientos de todo el personal extranjero, por caso o con un abono de seguimiento.' },
        ],
      },
      callout: '',
      faqLead: 'Respuestas a las consultas más comunes de empresas que contratan o trasladan personal extranjero. Si no encontrás la tuya, escribinos.',
      faq: [
        { q: '¿Qué es el RENURE?', a: 'Es el Registro Nacional Único de Requirentes de Extranjeros de la Dirección Nacional de Migraciones. Las empresas e instituciones que quieren convocar personal extranjero tienen que estar inscriptas para poder iniciar sus residencias.' },
        { q: '¿Qué es el trámite VIP?', a: 'Es la modalidad de atención prioritaria que ofrece la Dirección Nacional de Migraciones. Te decimos si el caso puede tramitarse por esa vía y nos ocupamos de la gestión.' },
        { q: '¿Cómo funciona el abono de seguimiento?', a: 'Con el abono monitoreamos de forma permanente los expedientes y los vencimientos de todo tu personal extranjero, y te enviamos un reporte periódico. Es la opción más práctica para empresas con varias personas en trámite.' },
        { q: '¿Pueden viajar con el trabajador su cónyuge e hijos?', a: 'Sí. El grupo familiar puede tramitar su residencia por reunificación familiar. Coordinamos los trámites de toda la familia junto con los del trabajador.' },
        { q: '¿Cuánto tarda la residencia de un trabajador?', a: 'Depende de la categoría, la nacionalidad y la documentación. En la primera reunión te damos un cronograma estimado para cada caso.' },
        { q: '¿Un visitante de negocios puede trabajar en el país?', a: 'No. Una visita de negocios permite reuniones y actividades comerciales, pero las tareas técnicas o profesionales requieren otra categoría migratoria. Te ayudamos a elegir la correcta para evitar sanciones.' },
      ],
    },
  },
};
