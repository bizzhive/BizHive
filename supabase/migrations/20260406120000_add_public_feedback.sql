create table if not exists public.public_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  display_name text not null,
  profession text not null,
  rating integer not null check (rating between 1 and 5),
  feedback text not null,
  revision_count integer not null default 0,
  is_locked boolean not null default false,
  is_public boolean not null default true,
  is_seeded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.public_feedback enable row level security;

create policy "Public feedback is readable"
on public.public_feedback
for select
to public
using (is_public = true);

create policy "Authenticated users can create their own feedback"
on public.public_feedback
for insert
to authenticated
with check (
  auth.uid() = user_id
  and not exists (
    select 1
    from public.public_feedback existing
    where existing.user_id = auth.uid()
  )
);

create policy "Authenticated users can update one unlocked feedback entry"
on public.public_feedback
for update
to authenticated
using (auth.uid() = user_id and is_locked = false and revision_count < 1)
with check (auth.uid() = user_id);

create or replace function public.touch_public_feedback_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists public_feedback_touch_updated_at on public.public_feedback;

create trigger public_feedback_touch_updated_at
before update on public.public_feedback
for each row
execute function public.touch_public_feedback_updated_at();
