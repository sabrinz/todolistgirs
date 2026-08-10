"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  BookOpen, Check, Heart, Library, Moon, Plus, Repeat, Sun, Sunrise, Sunset, Trash2,
} from "lucide-react"
import { persenAmalan, rentetanAmalan, useAmalanStore } from "@/store/amalan-store"
import { kunciHari } from "@/store/hafalan-store"
import { useSettingsStore } from "@/store/settings-store"
import { daftarHari } from "@/lib/skor"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const IKON = {
  book: BookOpen, sunrise: Sunrise, sunset: Sunset, sun: Sun,
  moon: Moon, repeat: Repeat, library: Library, heart: Heart, check: Check,
} as const

const R = 46
const KELILING = 2 * Math.PI * R

export default function AmalanPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const animation = useSettingsStore((s) => s.animation)
  const { amalan, log, toggle, tambahAmalan, hapusAmalan } = useAmalanStore()
  const [baru, setBaru] = useState("")

  const hari = kunciHari()
  const dicentang = log[hari] ?? []
  const persen = persenAmalan(log, hari, amalan.length)
  const tujuhHari = useMemo(() => daftarHari(7).reverse(), [])

  function klik(id: string) {
    const sebelum = dicentang.length
    toggle(hari, id)

    if (animation && sebelum + 1 === amalan.length) {
      confetti({
        particleCount: 90, spread: 75, origin: { y: 0.7 },
        colors: ["#FF6FA5", "#FFC2DA", "#C9A7F5", "#FFE08A", "#8FE0BE"],
      })
    }
  }

  function simpanBaru(e: React.FormEvent) {
    e.preventDefault()
    if (!baru.trim()) return
    tambahAmalan(baru)
    setBaru("")
  }

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <section
        className="relative flex items-center gap-5 overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative shrink-0">
          <svg width={114} height={114} viewBox="0 0 114 114">
            <circle cx={57} cy={57} r={R} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={10} />
            <motion.circle
              cx={57} cy={57} r={R} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round"
              strokeDasharray={KELILING}
              initial={{ strokeDashoffset: KELILING }}
              animate={{ strokeDashoffset: KELILING - (KELILING * persen) / 100 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              transform="rotate(-90 57 57)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>
            {persen}%
          </div>
        </div>

        <div className="relative">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Amalan Harian</h1>
          <p className="text-sm text-white/85">
            {dicentang.length} dari {amalan.length} amalan hari ini
          </p>
          <p className="mt-2 inline-block rounded-full bg-white/25 px-3 py-1 text-xs text-white backdrop-blur">
            Rentetan {rentetanAmalan(log)} hari
          </p>
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-2">
        {amalan.map((a) => {
          const Icon = IKON[a.ikon as keyof typeof IKON] ?? Check
          const aktif = dicentang.includes(a.id)

          return (
            <motion.div key={a.id} whileTap={{ scale: 0.98 }} className="flex items-center gap-3 p-3.5" style={{ ...card, background: aktif ? "var(--tdp-mint-soft)" : "var(--tdp-card)" }}>
              <button onClick={() => klik(a.id)} className="flex flex-1 items-center gap-3 text-left">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: aktif ? "var(--tdp-primary)" : "var(--tdp-bg)" }}
                >
                  {aktif ? <Check className="size-4 text-white" /> : <Icon className="size-4" style={{ color: "var(--tdp-muted)" }} />}
                </span>

                <span className="text-sm" style={{ color: "var(--tdp-text)", textDecoration: aktif ? "line-through" : "none" }}>
                  {a.nama}
                </span>
              </button>

              {!a.bawaan && (
                <button onClick={() => hapusAmalan(a.id)} aria-label="Hapus amalan">
                  <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
                </button>
              )}
            </motion.div>
          )
        })}
      </section>

      <form onSubmit={simpanBaru} className="flex gap-2 p-3" style={card}>
        <input
          value={baru} onChange={(e) => setBaru(e.target.value)}
          placeholder="Tambah amalan sendiri, misalnya Sholat Tahajud"
          className="flex-1 px-3 py-2.5 text-sm outline-none"
          style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
        />
        <button
          type="submit" className="flex items-center gap-1.5 px-4 text-sm text-white"
          style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}
        >
          <Plus className="size-4" /> Tambah
        </button>
      </form>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Tujuh hari terakhir
        </h2>

        <div className="grid grid-cols-7 gap-2">
          {tujuhHari.map((t) => {
            const p = persenAmalan(log, t, amalan.length)
            const tanggal = new Date(t)

            return (
              <div key={t} className="text-center">
                <div
                  className="mx-auto flex aspect-square items-center justify-center text-xs"
                  style={{
                    background: p === 0 ? "var(--tdp-bg)" : p === 100 ? "var(--tdp-primary)" : "var(--tdp-primary-soft)",
                    color: p === 100 ? "#fff" : "var(--tdp-text)",
                    borderRadius: "var(--tdp-radius-sm)",
                    fontFamily: "var(--font-baloo)",
                  }}
                >
                  {p}%
                </div>
                <p className="mt-1 text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                  {tanggal.toLocaleDateString("id-ID", { weekday: "short" })}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}