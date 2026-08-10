import type { Metadata } from "next"
import { Baloo_2, Quicksand } from "next/font/google"
import "./globals.css"

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" })
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" })

export const metadata: Metadata = {
  title: "To-Do Princess",
  description: "Buat harimu lebih produktif dan bahagia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-theme="pink"
      className={`${baloo.variable} ${quicksand.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}