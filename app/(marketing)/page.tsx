"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen, CalendarDays, Feather, Languages, Library, Moon, Repeat, Sparkles,
} from "lucide-react"
import { BearMascot, BunnyMascot, CatMascot } from "@/components/decor/mascot"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const FITUR = [
  { Icon: BookOpen, judul: "Hafalan per ayat", isi: "Catat setoran, lihat persen dari 6.236 ayat, dan tandai juz yang dikuasai." },
  { Icon: Repeat, judul: "Murojaah otomatis", isi: "Surah yang lama tidak diulang muncul sendiri sebagai pengingat." },
  { Icon: Library, judul: "Muqorror & imtihan", isi: "Halaman terbaca, daftar bab, dan hitung mundur ujian." },
  { Icon: Languages, judul: "Mufrodat", isi: "Kartu kosakata Arab dengan mode tes yang mengutamakan kata sulit." },
  { Icon: Moon, judul: "Amalan harian", isi: "Ceklis ibadah dan rentetan hari agar istiqomah terasa ringan." },
  { Icon: Feather, judul: "Journal semester", isi: "Diary yang otomatis terbagi Winter dan Summer Semester." },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--tdp-bg)" }}>
      <header className="mx-auto flex max-w-5xl items-center gap-2.5 px-5 py-5">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Sparkles className="size-5 text-white" />
        </motion.span>

        <span className="text-xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Rihlah
        </span>

        <nav className="ml-auto flex items-center gap-2">
          <Link href="/masuk" className="px-4 py-2 text-sm" style={{ color: "var(--tdp-text)" }}>Masuk</Link>

          <Link href="/beranda" className="px-4 py-2 text-sm text-white"
            style={{ background: "var(--tdp-primary)", borderRadius: "999px", boxShadow: "var(--tdp-shadow)" }}>
            Buka aplikasi
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-6 px-5 py-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="inline-block rounded-full px-3 py-1 text-xs"
            style={{ background: "var(--tdp-primary-soft)", color: "var(--tdp-primary-ink)" }}>
            Untuk mahasiswa Al-Azhar
          </p>

          <h1 className="mt-3 text-4xl leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Teman perjalanan menuntut ilmu
          </h1>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--tdp-text)" }}>
            Hafalan, murojaah, muqorror, mufrodat, amalan, jadwal kuliah, dan journal semester dalam satu tempat.
            Semua tersimpan otomatis di perangkat, tanpa perlu daftar akun.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/beranda" className="px-5 py-3 text-sm text-white"
              style={{ background: "var(--tdp-primary)", borderRadius: "999px", boxShadow: "var(--tdp-shadow)" }}>
              Mulai sekarang
            </Link>

            <Link href="/hafalan" className="px-5 py-3 text-sm"
              style={{ background: "var(--tdp-card)", borderRadius: "999px", color: "var(--tdp-text)", boxShadow: "var(--tdp-shadow-soft)" }}>
              Lihat halaman Hafalan
            </Link>
          </div>
        </motion.div>

        <div className="flex items-end justify-center gap-1">
          <CatMascot size={96} />
          <BunnyMascot size={150} />
          <BearMascot size={96} />
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-3 px-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {FITUR.map((f, i) => (
          <motion.div key={f.judul} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-5" style={card}>
            <span className="flex size-10 items-center justify-center rounded-2xl"
              style={{ background: "var(--tdp-primary-soft)" }}>
              <f.Icon className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
            </span>

            <p className="mt-3 text-base" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>{f.judul}</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--tdp-muted)" }}>{f.isi}</p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14">
        <div className="relative overflow-hidden p-8 text-center"
          style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}>
          <div className="absolute -right-12 -top-12 size-44 rounded-full opacity-20" style={{ background: "#fff" }} />

          <div className="relative">
            <CalendarDays className="mx-auto size-8 text-white" />

            <h2 className="mt-2 text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>
              Sedikit tapi terus-menerus
            </h2>
            <p className="mt-1 text-sm text-white/85">
              Mulai dari satu ayat hari ini. Nanti Progres Diri akan menunjukkan hasilnya.
            </p>

            <Link href="/beranda" className="mt-5 inline-block px-6 py-3 text-sm"
              style={{ background: "#fff", borderRadius: "999px", color: "var(--tdp-primary-ink)" }}>
              Buka Rihlah
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}