'use client';
import {useEffect} from 'react';
import {ArrowUp} from 'lucide-react';
export default function Experience(){
useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}})},{threshold:.12});document.querySelectorAll('.ed-story-image,.ed-library-visual,.reading-image,.ed-space-grid>a,.nh-introduction,.category-grid .category').forEach(el=>{el.classList.add('bloom-reveal');observer.observe(el)});return()=>{observer.disconnect();document.querySelectorAll('.bloom-reveal').forEach(el=>el.classList.remove('bloom-reveal'))}},[]);
return <div className="return-top"><button onClick={()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const heading=document.querySelector<HTMLElement>('h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true})}}}>Torna su <ArrowUp size={20}/></button></div>}
