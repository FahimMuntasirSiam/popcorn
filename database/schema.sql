-- POSTS TABLE
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text,
  meta_description text,
  cover_image text,
  category text check (category in (
    'movie-blog','movie-news','trailer','teaser','review'
  )),
  language_tag text check (language_tag in (
    'bangla','hindi','english','anime','other'
  )),
  trailer_url text,
  download_links jsonb default '[]',
  status text default 'draft' check (status in ('draft','published')),
  word_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- COMMENTS TABLE
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_avatar text,
  content text not null,
  created_at timestamptz default now()
);

-- REVIEWS TABLE (star ratings for movies)
create table reviews (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- ROW LEVEL SECURITY
alter table posts enable row level security;
alter table comments enable row level security;
alter table reviews enable row level security;

-- POLICIES
create policy "Public can read published posts"
  on posts for select using (status = 'published');

create policy "Anyone can read comments"
  on comments for select using (true);

create policy "Logged in users can insert comments"
  on comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on comments for delete using (
    auth.uid() = user_id OR 
    (select email from auth.users where id = auth.uid()) in ('admin@popcorn.com') -- Placeholder for admin emails
  );

create policy "Anyone can read reviews"
  on reviews for select using (true);

create policy "Logged in users can insert reviews"
  on reviews for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on reviews for update using (auth.uid() = user_id);

-- BOOKMARKS TABLE
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table bookmarks enable row level security;

create policy "Users can read own bookmarks"
  on bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on bookmarks for delete using (auth.uid() = user_id);

-- METRICS COLUMNS
alter table posts add column if not exists avg_rating decimal default 0;
alter table posts add column if not exists total_reviews integer default 0;

-- AUTO-UPDATE TRIGGER FOR RATINGS
create or replace function update_post_metrics()
returns trigger as $$
begin
  update posts
  set 
    avg_rating = (select coalesce(avg(rating), 0) from reviews where post_id = coalesce(new.post_id, old.post_id)),
    total_reviews = (select count(*) from reviews where post_id = coalesce(new.post_id, old.post_id))
  where id = coalesce(new.post_id, old.post_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists tr_update_post_metrics on reviews;
create trigger tr_update_post_metrics
after insert or update or delete on reviews
for each row execute function update_post_metrics();
