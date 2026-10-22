import {Flower2,Sun,Leaf,Waves,Mountain,Sparkles} from 'lucide-react';
export const avatars=['loto','sole','foglia','onda','monte','luce'] as const;
export default function Avatar({value='loto',name='Partecipante'}:{value?:string;name?:string}){const icons={loto:Flower2,sole:Sun,foglia:Leaf,onda:Waves,monte:Mountain,luce:Sparkles};const Icon=icons[value as keyof typeof icons]||Flower2;return <span className={'avatar avatar-'+value} role="img" aria-label={'Avatar di '+name}><Icon size={22} strokeWidth={1.5}/></span>}
