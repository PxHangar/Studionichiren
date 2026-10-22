import {avatars} from '../../../components/avatar';
import {defaultRules} from '../../../lib/content';
import { createRequestClient } from '../../../lib/supabase/server';
export const dynamic='force-dynamic';
const categories=['Primi passi','Gosho e studio','Daimoku e Gongyo','Vita quotidiana','Sutra del Loto','Pace e dialogo'];
export async function GET(request:Request){const {client,json}=createRequestClient(request);try{
 const {data:{user}}=await client.auth.getUser();const id=new URL(request.url).searchParams.get('topic');
 let q=client.from('posts').select('id,author_id,title,body,category,created_at,locked,pinned').eq('hidden',false).order('pinned',{ascending:false}).order('created_at',{ascending:false}).limit(200);if(id)q=q.eq('id',id);
 const {data:posts,error}=await q;if(error)throw error;
 const postIds=(posts??[]).map(p=>p.id);
 const {data:comments,error:commentError}=postIds.length?await client.from('comments').select('id,post_id,author_id,body,created_at').in('post_id',postIds).eq('hidden',false).order('created_at',{ascending:true}).limit(2000):{data:[],error:null};if(commentError)throw commentError;
 const authors=[...new Set([...(posts??[]).map(p=>p.author_id),...(comments??[]).map(c=>c.author_id),...(user?[user.id]:[])])];
 const {data:profiles,error:profileError}=authors.length?await client.from('profiles').select('id,display_name,bio,avatar').in('id',authors):{data:[],error:null};if(profileError)throw profileError;
 const icons=new Map((profiles??[]).map(p=>[p.id,p.avatar]));
 const names=new Map((profiles??[]).map(p=>[p.id,p.display_name]));
 const mapped=(posts??[]).map(p=>({id:p.id,title:p.title,body:p.body,category:p.category,created:Date.parse(p.created_at),author:names.get(p.author_id)||'Partecipante',avatar:icons.get(p.author_id)||'loto',locked:p.locked,pinned:p.pinned,replyCount:(comments??[]).filter(c=>c.post_id===p.id).length}));
 if(id)return json({topic:mapped[0]??null,replies:(comments??[]).map(c=>({id:c.id,body:c.body,created:Date.parse(c.created_at),author:names.get(c.author_id)||'Partecipante',avatar:icons.get(c.author_id)||'loto'}))});
 const {data:saved,error:savedError}=user?await client.from('bookmarks').select('post_id').eq('user_id',user.id):{data:[],error:null};if(savedError)throw savedError;
 const {data:settings}=await client.from('community_settings').select('rules,avatars').eq('id','general').maybeSingle();
 const {data:role}=user?await client.from('user_roles').select('role').eq('user_id',user.id).maybeSingle():{data:null};
 const {data:control}=user?await client.from('community_member_controls').select('banned').eq('user_id',user.id).maybeSingle():{data:null};
 const profile=profiles?.find(p=>p.id===user?.id);
 return json({rules:settings?.rules||defaultRules,avatars:settings?.avatars||avatars,topics:mapped,saved:(saved??[]).map(s=>s.post_id),user:user?{id:user.id,name:profile?.display_name||user.user_metadata?.name||'Partecipante',bio:profile?.bio||'',avatar:profile?.avatar||'loto',role:role?.role||'user',banned:!!control?.banned,hasProfile:!!profile}:null});
 }catch(error){console.error('forum_read_failed',error instanceof Error?error.message:'query failed');return json({error:'La community non è disponibile. Riprova tra poco.'},503)}}
export async function POST(request:Request){const {client,json}=createRequestClient(request);try{
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Richiesta non valida'},403);
 const {data:{user}}=await client.auth.getUser();if(!user)return json({error:'Accedi per partecipare.'},401);
 const b=await request.json();const {data:control}=await client.from('community_member_controls').select('banned').eq('user_id',user.id).maybeSingle();if(control?.banned&&['topic','reply'].includes(b.action))return json({error:'La pubblicazione per il tuo account è sospesa. Contatta lo staff.'},403);const clean=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';const body=clean(b.body,10000);const topicId=clean(b.topicId,100);let error;
 if(b.action==='profile'){const name=clean(b.name,60);if(name.length<2)throw Error('Scegli un nome di almeno 2 caratteri.');const {data:settings}=await client.from('community_settings').select('avatars').eq('id','general').maybeSingle();const enabled=settings?.avatars||avatars;const avatar=typeof b.avatar==='string'?b.avatar:'loto';if(!enabled.includes(avatar))throw Error('Scegli un avatar disponibile.');({error}=await client.from('profiles').upsert({id:user.id,display_name:name,bio:clean(b.bio,400),avatar}));}
 else if(b.action==='topic'){const title=clean(b.title,160);if(title.length<6||body.length<10||!categories.includes(b.category))throw Error('Inserisci titolo, categoria e un messaggio di almeno 10 caratteri.');({error}=await client.from('posts').insert({author_id:user.id,title,body,category:b.category}));}
 else {const {data:post,error:missing}=await client.from('posts').select('id,locked,hidden').eq('id',topicId).maybeSingle();if(missing||!post)throw Error('Discussione non trovata.');
  if(b.action==='reply'){if(post.locked||post.hidden)throw Error('Questa discussione è chiusa alle risposte.');if(body.length<2)throw Error('Scrivi una risposta.');({error}=await client.from('comments').insert({post_id:topicId,author_id:user.id,body}));}
  else if(b.action==='bookmark'){const {data:found,error:readError}=await client.from('bookmarks').select('post_id').eq('user_id',user.id).eq('post_id',topicId).maybeSingle();if(readError)throw readError;({error}=found?await client.from('bookmarks').delete().eq('user_id',user.id).eq('post_id',topicId):await client.from('bookmarks').insert({user_id:user.id,post_id:topicId}));}
  else if(b.action==='report'){if(body.length<5)throw Error('Indica il motivo della segnalazione.');({error}=await client.from('community_reports').insert({post_id:topicId,user_id:user.id,reason:body}));}
  else throw Error('Azione non valida.');
 }
 if(error)throw Error('Operazione non riuscita. Controlla i dati e riprova.');return json({ok:true});
 }catch(error){return json({error:error instanceof Error?error.message:'Operazione non riuscita'},400)}}
