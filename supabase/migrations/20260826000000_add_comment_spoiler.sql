alter table public.comments
add column if not exists is_spoiler boolean not null default false;
