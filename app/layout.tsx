import type { Metadata } from "next"
import { Baloo_2, Quicksand } from "next/font/google"
import "./globals.css"

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" })
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" })

export const metadata: Metadata = {
  title: "Rihlah — Teman Perjalanan Menuntut Ilmu",
  description: "Pendamping harian mahasiswa Al-Azhar: hafalan, murojaah, muqorror, dan amalan.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="pink" className={`${baloo.variable} ${quicksand.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}