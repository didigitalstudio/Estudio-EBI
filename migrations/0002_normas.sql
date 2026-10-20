-- Repositorio jurídico de Actualidad Migratoria: normas con enlace a la fuente oficial
CREATE TABLE normas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'otro' CHECK (tipo IN ('ley', 'decreto', 'dnu', 'disposicion', 'resolucion', 'boletin', 'otro')),
  numero TEXT NOT NULL DEFAULT '',
  fecha TEXT,
  url TEXT NOT NULL,
  resumen TEXT NOT NULL DEFAULT '',
  creado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  actualizado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  editado_por TEXT NOT NULL DEFAULT ''
);

CREATE INDEX normas_fecha ON normas (fecha DESC);

-- Normas base para arrancar; los socios las editan o suman otras desde el panel
INSERT INTO normas (titulo, tipo, numero, fecha, url, resumen) VALUES
  ('Ley de Migraciones', 'ley', '25.871', '2003-12-17', 'https://www.argentina.gob.ar/normativa/nacional/92016/actualizacion', 'Derechos y obligaciones de las personas migrantes, categorías de residencia y procedimientos ante la Dirección Nacional de Migraciones. Texto actualizado.'),
  ('Reglamentación de la Ley de Migraciones', 'decreto', '616/2010', '2010-05-03', 'https://www.argentina.gob.ar/normativa/nacional/decreto-616-2010-167004', 'Reglamenta la Ley 25.871: requisitos de cada categoría de residencia, plazos y trámites.'),
  ('Modificaciones a la Ley de Migraciones y a la Ley de Ciudadanía', 'dnu', '366/2025', '2025-05-28', 'https://www.argentina.gob.ar/normativa/nacional/decreto-366-2025-413297', 'Decreto de necesidad y urgencia que modifica la Ley de Migraciones 25.871 y la Ley de Ciudadanía 346.'),
  ('Ley de Ciudadanía y Naturalización', 'ley', '346', NULL, 'https://www.argentina.gob.ar/normativa/nacional/ley-346-48854/texto', 'Regula la ciudadanía argentina por nacimiento, por opción y por naturalización.'),
  ('Boletín Oficial de la República Argentina', 'boletin', '', NULL, 'https://www.boletinoficial.gob.ar/', 'Publicación diaria de leyes, decretos y disposiciones, incluidas las de la Dirección Nacional de Migraciones.');
