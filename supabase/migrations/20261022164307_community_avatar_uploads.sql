begin;
alter table public.profiles add column avatar_path text check(avatar_path is null or avatar_path ~ ('^'||id::text||'/[a-f0-9-]{36}\.webp$'));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('community-avatars','community-avatars',true,1048576,array['image/webp']) on conflict(id) do nothing;
create policy "Community avatars public read" on storage.objects for select using(bucket_id='community-avatars');
create policy "Community avatars own create" on storage.objects for insert to authenticated with check(bucket_id='community-avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Community avatars own or staff remove" on storage.objects for delete to authenticated using(bucket_id='community-avatars' and ((storage.foldername(name))[1]=(select auth.uid())::text or public.is_editor()));
drop policy "Controls staff write" on public.community_member_controls;
create policy "Controls admin write" on public.community_member_controls for all to authenticated using(public.is_admin()) with check(public.is_admin());
commit;
