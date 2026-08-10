"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart3, Bell, CalendarDays, Crown, Gift, ListTodo,
  NotebookPen, Palette, Smile, Sparkles,
} from "lucide-react"
import { BearMascot, BunnyMascot, CatMascot } from "@/components/decor/mascot"

const FEATURES = [
  { Icon: ListTodo, title: "To-Do List", desc: "Kelola tugas harian dengan rapi" },
  { Icon: CalendarDays, title: "Kalender", desc: "Lihat semua tugas per tanggal" },
  { Icon: Bell, title: "Reminder", desc: "Pengingat supaya tidak lupa" },
  { Icon: Smile, title: "Mood Tracker", desc: "Catat perasaanmu setiap hari" },
  { Icon: BarChart3, title: "Progress", desc: "Grafik perkembanganmu" },
  { Icon: NotebookPen, title: "Catatan", desc: "Diary pribadi yang aman" },
  { Icon: Palette, title: "Tema Lucu", desc: "Ganti warna sesuai suasana" },
  { Icon: Gift, title: "Reward System", desc: "Kumpulkan poin dan lencana" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--tdp-bg)" }}>
      {/* Bagian atas */}
      <header className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-6">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Crown className="size-5 text-white" />
        </motion.span>

        <p
          className="text-xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          To-Do Princess
        </p>

        <Link
          href="/beranda"
          className="ml-auto rounded-full px-5 py-2 text-xs text-white"
          style={{ background: "var(--tdp-primary)", boxShadow: "var(--tdp-shadow)" }}
        >
          Masuk Aplikasi
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 md:items-center md:py-20">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px]"
            style={{ background: "var(--tdp-primary-soft)", color: "var(--tdp-primary-ink)" }}
          >
            <Sparkles className="size-3.5" />
            Aplikasi to-do yang bikin semangat
          </span>

          <h1
            className="mt-4 text-4xl leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Atur harimu dengan cara yang lucu
          </h1>

          <p className="mt-4 max-w-md text-sm md:text-base" style={{ color: "var(--tdp-text)" }}>
            Catat tugas, lacak perasaan, kumpulkan poin, dan lihat progresmu berkembang
            setiap hari. Gratis dan tersimpan otomatis.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/beranda"
                className="inline-block rounded-full px-7 py-3.5 text-sm text-white"
                style={{ background: "var(--tdp-primary)", boxShadow: "var(--tdp-shadow)" }}
              >
                Mulai Sekarang Gratis
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/statistik"
                className="inline-block rounded-full px-7 py-3.5 text-sm"
                style={{ background: "var(--tdp-card)", color: "var(--tdp-primary-ink)" }}
              >
                Lihat Fitur
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Kartu maskot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto w-full max-w-sm rounded-[40px] p-8 text-center"
          style={{ background: "var(--tdp-card)", boxShadow: "var(--tdp-shadow)" }}
        >
          <div className="flex justify-center">
            <BunnyMascot size={150} />
          </div>

          <p
            className="mt-4 text-2xl"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            You can do it, girl!
          </p>
          <p className="mt-1.5 text-xs" style={{ color: "var(--tdp-muted)" }}>
            Setiap tugas kecil yang selesai itu kemenangan
          </p>

          <div className="mt-4 flex items-end justify-center gap-1">
            <BearMascot size={64} />
            <CatMascot size={64} />
          </div>
        </motion.div>
      </section>

      {/* Fitur */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2
          className="text-center text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Semua yang kamu butuhkan
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-5"
              style={{ background: "var(--tdp-card)", boxShadow: "var(--tdp-shadow)" }}
            >
              <span
                className="flex size-11 items-center justify-center rounded-2xl"
                style={{ background: "var(--tdp-primary-soft)" }}
              >
                <f.Icon className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
              </span>

              <p
                className="mt-3 text-lg"
                style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
              >
                {f.title}
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--tdp-muted)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Ajakan terakhir */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-[40px] p-10 text-center"
          style={{ background: "var(--tdp-primary-soft)" }}
        >
          <h3
            className="text-2xl md:text-3xl"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Siap jadi lebih produktif?
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--tdp-text)" }}>
            Tidak perlu daftar. Langsung pakai sekarang juga.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="mt-6 inline-block">
            <Link
              href="/beranda"
              className="inline-block rounded-full px-8 py-3.5 text-sm text-white"
              style={{ background: "var(--tdp-primary)", boxShadow: "var(--tdp-shadow)" }}
            >
              Mulai Sekarang Gratis
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="pb-10 text-center text-[11px]" style={{ color: "var(--tdp-muted)" }}>
        Dibuat dengan sayang untuk kamu yang sedang berjuang
      </footer>
    </div>
  )
}