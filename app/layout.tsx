import type { Metadata } from "next";
import "./globals.css";
import "./atelier.css";
import Experience from "../components/experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.studionichiren.it"),
  title: "Studio Nichiren — Il valore di ogni vita",
  description: "Uno spazio indipendente per esplorare gli insegnamenti di Nichiren: studio, pratica e dialogo.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "Studio Nichiren",
    locale: "it_IT",
    title: "Studio Nichiren — Il valore di ogni vita",
    description: "Uno spazio indipendente per esplorare gli insegnamenti di Nichiren: studio, pratica e dialogo.",
    url: "https://www.studionichiren.it",
  },
  icons: { icon: "/favicon.svg?v=monogram-2" },
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="it"><body>{children}<Experience/></body></html>}
