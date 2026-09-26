-- Marks homestead-map positions that still await confirmation from Professor Mbenzi.
alter table public.entries add column if not exists map_provisional boolean not null default false;
