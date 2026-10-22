'use client';
import {useState} from 'react';
import {Flower2,Sun,Leaf,Waves,Mountain,Sparkles} from 'lucide-react';
export {avatarNames as avatars} from '../lib/avatars';
export default function Avatar({value='loto',name='Partecipante',src}:{value?:string;name?:string;src?:string|null}){const [failed,setFailed]=useState<string|null>(null);const icons={loto:Flower2,sole:Sun,foglia:Leaf,onda:Waves,monte:Mountain,luce:Sparkles};const Icon=icons[value as keyof typeof icons]||Flower2;return <span className={'avatar avatar-'+value} role="img" aria-label={'Avatar di '+name}>{src&&failed!==src?<img src={src} alt="" onError={()=>setFailed(src)} loading="lazy"/>:<Icon size={22} strokeWidth={1.5}/>}</span>}
