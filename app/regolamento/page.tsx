'use client';
import {useEffect,useState} from 'react';
import {defaultRules} from '../../lib/content';
import SubpageShell from '../../components/subpage-shell';
export default function Page(){const [rules,setRules]=useState(defaultRules);useEffect(()=>{fetch('/api/forum').then(r=>r.ok?r.json():null).then(j=>{if(j?.rules)setRules(j.rules)}).catch(()=>{})},[]);return <SubpageShell><div className="sn-service-visual"><img src="/people.webp" alt="Dialogo tra persone: immagine illustrativa IA"/><span>ASCOLTARE È IL PRIMO GESTO DI RISPETTO</span></div><article className="reading-index reading-prose"><span className="eyebrow">IL PATTO DELLA COMMUNITY</span><h1>Il rispetto,<br/>prima di tutto.</h1><p>Questo spazio accoglie domande, esperienze e punti di vista sugli insegnamenti di Nichiren.</p><div className="prose">{rules}</div><a className="btn primary" href="/community">Torna alle conversazioni →</a></article></SubpageShell>}
