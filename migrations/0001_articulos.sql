-- Artículos y ediciones de la newsletter Actualidad Migratoria
CREATE TABLE articulos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL DEFAULT '',
  cuerpo TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT 'general',
  autor TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado')),
  publicado_en TEXT,
  creado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  actualizado_en TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  editado_por TEXT NOT NULL DEFAULT ''
);

CREATE INDEX articulos_publicados ON articulos (estado, publicado_en DESC);
