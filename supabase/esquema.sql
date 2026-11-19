-- Base de datos de comentarios · Ingeniería en Computación UNHSJM
-- Ejecutar en Supabase: SQL Editor -> New query -> Run

create table if not exists public.comentarios (
  id           bigint generated always as identity primary key,
  nombre       text        not null check (char_length(btrim(nombre)) between 2 and 60),
  rol          text        not null check (rol in ('Estudiante','Egresado','Aspirante','Docente','Otro')),
  calificacion smallint    not null check (calificacion between 1 and 5),
  comentario   text        not null check (char_length(btrim(comentario)) between 10 and 500),
  visible      boolean     not null default true,
  creado       timestamptz not null default now()
);

create index if not exists comentarios_creado_idx on public.comentarios (creado desc);

-- Seguridad a nivel de fila: el público solo puede leer comentarios visibles
-- e insertar comentarios nuevos. No puede editar ni borrar.
alter table public.comentarios enable row level security;

drop policy if exists "leer comentarios visibles" on public.comentarios;
create policy "leer comentarios visibles"
  on public.comentarios for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "insertar comentarios" on public.comentarios;
create policy "insertar comentarios"
  on public.comentarios for insert
  to anon, authenticated
  with check (visible = true);

-- Permisos de columnas: al insertar no se puede tocar id, visible ni creado
revoke all on public.comentarios from anon, authenticated;
grant select on public.comentarios to anon, authenticated;
grant insert (nombre, rol, calificacion, comentario) on public.comentarios to anon, authenticated;

-- Moderación (desde el panel de Supabase, como administrador):
--   update public.comentarios set visible = false where id = 123;
