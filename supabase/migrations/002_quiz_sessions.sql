create extension if not exists "uuid-ossp";

create table if not exists public.quiz_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id text not null,
  current_question_index integer not null default 0,
  answers jsonb not null default '{}',
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  bc_earned integer default 0,
  qp_earned integer default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.quiz_sessions enable row level security;

create policy "Users manage own sessions" on public.quiz_sessions
  for all using (auth.uid() = user_id);
