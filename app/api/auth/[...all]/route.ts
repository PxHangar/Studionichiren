import {createRequestClient} from '../../../../lib/supabase/server';
export const dynamic='force-dynamic';
export async function GET(request:Request){const {client,json}=createRequestClient(request);const action=new URL(request.url).pathname.slice('/api/auth/'.length);if(action==='ok')return json({status:'ok',provider:'supabase'});if(action==='get-session'){const {data:{user}}=await client.auth.getUser();return json(user?{user:{id:user.id,name:user.user_metadata?.name||'Partecipante',email:user.email}}:null)}return json({error:'Pagina non trovata'},404)}
export async function POST(request:Request){const {client,json}=createRequestClient(request);try{
 const origin=new URL(request.url).origin;if(request.headers.get('origin')!==origin)return json({error:'Origine non autorizzata'},403);
 const action=new URL(request.url).pathname.slice('/api/auth/'.length);const b=await request.json();
 if(action==='sign-up/email'){
  const email=typeof b.email==='string'?b.email.trim():'';const name=typeof b.name==='string'?b.name.trim():'';
  if(!email||name.length<2||name.length>60||typeof b.password!=='string'||b.password.length<12||b.password.length>128)return json({error:'Controlla nome, email e password (almeno 12 caratteri).'},400);
  const {data,error}=await client.auth.signUp({email,password:b.password,options:{data:{name},emailRedirectTo:origin+'/auth/callback?next=/community'}});
  if(error)return json({error:'Registrazione non riuscita. Controlla i dati o riprova tra poco.'},error.status===429?429:400);
  if(data.session&&data.user)await client.from('profiles').update({display_name:name}).eq('id',data.user.id);
  return json({ok:true,needsEmailConfirmation:!data.session});
 }
 if(action==='sign-in/email'){
  if(typeof b.email!=='string'||typeof b.password!=='string')return json({error:'Inserisci email e password.'},400);
  const {error}=await client.auth.signInWithPassword({email:b.email.trim(),password:b.password});
  if(error)return json({error:error.code==='email_not_confirmed'?'Conferma prima la tua email dal messaggio di registrazione.':'Email o password non corrette.'},error.status===429?429:401);return json({ok:true});
 }
 if(action==='sign-out'){const {error}=await client.auth.signOut();return error?json({error:'Impossibile uscire. Riprova.'},400):json({ok:true})}
 if(action==='change-password'){
  const {data:{user}}=await client.auth.getUser();if(!user?.email)return json({error:'Accedi per continuare.'},401);
  if(typeof b.newPassword!=='string'||b.newPassword.length<12||b.newPassword.length>128||typeof b.currentPassword!=='string')return json({error:'Usa almeno 12 caratteri.'},400);
  const {error:check}=await client.auth.signInWithPassword({email:user.email,password:b.currentPassword});if(check)return json({error:'Password attuale non corretta.'},400);
  const {error}=await client.auth.updateUser({password:b.newPassword});if(error)return json({error:'Impossibile aggiornare la password.'},400);
  if(b.revokeOtherSessions)await client.auth.signOut({scope:'others'});return json({ok:true});
 }
 return json({error:'Azione non valida'},404);
 }catch{return json({error:'Accesso temporaneamente non disponibile. Riprova.'},503)}}
