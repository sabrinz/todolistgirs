"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Coffee, Frown, Heart, Laugh, Meh, Smile } from "lucide-react"
import { kunciHari } from "@/store/hafalan-store"
import { useMoodStore, type MoodValue } from "@/store/mood-store"
import { daftarHari } from "@/lib/skor"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const MOODS: Array<{ id: MoodValue; label: string; Icon: typeof Smile; warna: string }> = [
  { id: "bahagia", label: "Bahagia", Icon: Laugh, warna: "var(--tdp-lemon-soft)" },
  { id: "senang", label: "Senang", Icon: Smile, warna: "var(--tdp-mint-soft)" },
  { id: "biasa", label: "Biasa", Icon: Meh, warna: "var(--tdp-sky-soft)" },
  { id: "rindu", label: "Rindu rumah", Icon: Heart, warna: "var(--tdp-primary-soft)" },
  { id: "lelah", label: "Lelah", Icon: Coffee, warna: "var(--tdp-lilac-soft)" },
  { id: "sedih", label: "Sedih", Icon: Frown, warna: "#FFEFEF" },
]

export default function MoodPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { moodByDate, catatanByDate, setMood, setCatatan } = useMoodStore()
  const hari = kunciHari()
  const [teks, setTeks] = useState("")

  useEffect(() => {
    setTeks(catatanByDate[hari] ?? "")
  }, [catatanByDate, hari])

  const tigaPuluh = useMemo(() => daftarHari(30).reverse(), [])

  const rekap = useMemo(() => {
    const hitung = new Map<MoodValue, number>()
    for (const t of tigaPuluh) {
      const m = moodByDate[t]
      if (m) hitung.set(m, (hitung.get(m) ?? 0) + 1)
    }
    return hitung
  }, [moodByDate, tigaPuluh])

  const terisi = [...rekap.values()].reduce((a, b) => a + b, 0)
  const pilihan = moodByDate[hari]

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <section
        className="relative overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Mood</h1>
          <p className="text-sm text-white/85">
            {terisi} dari 30 hari terakhir tercatat
          </p>
        </div>
      </section>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Bagaimana hari ini?
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {MOODS.map((m) => {
            const aktif = pilihan === m.id

            return (
              <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => setMood(hari, m.id)}
                className="flex flex-col items-center gap-1.5 py-4"
                style={{
                  background: aktif ? "var(--tdp-primary)" : m.warna,
                  color: aktif ? "#fff" : "var(--tdp-text)",
                  borderRadius: "var(--tdp-radius-sm)",
                }}>
                <m.Icon className="size-6" />
                <span className="text-[11px]">{m.label}</span>
              </motion.button>
            )
          })}
        </div>

        <textarea value={teks} onChange={(e) => setTeks(e.target.value)} onBlur={() => setCatatan(hari, teks)}
          rows={3} placeholder="Kalau mau, tuliskan sedikit alasannya. Otomatis tersimpan."
          className="mt-3 w-full resize-none px-3 py-2.5 text-sm outline-none"
          style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }} />
      </section>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Tiga puluh hari terakhir
        </h2>

        <div className="grid grid-cols-10 gap-1.5">
          {tigaPuluh.map((t) => {
            const m = MOODS.find((x) => x.id === moodByDate[t])

            return (
              <div key={t} title={t}
                className="flex aspect-square items-center justify-center"
                style={{
                  background: m ? m.warna : "var(--tdp-bg)",
                  borderRadius: "12px",
                }}>
                {m && <m.Icon className="size-3.5" style={{ color: "var(--tdp-primary-ink)" }} />}
              </div>
            )
          })}
        </div>
      </section>

      {terisi > 0 && (
        <section className="p-4" style={card}>
          <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Rekap suasana hati
          </h2>

          <div className="flex flex-col gap-2">
            {MOODS.map((m) => {
              const jumlah = rekap.get(m.id) ?? 0
              const persen = Math.round((jumlah / terisi) * 100)
              if (jumlah === 0) return null

              return (
                <div key={m.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="flex items-center gap-1.5" style={{ color: "var(--tdp-text)" }}>
                      <m.Icon className="size-3.5" /> {m.label}
                    </span>
                    <span style={{ color: "var(--tdp-muted)" }}>{jumlah} hari · {persen}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--tdp-bg)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${persen}%` }}
                      className="h-full rounded-full" style={{ background: "var(--tdp-primary)" }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}