# Studio Nichiren

Portale indipendente dedicato allo studio del Buddismo di Nichiren. Next.js App Router, React e Supabase; produzione sul progetto Vercel `pxh-angar/studionichiren`, collegato al ramo `main` di `PxHangar/Studionichiren`.

## Percorsi

- `/studio` e `/biblioteca`: nove introduzioni originali, pubblicate in `/insegnamenti/[slug]`.
- `/community`: sei spazi, profilo e foto avatar, discussioni, risposte, salvati e segnalazioni.
- `/regolamento`: testo aggiornabile dallo staff.
- `/admin`: moderazione, gestione dei partecipanti, ruoli e configurazione di regole e avatar.

I collegamenti editoriali restano nel portale. Le immagini evocative sono create con IA. Le animazioni rispettano `prefers-reduced-motion` e il footer include Torna su.

## Sviluppo e distribuzione

Node.js 24, `pnpm install --frozen-lockfile`, `pnpm dev`; verifiche con `pnpm exec tsc --noEmit` e `pnpm build`. La connessione GitHub esistente di Vercel distribuisce i commit su `main` in produzione.

Il progetto usa Supabase `aoxfwzqcrzquyminqtok`. La configurazione predefinita contiene esclusivamente URL e chiave **publishable** pubblica; è sovrascrivibile con `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (o la chiave anon legacy). Non sono necessarie chiavi service role nel portale. Non commettere `.env.local`, credenziali CLI o directory `.vercel`.

Le migrazioni in `supabase/migrations` estendono il database esistente (profili, ruoli, post, commenti, salvati e trigger iniziali). Sono state applicate al progetto collegato; non eseguirle una seconda volta manualmente.

## Accesso e amministrazione

Accesso con email e password; conferma email gestita da Supabase Auth. Configurare in Supabase Authentication il sito di produzione e la allowlist dei callback `/auth/callback` per i domini utilizzati, oltre al servizio email necessario all’invio delle conferme. L’account proprietario indicato nella migrazione privata riceve il ruolo admin solo dopo la verifica dell’indirizzo. Non esiste una promozione automatica del primo iscritto.

Gli amministratori assegnano altri ruoli nel pannello. I moderatori gestiscono contenuti, segnalazioni e regolamento; la sospensione degli account e l’assegnazione dei ruoli richiedono admin. Le operazioni di moderazione nascondono i contributi e sono reversibili.

Autorizzazione tramite `auth.getUser()`, controlli server e RLS. I cookie sono HttpOnly, Secure su HTTPS e SameSite Lax. Le API di sessione e forum sono private/no-store, con controllo Origin sulle mutazioni. I campi di moderazione sono protetti anche da trigger nel database. Il bucket pubblico `community-avatars` accetta WebP fino a 1 MB con percorsi appartenenti all’utente; il client ritaglia e ricodifica la foto a 512 px.

Il controllo di sicurezza Supabase segnala i due helper di ruolo preesistenti `is_admin` e `is_editor`, intenzionalmente utilizzati dalle policy. Le nuove funzioni privilegiate di assegnazione del proprietario sono nello schema non esposto `community_private`.
