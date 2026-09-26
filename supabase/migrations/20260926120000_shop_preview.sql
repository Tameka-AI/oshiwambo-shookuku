-- Preview shop: NAD preview price and cover photo per book, map position per entry.
-- No orders table: checkout is a static demonstration and stores nothing server-side.
alter table public.books   add column if not exists price_nad int;
alter table public.books   add column if not exists cover_path text;
alter table public.entries add column if not exists map_x numeric;
alter table public.entries add column if not exists map_y numeric;
alter table public.entries add column if not exists map_basis text;
