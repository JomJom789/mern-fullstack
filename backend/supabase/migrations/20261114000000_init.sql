-- =============================================================================
-- Portfolio schema: projects, admins, contact messages, storage bucket + RLS.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

-- array_to_string() is only STABLE, so generated columns need an IMMUTABLE wrapper.
create or replace function public.immutable_array_to_string(arr text[], sep text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select pg_catalog.array_to_string(arr, sep);
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Admins (single owner) and is_admin()
-- -----------------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies: only the service role (which bypasses RLS) can read or write this table.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Projects
-- -----------------------------------------------------------------------------

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique
                check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title       text not null check (char_length(title) between 1 and 120),
  tagline     text check (tagline is null or char_length(tagline) <= 160),
  description text not null check (char_length(description) <= 5000),
  category    text not null check (category ~ '^[A-Za-z0-9_ .+#-]{1,40}$'),
  tech_stack  text[] not null default '{}',
  live_url    text check (live_url is null or live_url ~ '^https://'),
  repo_url    text check (repo_url is null or repo_url ~ '^https://'),
  image_path  text,
  featured    boolean not null default false,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  search      tsvector generated always as (
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(description, '')), 'C') ||
    setweight(
      to_tsvector('english'::regconfig, public.immutable_array_to_string(tech_stack, ' ')),
      'B'
    )
  ) stored
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index if not exists projects_status_featured_sort_idx
  on public.projects (status, featured, sort_order);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_tech_stack_gin_idx on public.projects using gin (tech_stack);
create index if not exists projects_search_gin_idx on public.projects using gin (search);

alter table public.projects enable row level security;

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read
  on public.projects
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists projects_admin_all on public.projects;
create policy projects_admin_all
  on public.projects
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Bulk reorder in one transaction. Typed jsonb input, no dynamic SQL.
-- Executable by the service role only (the API calls it after requireAdmin).
create or replace function public.reorder_projects(items jsonb)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.projects as p
     set sort_order = x.sort_order
    from pg_catalog.jsonb_to_recordset(items) as x(id uuid, sort_order integer)
   where p.id = x.id;
$$;

revoke all on function public.reorder_projects(jsonb) from public, anon, authenticated;
grant execute on function public.reorder_projects(jsonb) to service_role;

-- -----------------------------------------------------------------------------
-- Contact messages (written by the API with the service role, readable by the admin)
-- -----------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  email      text not null check (char_length(email) <= 254),
  message    text not null check (char_length(message) between 1 and 4000),
  ip_hash    text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists contact_messages_admin_read on public.contact_messages;
create policy contact_messages_admin_read
  on public.contact_messages
  for select
  to authenticated
  using ((select public.is_admin()));

-- -----------------------------------------------------------------------------
-- Storage: public-read bucket for project images, admin-only writes
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets serve objects through /storage/v1/object/public without a SELECT policy,
-- so no select policy is created (that would also allow anyone to list the bucket).

drop policy if exists project_images_admin_insert on storage.objects;
create policy project_images_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images' and (select public.is_admin()));

drop policy if exists project_images_admin_update on storage.objects;
create policy project_images_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()))
  with check (bucket_id = 'project-images' and (select public.is_admin()));

drop policy if exists project_images_admin_delete on storage.objects;
create policy project_images_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()));
