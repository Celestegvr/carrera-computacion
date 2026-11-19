/* Conexión con la base de datos en línea (Supabase).
   La clave "anon" es pública por diseño: la seguridad está en las políticas
   RLS de la tabla (solo se permite leer comentarios visibles e insertar nuevos).
   Ver supabase/esquema.sql. */
const SUPABASE = {
  url: "https://rwkphsltzrmbyktvsdfl.supabase.co",
  anonKey: "sb_publishable__kmbaPn1phGr8GN5MxZMFw_LmrFSgK7",
  tabla: "comentarios",
};
