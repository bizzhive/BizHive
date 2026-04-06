create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  active_provider_slot text not null default 'gemini_1',
  last_context_route text,
  last_context_title text,
  summary text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_sessions_user_updated
  on public.chat_sessions(user_id, updated_at desc);

create index if not exists idx_chat_sessions_user_archived
  on public.chat_sessions(user_id, archived_at, updated_at desc);

alter table public.chat_sessions enable row level security;

drop policy if exists "Users can view own chat sessions" on public.chat_sessions;
create policy "Users can view own chat sessions"
on public.chat_sessions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat sessions" on public.chat_sessions;
create policy "Users can insert own chat sessions"
on public.chat_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own chat sessions" on public.chat_sessions;
create policy "Users can update own chat sessions"
on public.chat_sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own chat sessions" on public.chat_sessions;
create policy "Users can delete own chat sessions"
on public.chat_sessions
for delete
to authenticated
using (auth.uid() = user_id);

drop trigger if exists update_chat_sessions_updated_at on public.chat_sessions;
create trigger update_chat_sessions_updated_at
before update on public.chat_sessions
for each row
execute function public.update_updated_at_column();

create table if not exists public.bee_provider_health_checks (
  id uuid primary key default gen_random_uuid(),
  slot text not null,
  provider text not null,
  model text not null,
  source text not null default 'runtime',
  status text not null,
  status_code integer,
  latency_ms integer,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bee_provider_health_checks_slot_created
  on public.bee_provider_health_checks(slot, created_at desc);

alter table public.bee_provider_health_checks enable row level security;

drop policy if exists "Admins and moderators can view Bee provider health checks" on public.bee_provider_health_checks;
create policy "Admins and moderators can view Bee provider health checks"
on public.bee_provider_health_checks
for select
to authenticated
using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

insert into public.admin_settings (key, value)
values
  ('bee_provider_routing', '{"order":["gemini_1","gemini_2","gemini_3","groq_1"],"disabled":[]}')
on conflict (key) do nothing;

insert into public.admin_settings (key, value)
values
  (
    'bee_guardrails',
    'Bee AI is the BizHive business copilot designed and developed by Tushar. Stay focused on business topics, keep answers India-aware when possible, never disclose the underlying model or provider, and politely refuse politics or unrelated requests.'
  )
on conflict (key) do nothing;
