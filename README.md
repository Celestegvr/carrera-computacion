# Ingeniería en Computación · UNHSJM

Página web informativa de la carrera de Ingeniería en Computación de la Universidad Nacional Héroes de San José de las Mulas.

## Secciones
1. Carrusel informativo
2. Menú principal
3. Organigrama de la universidad
4. Descripción de la carrera
5. Modalidad, duración y horarios
6. Perfiles de salida
7. Áreas de estudio
8. Plan de estudio por modalidad
9. Reseñas
10. Formulario de comentarios

## Tecnologías
- HTML5, CSS3 (hoja de estilo propia) y JavaScript sin frameworks.
- Base de datos en línea: Supabase (PostgreSQL) mediante su API REST.
- Publicación: Vercel.

## Estructura
```
index.html            Página
css/estilos.css       Hoja de estilo
js/datos.js           Contenido de la carrera (plan, áreas, perfiles, modalidad, organigrama)
js/config.js          URL y clave pública de Supabase
js/comentarios.js     Lectura y guardado de comentarios (fetch a la API REST)
js/app.js             Carrusel, menú, filtros, reseñas y formulario
supabase/esquema.sql  Tabla de comentarios y políticas de seguridad (RLS)
img/                  Logo, ícono y fotos del carrusel
```

## Base de datos
Ejecutar `supabase/esquema.sql` en el SQL Editor de Supabase. La tabla `comentarios` tiene seguridad a nivel de fila: el público solo puede leer comentarios visibles e insertar nuevos.

## Ejecutar en local
```
python -m http.server 5540
```
y abrir http://localhost:5540

## Créditos
Fotografías de Wikimedia Commons (autores y licencias en el pie de página).

Elaborado por María Celeste Guevara, 2026.
