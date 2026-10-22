import {notFound} from 'next/navigation';
import {readings} from '../../../lib/content';
import SubpageShell from '../../../components/subpage-shell';
import ReadingRoom from '../../../components/reading-room';
export function generateStaticParams(){return readings.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=readings.find(p=>p.slug===slug);return {title:article?article.title+' — Studio Nichiren':'Studio Nichiren',description:article?.intro}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=readings.find(p=>p.slug===slug);if(!article)notFound();return <SubpageShell><ReadingRoom article={article}/></SubpageShell>}
