import type { Metadata } from "next";
import "./globals.css";
import "./atelier.css";
import Experience from "../components/experience";
export const metadata: Metadata = { title: "Studio Nichiren — Il valore di ogni vita", description: "Uno spazio indipendente per esplorare gli insegnamenti di Nichiren: studio, pratica e dialogo.", icons: {icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="it"><body>{children}<Experience/></body></html>}
