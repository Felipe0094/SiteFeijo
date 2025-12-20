create table if not exists page_views (
  id text primary key,
  count integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create or replace function increment_page_view(page_id text)
returns void
language plpgsql
security definer
as $$
begin
  insert into page_views (id, count, updated_at)
  values (page_id, 1, now())
  on conflict (id)
  do update set
    count = page_views.count + 1,
    updated_at = now();
end;
$$;
