'use client';
import {useEffect,useState} from 'react';
import {defaultRules} from '../../lib/content';
import SubpageShell from '../../components/subpage-shell';
export default function Page(){const [rules,setRules]=useState(defaultRules);useEffect(()=>{fetch('/api/forum').then(r=>r.ok?r.json():null).then(j=>{if(j?.rules)setRules(j.rules)}).catch(()=>{})},[]);return <SubpageShell><article className="reading-index reading-prose"><span className="eyebrow">IL PATTO DELLA COMMUNITY</span><h1>Il rispetto,<br/>prima di tutto.</h1><p>Questo spazio accoglie domande, esperienze e punti di vista sugli insegnamenti di Nichiren. Le storie personali meritano rispetto: proviamo a collegarle a una domanda, a un testo o a un percorso di riflessione, senza pretendere soluzioni immediate o trasformare il forum in uno spazio di terapia.</p><div className="prose">{rules}</div><a className="btn primary" href="/community">Torna alle conversazioni →</a></article></SubpageShell>}
