begin;
create schema if not exists community_private;
revoke all on schema community_private from public,anon,authenticated;
create table community_private.owner_identity(email text primary key);
revoke all on community_private.owner_identity from public,anon,authenticated;
insert into community_private.owner_identity(email) values('nichiren@studionichiren.it');
create function community_private.assign_verified_owner() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.email_confirmed_at is not null and exists(select 1 from community_private.owner_identity where email=lower(new.email)) then
  update public.user_roles set role='admin' where user_id=new.id;
 end if;
 return new;
end $$;
revoke all on function community_private.assign_verified_owner() from public,anon,authenticated;
create trigger zz_assign_verified_community_owner after insert or update of email,email_confirmed_at on auth.users for each row execute function community_private.assign_verified_owner();
update public.user_roles r set role='admin' from auth.users u where r.user_id=u.id and u.email_confirmed_at is not null and lower(u.email)='nichiren@studionichiren.it';
-- Prevent suspended authors from editing around moderation via the Data API.
create policy "Post edits participation" on public.posts as restrictive for update to authenticated using(public.is_editor() or (not locked and not exists(select 1 from public.community_member_controls where user_id=(select auth.uid()) and banned))) with check(public.is_editor() or (not locked and not exists(select 1 from public.community_member_controls where user_id=(select auth.uid()) and banned)));
commit;
