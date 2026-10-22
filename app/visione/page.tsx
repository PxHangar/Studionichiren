import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, Flower2, Heart, MessageCircle, Scale, Sparkles } from "lucide-react";
import SubpageShell from "../../components/subpage-shell";
import styles from "./visione.module.css";

export const metadata: Metadata = {
  title: "La nostra essenza — Studio Nichiren",
  description: "Gratitudine, libertà di ricerca e studio del Buddismo di Nichiren: il manifesto di un portale indipendente, aperto alle domande e al dialogo.",
};

const impegni = [
  {
    number: "01",
    title: "Studio prima degli schieramenti",
    text: "Partiamo dal Sutra del Loto e dagli scritti di Nichiren. Distinguiamo il contesto storico, le interpretazioni delle scuole e le riflessioni personali.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Libertà di fare domande",
    text: "Nessuna domanda sincera è un tradimento. Si può cercare, cambiare idea e approfondire senza essere costretti a scegliere un'appartenenza.",
    icon: Compass,
  },
  {
    number: "03",
    title: "Rispetto senza uniformità",
    text: "Nichiren Shu, Soka Gakkai e Nichiren Shoshu hanno visioni e storie differenti. Le raccontiamo con precisione, senza appiattirle e senza attaccare le persone.",
    icon: Scale,
  },
  {
    number: "04",
    title: "Una pratica senza gare",
    text: "Il Daimoku e lo studio non sono prove di bravura. Ognuno attraversa periodi diversi: anche il dubbio e il silenzio possono diventare occasioni per comprendere.",
    icon: Flower2,
  },
  {
    number: "05",
    title: "Una comunità che sa ascoltare",
    text: "Le esperienze personali sono benvenute quando aprono una riflessione. L'ascolto non significa fare diagnosi, offrire terapie o imporre risposte agli altri.",
    icon: MessageCircle,
  },
  {
    number: "06",
    title: "Gratitudine che diventa azione",
    text: "Siamo grati a chi ci ha trasmesso qualcosa di prezioso, anche quando il cammino cambia. La gratitudine prende forma nel rispetto e nei gesti quotidiani.",
    icon: Heart,
  },
];

const letture = [
  {
    label: "RITROVARE IL PROPRIO PASSO",
    title: "Quando la pratica non dà più la stessa serenità",
    href: "/insegnamenti/ritrovare-la-pratica",
  },
  {
    label: "CONOSCERE SENZA SCHIERARSI",
    title: "Le tradizioni che si richiamano a Nichiren",
    href: "/insegnamenti/tradizioni-di-nichiren",
  },
  {
    label: "DOMANDE FONDAMENTALI",
    title: "Il significato del Daimoku",
    href: "/insegnamenti/daimoku",
  },
  {
    label: "STUDIO CONSAPEVOLE",
    title: "Il Gohonzon nelle diverse interpretazioni",
    href: "/insegnamenti/gohonzon",
  },
];

