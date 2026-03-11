-- 1. 예약 테이블 (reservations)
create table
  public.reservations (
    id uuid not null default extensions.uuid_generate_v4 (),
    date date not null,
    time_slots text[] not null,
    user_name text not null,
    user_phone text not null,
    user_details text null,
    status text not null default 'pending'::text,
    created_at timestamp with time zone not null default now(),
    constraint reservations_pkey primary key (id)
  );

-- 2. 사이트 설정 테이블 (settings)
create table
  public.settings (
    key text not null,
    value jsonb null,
    updated_at timestamp with time zone not null default now(),
    constraint settings_pkey primary key (key)
  );

-- 3. 아티스트 테이블 (artists)
create table
  public.artists (
    id uuid not null default extensions.uuid_generate_v4 (),
    name text not null,
    role text not null,
    bio text null,
    image_url text null,
    created_at timestamp with time zone not null default now(),
    constraint artists_pkey primary key (id)
  );

-- 4. 노트 테이블 (notes)
create table
  public.notes (
    id uuid not null default extensions.uuid_generate_v4 (),
    title text not null,
    category text not null,
    content text not null,
    cover_image_url text null,
    created_at timestamp with time zone not null default now(),
    constraint notes_pkey primary key (id)
  );

-- 5. 문의/예약 폼 인입 테이블 (inquiries)
create table
  public.inquiries (
    id uuid not null default extensions.uuid_generate_v4 (),
    type text not null, -- 'contact', 'staff', 'note', 'studio'
    name text not null,
    phone text not null,
    email text null,
    message text null,
    source_url text null, -- 어느 페이지에서 유입되었는지
    status text not null default 'unread'::text, -- 'unread', 'read', 'replied'
    created_at timestamp with time zone not null default now(),
    constraint inquiries_pkey primary key (id)
  );

-- 6. 스토리지 버킷 생성 (tnt-media)
insert into storage.buckets (id, name, public) values ('tnt-media', 'tnt-media', true);

-- *** 모든 테이블 및 스토리지 퍼블릭 접근 허용 (RLS 끄기 / 퍼블릭 정책 추가) *** 
-- Next.js 환경변수 기반 관리자 인증을 사용하므로, 프론트에서 데이터 Read/Write를 위해 RLS를 모두 허용합니다.
alter table public.reservations disable row level security;
alter table public.settings disable row level security;
alter table public.artists disable row level security;
alter table public.notes disable row level security;
alter table public.inquiries disable row level security;

-- Storage 버킷 퍼블릭 오픈 정책
create policy "Public Access"
  on storage.objects for all
  using ( bucket_id = 'tnt-media' );

-- --- [초기 더미 데이터 삽입 옵션] ---

-- 메인 설정 기본값 세팅
insert into public.settings (key, value) values 
  ('admin_password', '"tntmusic123"'),
  ('hero_image', '""'),
  ('about_image', '""'),
  ('studio_price_weekday', '"시간당 15,000원"'),
  ('studio_price_weekend', '"시간당 18,000원"'),
  ('studio_images', '[]');

-- 노트 1개 더미
insert into public.notes (title, category, content) values 
  ('TNT Music 그랜드 오픈!', 'Notice', 'TNT Music 연습실 및 아티스트 에이전시 홈페이지가 오픈되었습니다.');

-- 아티스트 1명 더미
insert into public.artists (name, role, bio) values 
  ('최찬양', '대표 / 바리톤', 'TNT Music 대표, 공연 기획 및 예술 감독');
