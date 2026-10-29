-- Thuso Marketplace PostgreSQL starter schema.
-- RLS is enabled, but policies are intentionally not included. Add and test
-- least-privilege policies before connecting a client application.
create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'provider', 'admin');
create type public.request_status as enum ('open', 'quoted', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed');
create type public.booking_status as enum ('requested', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  display_name text not null,
  phone text,
  avatar_url text,
  bio text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  business_name text not null,
  service_categories text[] not null default '{}',
  hourly_rate numeric(10,2) check (hourly_rate is null or hourly_rate >= 0),
  is_available boolean not null default true,
  verification_status text not null default 'pending'
    check (verification_status in ('pending','verified','rejected')),
  average_rating numeric(3,2) not null default 0 check (average_rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0)
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  title text not null,
  description text not null,
  category text not null,
  city text not null,
  address_hint text,
  budget_min numeric(10,2) check (budget_min is null or budget_min >= 0),
  budget_max numeric(10,2) check (budget_max is null or budget_max >= 0),
  status public.request_status not null default 'open',
  preferred_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (budget_min is null or budget_max is null or budget_min <= budget_max)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  provider_id uuid not null references public.profiles(id),
  amount numeric(10,2) not null check (amount >= 0),
  message text,
  estimated_duration text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  unique(request_id, provider_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.service_requests(id),
  customer_id uuid not null references public.profiles(id),
  provider_id uuid not null references public.profiles(id),
  quote_id uuid references public.quotes(id),
  scheduled_at timestamptz,
  status public.booking_status not null default 'requested',
  agreed_amount numeric(10,2) not null check (agreed_amount >= 0),
  completion_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  request_id uuid references public.service_requests(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (booking_id is not null or request_id is not null)
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
  reviewee_id uuid not null references public.profiles(id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(booking_id, reviewer_id),
  check (reviewer_id <> reviewee_id)
);

create table public.payment_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  payer_id uuid not null references public.profiles(id),
  payee_id uuid not null references public.profiles(id),
  amount numeric(10,2) not null check (amount > 0),
  currency char(3) not null default 'ZAR',
  provider_reference text unique,
  status text not null default 'pending'
    check (status in ('pending','authorized','held','released','refunded','failed')),
  created_at timestamptz not null default now()
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  opened_by uuid not null references public.profiles(id),
  reason text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','under_review','resolved','rejected')),
  resolution text,
  resolved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  link_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index service_requests_customer_created_idx on public.service_requests(customer_id, created_at desc);
create index service_requests_status_city_idx on public.service_requests(status, city);
create index quotes_request_idx on public.quotes(request_id, created_at desc);
create index bookings_customer_idx on public.bookings(customer_id, created_at desc);
create index bookings_provider_idx on public.bookings(provider_id, created_at desc);
create index messages_conversation_idx on public.messages(conversation_id, created_at);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.quotes enable row level security;
alter table public.bookings enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.payment_records enable row level security;
alter table public.disputes enable row level security;
alter table public.notifications enable row level security;

-- TODO: implement explicit RLS policies for each role and relationship.
-- Never trust client-supplied role, amount, payment state, or booking status.
