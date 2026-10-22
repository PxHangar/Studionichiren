begin;
alter table public.posts add column category text not null default 'Primi passi' check(category in ('Primi passi','Gosho e studio','Daimoku e Gongyo','Vita quotidiana','Sutra del Loto','Pace e dialogo'));
alter table public.posts add column hidden boolean not null default false, add column locked boolean not null default false, add column pinned boolean not null default false;
alter table public.comments add column hidden boolean not null default false;
alter table public.profiles add column avatar text not null default 'loto' check(avatar in ('loto','sole','foglia','onda','monte','luce'));
create table public.community_reports(id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,reason text not null check(length(reason) between 5 and 10000),resolved boolean not null default false,created_at timestamptz not null default now());
create table public.community_member_controls(user_id uuid primary key references auth.users(id) on delete cascade,banned boolean not null default false);
create table public.community_settings(id text primary key check(id='general'),rules text not null check(length(rules) between 20 and 20000),avatars text[] not null default array['loto','sole','foglia','onda','monte','luce'] check(cardinality(avatars)>0 and avatars <@ array['loto','sole','foglia','onda','monte','luce']::text[]));
alter table public.community_reports enable row level security;
alter table public.community_member_controls enable row level security;
alter table public.community_settings enable row level security;
grant select,insert,update on public.community_reports to authenticated;
grant select,insert,update,delete on public.community_member_controls to authenticated;
grant select on public.community_settings to anon,authenticated;
grant insert,update on public.community_settings to authenticated;
create policy "Report own create" on public.community_reports for insert to authenticated with check(user_id=(select auth.uid()) and resolved=false);
create policy "Reports staff read" on public.community_reports for select to authenticated using(public.is_editor());
create policy "Reports staff resolve" on public.community_reports for update to authenticated using(public.is_editor()) with check(public.is_editor());
create policy "Controls read own or staff" on public.community_member_controls for select to authenticated using(user_id=(select auth.uid()) or public.is_editor());
create policy "Controls staff write" on public.community_member_controls for all to authenticated using(public.is_editor()) with check(public.is_editor());
create policy "Settings public read" on public.community_settings for select using(true);
create policy "Settings staff insert" on public.community_settings for insert to authenticated with check(public.is_editor());
create policy "Settings staff update" on public.community_settings for update to authenticated using(public.is_editor()) with check(public.is_editor());
create policy "Profile own create" on public.profiles for insert to authenticated with check(id=(select auth.uid()));
create policy "Profile staff edit" on public.profiles for update to authenticated using(public.is_editor()) with check(public.is_editor());
create policy "Roles admin edit" on public.user_roles for update to authenticated using(public.is_admin()) with check(public.is_admin());
grant update on public.user_roles to authenticated;
drop policy "Posts readable" on public.posts;
create policy "Posts readable" on public.posts for select using(not hidden or author_id=(select auth.uid()) or public.is_editor());
drop policy "Comments readable" on public.comments;
create policy "Comments readable" on public.comments for select using((not hidden or author_id=(select auth.uid()) or public.is_editor()) and exists(select 1 from public.posts where id=post_id));
create policy "Comments staff edit" on public.comments for update to authenticated using(public.is_editor()) with check(public.is_editor());
grant update on public.comments to authenticated;
create policy "Post participation" on public.posts as restrictive for insert to authenticated with check(not exists(select 1 from public.community_member_controls where user_id=(select auth.uid()) and banned));
create policy "Reply participation" on public.comments as restrictive for insert to authenticated with check(not exists(select 1 from public.community_member_controls where user_id=(select auth.uid()) and banned) and exists(select 1 from public.posts where id=post_id and not locked and not hidden));
-- Prevent members from setting moderation fields directly through the public API.
revoke insert,update on public.posts from authenticated;
grant insert(author_id,title,body,category) on public.posts to authenticated;
grant update(title,body,category) on public.posts to authenticated;
-- RLS checks row ownership; this trigger protects moderation fields from authors.
grant update(hidden,locked,pinned) on public.posts to authenticated;
create function public.guard_post_moderation() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if (new.hidden is distinct from old.hidden or new.locked is distinct from old.locked or new.pinned is distinct from old.pinned) and not public.is_editor() then raise exception 'Forbidden' using errcode='42501'; end if;
 return new;
end $$;
revoke all on function public.guard_post_moderation() from public,anon,authenticated;
create trigger guard_post_moderation before update on public.posts for each row execute function public.guard_post_moderation();
-- Trigger only derives public display text; never privileges from user metadata.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,display_name) values(new.id,coalesce(nullif(left(trim(new.raw_user_meta_data->>'name'),60),''),'Partecipante'));
 insert into public.user_roles(user_id) values(new.id);
 return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;
create index posts_created_idx on public.posts(created_at desc);
create index comments_post_idx on public.comments(post_id,created_at);
create index reports_post_idx on public.community_reports(post_id);
create index reports_user_idx on public.community_reports(user_id);
commit;