export default function VisionePage() {
  return (
    <SubpageShell>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="visione-titolo">
          <div className={styles.orb} aria-hidden="true"><Flower2 size={142} strokeWidth={0.65}/></div>
          <p className={styles.kicker}>LA NOSTRA ESSENZA · UN MANIFESTO APERTO</p>
          <h1 id="visione-titolo">Uno spazio dove la ricerca <em>può respirare.</em></h1>
          <p className={styles.lead}>
            Studio Nichiren è un progetto indipendente per chi desidera studiare,
            praticare e confrontarsi con libertà. Un luogo nel quale coltivare
            gratitudine, saggezza e rispetto, senza rinunciare alle domande.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryLink} href="#impegni">Scopri i nostri impegni <ArrowUpRight size={18}/></Link>
            <Link className={styles.secondaryLink} href="/studio">Esplora le letture <ArrowUpRight size={18}/></Link>
          </div>
        </section>

        <section className={styles.story} aria-labelledby="visione-origine">
          <div className={styles.sectionEyebrow}>PERCHÉ ESISTE QUESTO SPAZIO</div>
          <div className={styles.storyGrid}>
            <h2 id="visione-origine">Si può amare un insegnamento e avere ancora <em>domande.</em></h2>
            <div className={styles.storyBody}>
              <p>Ci sono periodi in cui la recitazione di Nam-myoho-renge-kyo sembra offrire un rifugio, una forza, un senso di pace. E altri in cui quell'esperienza cambia, le risposte sembrano ripetersi o il rapporto con una comunità diventa difficile.</p>
              <p>Questo non deve trasformarsi in una gara a chi crede di più. Si può ripartire dai testi, dalla propria esperienza e da un confronto sereno. Il nostro scopo non è convincere, ma offrire strumenti per comprendere.</p>
              <p>Essere indipendenti non significa essere soli: significa poter incontrare persone e idee senza perdere la libertà di pensare.</p>
            </div>
          </div>
        </section>

        <section className={styles.quoteBlock} aria-label="Il valore della gratitudine">
          <Sparkles size={28} strokeWidth={1.3} aria-hidden="true"/>
          <blockquote>Essere grati per ciò che abbiamo ricevuto non significa smettere di fare domande. Significa portare avanti ciò che ci ha aiutato a crescere, con responsabilità e cuore aperto.</blockquote>
          <p>La gratitudine non ci obbliga a negare le difficoltà. Può aiutarci a riconoscere il bene incontrato e a scegliere con cura il passo successivo.</p>
        </section>

        <section id="impegni" className={styles.values} aria-labelledby="visione-impegni">
          <div className={styles.valuesHead}>
            <div>
              <p className={styles.sectionEyebrow}>IL MODO IN CUI VOGLIAMO CAMMINARE</p>
              <h2 id="visione-impegni">Sei impegni. <em>Una direzione.</em></h2>
            </div>
            <p>Non una nuova scuola, non una verità imposta. Un patto di metodo e rispetto, da mettere alla prova ogni giorno.</p>
          </div>
          <div className={styles.valuesGrid}>
            {impegni.map(({ number, title, text, icon: Icon }) => (
              <article key={number} className={styles.valueCard}>
                <div className={styles.valueTop}><span>{number}</span><Icon size={26} strokeWidth={1.45} aria-hidden="true"/></div>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.method} aria-labelledby="visione-metodo">
          <div>
            <p className={styles.sectionEyebrow}>COME LEGGERE QUESTO PORTALE</p>
            <h2 id="visione-metodo">Distinguere per <em>comprendere.</em></h2>
          </div>
          <div className={styles.methodList}>
            <p><strong>Fonte:</strong> ciò che un testo effettivamente dice, con titolo, traduzione e contesto verificabili.</p>
            <p><strong>Interpretazione:</strong> ciò che una scuola o un commentatore insegna a partire dal testo, attribuito in modo esplicito.</p>
            <p><strong>Esperienza:</strong> ciò che una persona ha vissuto. Ha valore come testimonianza, non come prova valida per chiunque.</p>
            <p>Il portale non è affiliato a organizzazioni religiose e non sostituisce un percorso terapeutico o un supporto professionale.</p>
            <Link href="/progetto">Leggi il metodo editoriale completo <ArrowUpRight size={17}/></Link>
          </div>
        </section>

        <section className={styles.next} aria-labelledby="visione-percorsi">
          <div className={styles.nextHead}>
            <p className={styles.sectionEyebrow}>SCEGLI IL TUO PRIMO PASSO</p>
            <h2 id="visione-percorsi">Torna a ciò che <em>ti interroga.</em></h2>
          </div>
          <div className={styles.readingGrid}>
            {letture.map(({ label, title, href }) => (
              <Link key={href} href={href} className={styles.readingCard}>
                <span>{label}</span>
                <strong>{title}</strong>
                <ArrowUpRight size={21} aria-hidden="true"/>
              </Link>
            ))}
          </div>
          <div className={styles.communityCta}>
            <div><p className={styles.sectionEyebrow}>NEL RISPETTO DEI PERCORSI DI TUTTI</p><h3>Una domanda sincera può aprire un incontro.</h3></div>
            <Link className={styles.primaryLink} href="/community">Entra nella community <ArrowUpRight size={18}/></Link>
          </div>
        </section>
      </div>
    </SubpageShell>
  );
}
