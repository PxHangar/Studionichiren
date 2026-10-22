import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { supabaseConfig } from './config';
/** A new client per request; auth cookies and cache headers stay request-scoped. */
export function createRequestClient(request:Request){
 const responseHeaders=new Headers({'Cache-Control':'private, no-store','Pragma':'no-cache'});
 const incoming=parseCookieHeader(request.headers.get('cookie')??'').filter((c):c is {name:string;value:string}=>c.value!==undefined);
 const secure=new URL(request.url).protocol==='https:';
 const client=createServerClient(supabaseConfig.url,supabaseConfig.key,{
  cookieOptions:{httpOnly:true,secure,sameSite:'lax',path:'/'},
  cookies:{getAll:()=>incoming,setAll(cookies,cacheHeaders){
   for(const {name,value,options} of cookies){const found=incoming.find(c=>c.name===name);if(found)found.value=value;else incoming.push({name,value});responseHeaders.append('Set-Cookie',serializeCookieHeader(name,value,{...options,httpOnly:true,secure,sameSite:'lax'}));}
   if(cacheHeaders)for(const [key,value] of Object.entries(cacheHeaders))responseHeaders.set(key,value);
  }}
 });
 return {client,responseHeaders,json:(body:unknown,status=200)=>Response.json(body,{status,headers:responseHeaders})};
}
