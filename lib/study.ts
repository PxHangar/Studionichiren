import {useEffect,useState} from 'react';
import {readings} from './content';
export type Study={saved:string[];notes:Record<string,string>};
const empty:Study={saved:[],notes:{}};
const key='studionichiren:quaderno:v1';
function read():Study{const value=JSON.parse(localStorage.getItem(key)||'null');if(!value||!Array.isArray(value.saved)||!value.notes||typeof value.notes!=='object')return empty;const valid=new Set(readings.map(r=>r.slug));return {saved:value.saved.filter((s:unknown):s is string=>typeof s==='string'&&valid.has(s)),notes:Object.fromEntries(Object.entries(value.notes).filter(([s,v])=>valid.has(s)&&typeof v==='string').map(([s,v])=>[s,(v as string).slice(0,5000)]))}}
export function useStudy(){const [study,setStudy]=useState<Study>(empty),[ready,setReady]=useState(false),[error,setError]=useState('');useEffect(()=>{const refresh=()=>{try{setStudy(read());setError('')}catch{setError('Il salvataggio locale non è disponibile in questo browser.')}};refresh();setReady(true);window.addEventListener('storage',refresh);return()=>window.removeEventListener('storage',refresh)},[]);function update(change:(s:Study)=>Study){try{const next=change(read());localStorage.setItem(key,JSON.stringify(next));setStudy(next);setError('')}catch{setError('Impossibile salvare. Copia gli appunti prima di lasciare la pagina.')}}return {study,ready,error,toggle:(slug:string)=>update(s=>({...s,saved:s.saved.includes(slug)?s.saved.filter(v=>v!==slug):[...s.saved,slug]})),saveNote:(slug:string,note:string)=>update(s=>({...s,notes:{...s.notes,[slug]:note.slice(0,5000)}}))}}
export const themes:Record<string,{label:string;className:string;word:string;prompt:string}>={
 nichiren:{label:'Le origini',className:'clay',word:'Ricerca',prompt:'Quale domanda vorresti portare nella tua prima lettura di Nichiren?'},
 'buddismo-di-nichiren':{label:'I fondamenti',className:'sage',word:'Possibilità',prompt:'In quale situazione vorresti riconoscere più valore, in te o negli altri?'},
 daimoku:{label:'La pratica',className:'ink',word:'Ritmo',prompt:'Quale azione concreta desideri accompagnare alla pratica di oggi?'},
 gongyo:{label:'La continuità',className:'sage',word:'Presenza',prompt:'Quale spazio sostenibile puoi dedicare allo studio e alla pratica?'},
 gosho:{label:'Le fonti',className:'ochre',word:'Parole',prompt:'Quale parola desideri chiarire? Annota anche titolo ed edizione del testo che stai leggendo.'},
 'sutra-del-loto':{label:'Alle radici',className:'ink',word:'Orizzonte',prompt:'Quale immagine o domanda desideri approfondire nel testo?'},
 'dieci-mondi':{label:'La vita quotidiana',className:'clay',word:'Movimento',prompt:'Ricordi un momento in cui ascolto o sostegno hanno cambiato la tua risposta?'},
 gohonzon:{label:'Il significato',className:'ochre',word:'Contesto',prompt:'Quale collegamento tra i concetti della tradizione vorresti comprendere meglio?'},
 'pace-e-dialogo':{label:'Vivere insieme',className:'sage',word:'Incontro',prompt:'A chi vorresti dedicare un ascolto più attento nella tua giornata?'}
};
export function group(slug:string){return ['daimoku','gongyo'].includes(slug)?'Pratica':['gosho','sutra-del-loto'].includes(slug)?'Testi': ['dieci-mondi','pace-e-dialogo'].includes(slug)?'Vita e dialogo':'Fondamenti'}
export function minutes(article:typeof readings[number]){return Math.max(1,Math.ceil((article.intro+' '+article.sections.flat().join(' ')).split(/\s+/).length/180))}
