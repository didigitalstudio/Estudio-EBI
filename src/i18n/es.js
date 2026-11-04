// Textos del sitio en español. Los otros idiomas (en, pt, zh, ru) tienen exactamente las mismas claves:
// test/i18n.test.js avisa si falta alguna.
// Criterio del estudio (cambios del 3/11): la trayectoria del equipo se describe en términos generales
// (ejercicio profesional, gestión pública, cooperación internacional) sin nombrar organismos, y en Quiénes
// somos figuran solo los apellidos, sin fotos ni currículums.
// En los textos largos, **así** marca una parte en negrita.
export default {
  meta: {
    home: {
      title: 'Estudio EBI — Estudio jurídico especializado en derecho migratorio',
      description: 'Estudio jurídico especializado en derecho migratorio y movilidad internacional en Argentina. Asesoramiento y asistencia jurídica en residencias, ciudadanía, movilidad laboral y recursos administrativos y judiciales.',
    },
    empresas: {
      title: 'Movilidad internacional para empresas: RENURE, visas y residencias | Estudio EBI',
      description: 'Asesoramiento jurídico a empresas e instituciones en la contratación y movilidad internacional de personal extranjero: RENURE, autorizaciones de ingreso, visas, residencias y cumplimiento migratorio.',
    },
    quienes: {
      title: 'Quiénes somos | Estudio EBI',
      description: 'Estudio jurídico con sede en Buenos Aires especializado en derecho migratorio y movilidad internacional. Asesoramiento y representación jurídica a personas, familias, empresas e instituciones.',
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
    lead: 'Brindamos asesoramiento y asistencia jurídica a personas, familias, empresas e instituciones en materia migratoria, incluyendo procedimientos de ingreso, residencia, regularización y movilidad internacional en Argentina.',
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
    title: 'Servicios jurídicos en derecho migratorio y movilidad internacional',
    lead: [
      'El régimen migratorio argentino, regulado principalmente por la Ley de Migraciones N.º 25.871 y sus normas complementarias, establece las condiciones para el ingreso, la residencia y la permanencia de personas extranjeras en el país, así como los derechos y obligaciones que derivan de su situación migratoria.',
      'La diversidad de situaciones que contempla este marco normativo requiere respuestas jurídicas específicas, tanto para quienes proyectan establecerse en Argentina como para quienes ya residen en el país, sus familias y las empresas e instituciones que promueven la movilidad internacional de personas. Estudio EBI brinda asesoramiento en las siguientes áreas de práctica:',
    ],
    areas: [
      {
        title: 'Residencias y regularización migratoria',
        text: 'La legislación argentina contempla distintas categorías de residencia según la nacionalidad, los vínculos familiares y las actividades que desarrolla cada persona. Asesoramos en la identificación del encuadre migratorio correspondiente y en los procedimientos para obtener, renovar o regularizar la residencia en Argentina.',
        items: ['Residencias temporarias y permanentes.', 'Residencias para nacionales del MERCOSUR y Estados asociados.', 'Residencias por trabajo, estudios y otras categorías previstas en la normativa.', 'Renovaciones y cambios de categoría migratoria.', 'Regularización de situaciones migratorias.'],
      },
      {
        title: 'Movilidad laboral internacional',
        text: 'El ingreso y la permanencia de trabajadores extranjeros requieren considerar tanto la actividad que desarrollarán en Argentina como las obligaciones migratorias de las entidades que los convocan. Asesoramos a empresas, instituciones y profesionales en la determinación de las autorizaciones y categorías migratorias aplicables.',
        items: ['Autorizaciones de ingreso y residencias por motivos laborales.', 'Traslados de personal entre empresas de un mismo grupo.', 'Ingreso de profesionales, técnicos y personal especializado.', 'Inscripción y actualización de entidades ante el RENURE.', 'Visas de negocios y actividades profesionales de corta duración.'],
      },
      {
        title: 'Ciudadanía y reunificación familiar',
        text: 'Los vínculos familiares pueden dar lugar a diferentes derechos y procedimientos en materia de residencia y nacionalidad. Brindamos asesoramiento sobre las vías legales para la reunificación familiar, la residencia por vínculos familiares y el acceso a la ciudadanía argentina, de acuerdo con los requisitos de cada régimen.',
        items: ['Residencias por vínculos familiares.', 'Reunificación familiar.', 'Ciudadanía argentina por opción.', 'Ciudadanía argentina por naturalización.', 'Documentación y acreditación de vínculos familiares.'],
      },
      {
        title: 'Recursos administrativos y judiciales',
        text: 'Las decisiones de la autoridad migratoria pueden afectar el ingreso, la residencia o la permanencia de personas extranjeras en Argentina. Intervenimos en el análisis jurídico de estas decisiones y en la presentación de los recursos y acciones que correspondan conforme a la legislación vigente.',
        items: ['Denegatorias y cancelaciones de residencia.', 'Órdenes de expulsión y prohibiciones de ingreso.', 'Recursos administrativos ante la Dirección Nacional de Migraciones.', 'Acciones y recursos ante la justicia competente.', 'Asistencia jurídica en procedimientos migratorios complejos.'],
      },
      {
        title: 'Documentación migratoria e identificación',
        text: 'La obtención y actualización de documentos constituye una parte esencial del ejercicio de los derechos de las personas extranjeras que residen en Argentina. Asistimos en procedimientos de identificación y en la adecuación de la documentación personal a las exigencias de las autoridades competentes.',
        items: ['Obtención y actualización del DNI para personas extranjeras.', 'Rectificación y actualización de datos personales.', 'Revisión de partidas, certificados y documentación extranjera.', 'Legalizaciones, apostillas y traducciones requeridas.', 'Subsanación de observaciones documentales.'],
      },
      {
        title: 'Ingreso y permanencia en Argentina',
        text: 'El régimen migratorio establece diferentes condiciones de admisión y permanencia según el motivo del viaje, la nacionalidad y la actividad prevista en el país. Asesoramos a personas, empresas e instituciones en la evaluación de los requisitos aplicables y en la resolución de situaciones que puedan dificultar el ingreso o la continuidad de la estadía.',
        items: ['Permisos y autorizaciones de ingreso.', 'Visas y estadías transitorias.', 'Prórrogas de permanencia.', 'Asistencia ante inconvenientes de admisión en frontera.', 'Evaluación de situaciones migratorias especiales.'],
      },
    ],
  },

  personas: {
    eyebrow: 'Personas y familias',
    title: 'Asesoramiento migratorio para personas y familias',
    lead: 'Asesoramos a personas extranjeras y sus familias en los procedimientos de ingreso, residencia, regularización migratoria y reunificación familiar en Argentina. Brindamos asistencia jurídica de acuerdo con la situación particular de cada persona y la normativa migratoria aplicable.',
    items: [
      { title: '¿Querés radicarte en Argentina?', text: 'Te asesoramos para obtener tu residencia en Argentina, ya sea por el régimen Mercosur o por otras categorías migratorias, según tu nacionalidad y situación particular.' },
      { title: '¿Necesitás regularizar tu situación para trabajar?', text: 'Te asesoramos sobre los requisitos migratorios para trabajar en Argentina, tanto en relación de dependencia como en actividades profesionales o independientes.' },
      { title: '¿Tu residencia venció o tu trámite está demorado?', text: 'Te asistimos en la renovación y regularización de tu residencia, los cambios de categoría migratoria y la respuesta a requerimientos o demoras administrativas.' },
      { title: '¿Querés reunirte con tu familia?', text: 'Te asesoramos en los procedimientos de reunificación familiar y obtención de residencias por vínculos familiares, de acuerdo con la normativa migratoria vigente.' },
      { title: '¿Querés obtener la ciudadanía argentina?', text: 'Te brindamos asesoramiento jurídico sobre los requisitos y procedimientos para solicitar la ciudadanía argentina, de acuerdo con tu situación particular.' },
    ],
    other: { title: '¿Tu situación es diferente?', text: 'Contanos tu caso. Evaluamos tu situación migratoria y te orientamos sobre las alternativas jurídicas disponibles.', more: 'Consultar →' },
    urgent: {
      tag: 'Nuevo',
      title: 'Defensa ante expulsiones y denegatorias de residencia',
      text: [
        'Si recibiste una orden de expulsión, una prohibición de ingreso o una denegatoria de residencia, podemos evaluar tu situación y brindarte asistencia jurídica mediante las vías administrativas y judiciales que correspondan.',
        'Estos procedimientos pueden estar sujetos a plazos breves. Consultanos cuanto antes.',
      ],
      cta: 'Consulta urgente',
    },
  },

  nosotros: {
    eyebrow: 'Quiénes somos',
    title: 'Experiencia jurídica, institucional e internacional en materia migratoria',
    lead: 'Estudio EBI es un estudio jurídico con sede en Buenos Aires, integrado por **Estomba, Boquicio e Izura**, especializado en Derecho Migratorio y Movilidad Internacional.',
    body: [
      'Nuestro equipo reúne trayectorias profesionales complementarias en el ejercicio del derecho migratorio, los procedimientos administrativos y judiciales, la gestión pública migratoria y la cooperación internacional.',
      'Esta combinación de experiencias nos permite abordar las cuestiones migratorias desde una perspectiva jurídica integral, con conocimiento de la normativa aplicable, del funcionamiento de las instituciones y de las particularidades de cada situación.',
      'Brindamos asesoramiento y representación jurídica a personas, familias, empresas e instituciones, tanto en procedimientos migratorios habituales como en situaciones que requieren intervenciones de mayor complejidad.',
    ],
    expTitle: 'Nuestra experiencia',
    exp: [
      { title: 'Derecho migratorio y actuación judicial', text: 'Experiencia en asesoramiento jurídico, procedimientos administrativos, recursos y actuaciones judiciales vinculadas con decisiones de las autoridades migratorias, incluyendo situaciones de ingreso, permanencia, residencia y expulsión.' },
      { title: 'Gestión pública y procedimientos migratorios', text: 'Conocimiento directo del funcionamiento de la administración migratoria argentina, sus procedimientos, requisitos y mecanismos de intervención, adquirido a través de la experiencia profesional en el ámbito público.' },
      { title: 'Movilidad humana y cooperación internacional', text: 'Trayectoria en organismos internacionales y programas de cooperación, con experiencia en protección de derechos, movilidad humana, gestión migratoria y articulación con instituciones públicas de Argentina y otros países de América Latina y a nivel mundial.' },
    ],
    enfoqueTitle: 'Nuestro enfoque',
    enfoque: 'Combinamos el rigor jurídico con el conocimiento institucional y una perspectiva de protección de derechos. Analizamos cada situación de manera individual, identificamos las alternativas legales disponibles y brindamos un asesoramiento claro, responsable y adecuado a las necesidades de nuestros clientes.',
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
    lead: 'En Actualidad Migratoria compartimos novedades normativas, jurisprudencia y análisis sobre cuestiones relevantes del derecho migratorio en Argentina. Abordamos sus implicancias para las personas extranjeras, las familias, las empresas y las instituciones.',
    all: 'Ver todas las publicaciones',
    empty: 'Muy pronto vas a encontrar acá las publicaciones de Actualidad Migratoria.',
    normativa: 'Normativa migratoria',
    normativaText: 'Leyes, decretos y disposiciones migratorias, con enlace a la fuente oficial.',
    normativaAll: 'Ver toda la normativa',
    normativaSee: 'Ver la norma',
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
    eyebrow: 'Contactanos',
    title: 'Asesoramiento jurídico en materia migratoria',
    lead: 'Contanos brevemente tu consulta. Nuestro equipo evaluará tu solicitud y se pondrá en contacto para informarte cómo podemos asistirte.',
    // Nombre del estudio y lugar en la columna de datos de contacto
    studio: 'Estudio Jurídico EBI',
    place: 'Buenos Aires, Argentina',
    email: 'Correo electrónico',
    emailPending: '[EMAIL]',
    wa: 'WhatsApp',
  },

  form: {
    as: 'Consultás como',
    persona: 'Persona',
    empresa: 'Empresa',
    nombre: 'Nombre y apellido',
    contacto: 'Nombre y apellido de la persona de contacto',
    empresaLabel: 'Nombre de la empresa o institución',
    email: 'Correo electrónico',
    tel: 'WhatsApp, con código de país',
    pais: 'Nacionalidad',
    tipo: 'Tipo de consulta',
    tipoPick: 'Elegí una opción',
    // La clave de cada opción es fija (la usan los botones que dejan el formulario listo para un caso);
    // el texto que llega al estudio es siempre el del español
    tiposPersona: {
      residencias: 'Residencias y regularización migratoria',
      ingreso: 'Autorizaciones de ingreso y visas',
      ciudadania: 'Ciudadanía argentina',
      familia: 'Reunificación familiar',
      dni: 'DNI y documentación migratoria',
      recursos: 'Recursos administrativos y judiciales',
      otra: 'Otras consultas',
    },
    tiposEmpresa: {
      contratacion: 'Contratación de personal extranjero',
      ingreso: 'Autorizaciones de ingreso, visas y residencias',
      renure: 'Inscripción y actualización en RENURE',
      traslados: 'Traslados internacionales de personal',
      cumplimiento: 'Asesoramiento y cumplimiento normativo migratorio',
      otra: 'Otras consultas',
    },
    msgPersona: 'Contanos brevemente tu situación',
    msgEmpresa: 'Contanos brevemente qué asistencia necesitás',
    requiredNote: 'Los campos marcados con * son obligatorios.',
    contactHint: 'Completá al menos uno: correo electrónico o WhatsApp.',
    sendEmail: 'Enviar consulta',
    sendWa: 'Consultar por WhatsApp',
    privacyTitle: 'Protección de datos personales',
    privacy: 'Los datos personales proporcionados a través de este formulario serán tratados por Estudio EBI para gestionar y responder las consultas recibidas, de conformidad con la Ley N.º 25.326 de Protección de Datos Personales.',
  },

  // Textos que arma el script en el navegador
  ui: {
    stars: ' de 5 estrellas',
    reviews: ' reseñas en Google',
    revFallback: 'Conocé las opiniones de quienes ya hicieron sus trámites con nosotros directamente en nuestro perfil de Google.',
    more: 'Leer nota →',
    read: 'Leer nota →',
    newsFallback: 'Consultá las últimas novedades oficiales de la Dirección Nacional de Migraciones',
    newsFallbackLink: 'Ir a argentina.gob.ar →',
    catDefault: 'Migraciones',
    inSpanish: '',
    errRequired: 'Completá tu nombre y una breve descripción de tu consulta.',
    errEmpresa: 'Indicá el nombre de la empresa o institución.',
    errContact: 'Dejanos al menos un medio de contacto: correo electrónico o WhatsApp.',
    errEmail: 'Dejanos un correo electrónico válido para responderte.',
    errTel: 'Revisá el número de WhatsApp e incluí el código de país.',
    errTipo: 'Elegí el tipo de consulta.',
    sending: 'Enviando…',
    sentTitle: 'Recibimos tu consulta',
    sent: 'Gracias por escribirnos. Nuestro equipo evaluará tu solicitud y se pondrá en contacto a la brevedad.',
    sentAgain: 'Enviar otra consulta',
    sendError: 'No pudimos enviar la consulta. Probá de nuevo o ',
    sendErrorLink: 'consultanos por WhatsApp',
    waTitle: 'Revisá tu mensaje',
    waText: 'Así va a llegar tu consulta por WhatsApp. Podés corregirlo antes de abrir la conversación.',
    waOpen: 'Abrir WhatsApp',
    waCancel: 'Volver',
    waHello: 'Hola Estudio EBI, soy',
    waHelloAnon: 'Hola Estudio EBI, quería hacer una consulta.',
    waCompany: 'Empresa',
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
        title: 'Asesoramiento jurídico en movilidad internacional para empresas',
        lead: [
          'La normativa migratoria argentina contempla distintas modalidades de ingreso y residencia para personas extranjeras que desarrollan actividades laborales, profesionales, técnicas o académicas en el país. Los requisitos y procedimientos aplicables varían según la nacionalidad, la actividad que se realizará, la duración de la estadía y las características de la organización que recibe o contrata al personal.',
          'En este marco, Estudio EBI brinda asesoramiento jurídico a empresas e instituciones en los procesos de contratación y movilidad internacional de trabajadores, profesionales y especialistas. Nuestra asistencia comprende la evaluación de las alternativas migratorias, autorizaciones de ingreso, visas, residencias, inscripción en el RENURE y cumplimiento de las obligaciones migratorias, así como el acompañamiento de los trabajadores y sus familias.',
        ],
        bullets: ['Inscripción y actualización en el RENURE', 'Autorizaciones de ingreso, visas y residencias', 'Traslados corporativos y personal especializado', 'Residencias y documentación para el grupo familiar', 'Seguimiento de procedimientos y cumplimiento migratorio'],
      },
      cards: {
        eyebrow: 'Asistencia integral',
        title: 'Para la empresa, el personal y su familia',
        lead: 'Un solo equipo para todo el proceso, con información clara de plazos y requisitos para cada puesto.',
        items: [
          { title: 'Empresas e instituciones', items: ['Inscripción y actualización en el RENURE.', 'Asesoramiento sobre obligaciones migratorias de las entidades requirentes.', 'Evaluación de alternativas migratorias para incorporar personal extranjero.', 'Cartas de invitación y viajes de negocios.'] },
          { title: 'Movilidad internacional de personal', items: ['Autorizaciones de ingreso, visas y residencias.', 'Traslados corporativos.', 'Ingreso de profesionales, técnicos y especialistas para actividades temporales.', 'Documentación migratoria y seguimiento de procedimientos.'] },
          { title: 'Familias y acompañantes', items: ['Reunificación familiar.', 'Residencias para integrantes del grupo familiar.', 'Obtención de DNI y documentación migratoria.', 'Renovaciones y cambios de categoría migratoria.'] },
        ],
      },
      modalidades: {
        eyebrow: 'Formas de contratar',
        title: 'Modalidades de contratación para empresas',
        lead: 'Ofrecemos distintas modalidades de asesoramiento y asistencia jurídica migratoria, adaptadas a las necesidades de cada organización, la cantidad de trabajadores involucrados y las características de los procedimientos.',
        items: [
          { title: 'Asesoramiento por caso', text: 'Brindamos asesoramiento y gestionamos procedimientos migratorios específicos para la incorporación o el traslado de personal extranjero a Argentina. Esta modalidad está dirigida a empresas que requieren asistencia para contrataciones o traslados puntuales.' },
          { title: 'Asesoramiento migratorio permanente', text: 'Ofrecemos un servicio de acompañamiento continuo para empresas que cuentan con personal extranjero, incluyendo seguimiento de expedientes, control de vencimientos, asesoramiento sobre obligaciones migratorias e informes periódicos.' },
          { title: 'Trámite corporativo', text: 'Asesoramos y asistimos a las empresas en la utilización del procedimiento de trámite corporativo previsto por la Dirección Nacional de Migraciones, cuando resulte aplicable, incluyendo la preparación de la documentación y el seguimiento de las actuaciones correspondientes.' },
        ],
      },
      steps: {
        title: 'Cómo trabajamos con empresas',
        items: [
          { title: 'Evaluación jurídica', text: 'Analizamos las necesidades de la empresa, el perfil del personal extranjero y las alternativas migratorias aplicables.' },
          { title: 'Preparación documental', text: 'Asistimos en la recopilación, revisión y preparación de la documentación requerida para cada procedimiento.' },
          { title: 'Gestión de procedimientos', text: 'Realizamos las presentaciones y gestiones correspondientes ante la Dirección Nacional de Migraciones y otros organismos competentes.' },
          { title: 'Seguimiento y cumplimiento migratorio', text: 'Acompañamos los procedimientos, monitoreamos vencimientos y asesoramos sobre las obligaciones migratorias aplicables.' },
        ],
      },
      callout: '',
      faqLead: 'Respuestas a las consultas más comunes de empresas que contratan o trasladan personal extranjero. Si no encontrás la tuya, escribinos.',
      faq: [
        { q: '¿Qué es el RENURE?', a: 'Es el Registro Nacional Único de Requirentes de Extranjeros de la Dirección Nacional de Migraciones. Las empresas e instituciones que quieren convocar personal extranjero tienen que estar inscriptas para poder iniciar sus residencias.' },
        { q: '¿Qué es el trámite corporativo?', a: 'Es un procedimiento previsto por la Dirección Nacional de Migraciones para la gestión de trámites de empresas. Evaluamos si resulta aplicable a tu caso, preparamos la documentación y seguimos las actuaciones correspondientes.' },
        { q: '¿Cómo funciona el asesoramiento migratorio permanente?', a: 'Es un acompañamiento continuo para empresas con personal extranjero: seguimos los expedientes, controlamos los vencimientos, te asesoramos sobre las obligaciones migratorias de la empresa y te enviamos informes periódicos.' },
        { q: '¿Pueden viajar con el trabajador su cónyuge e hijos?', a: 'Sí. El grupo familiar puede tramitar su residencia por reunificación familiar. Coordinamos los trámites de toda la familia junto con los del trabajador.' },
        { q: '¿Cuánto tarda la residencia de un trabajador?', a: 'Depende de la categoría, la nacionalidad y la documentación. En la primera reunión te damos un cronograma estimado para cada caso.' },
        { q: '¿Un visitante de negocios puede trabajar en el país?', a: 'No. Una visita de negocios permite reuniones y actividades comerciales, pero las tareas técnicas o profesionales requieren otra categoría migratoria. Te ayudamos a elegir la correcta para evitar sanciones.' },
      ],
    },
  },
};
