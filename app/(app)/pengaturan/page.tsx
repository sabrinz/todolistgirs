"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Bell, Sparkles, Trash2 } from "lucide-react"
import { useSettingsStore, type ThemeId } from "@/store/settings-store"
import { useHafalanStore } from "@/store/hafalan-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const kolom = {
  background: "var(--tdp-bg)",
  borderRadius: "var(--tdp-radius-sm)",
  color: "var(--tdp-text)",
}

const TEMA: Array<{ id: ThemeId; label: string; warna: string }> = [
  { id: "pink", label: "Pink Princess", warna: "#FF6FA5" },
  { id: "purple", label: "Purple Dream", warna: "#A97BE6" },
  { id: "matcha", label: "Matcha Cute", warna: "#7CC79B" },
  { id: "blue", label: "Blue Sky", warna: "#6FB6EE" },
  { id: "strawberry", label: "Strawberry", warna: "#F2607A" },
  { id: "lavender", label: "Lavender", warna: "#9C8BD8" },
  { id: "chocolate", label: "Chocolate", warna: "#B08968" },
  { id: "minimalist", label: "Minimalist", warna: "#6B7280" },
]

export default function PengaturanPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const {
    name, kota, theme, animation, reminder,
    setName, setKota, setTheme, toggle, resetAll,
  } = useSettingsStore()

  const { targetHarian, setTargetHarian } = useHafalanStore()
  const [yakin, setYakin] = useState(false)

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <section
        className="relative overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Pengaturan</h1>
          <p className="text-sm text-white/85">Semua data tersimpan di perangkat ini saja</p>
        </div>
      </section>

      <section className="flex flex-col gap-3 p-4" style={card}>
        <h2 className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Identitas
        </h2>

        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--tdp-muted)" }}>
          Nama panggilan
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="px-3 py-2.5 text-sm outline-none" style={kolom} />
        </label>

        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--tdp-muted)" }}>
          Kota tempat tinggal, dipakai untuk waktu sholat
          <input value={kota} onChange={(e) => setKota(e.target.value)}
            className="px-3 py-2.5 text-sm outline-none" style={kolom} />
        </label>

        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--tdp-muted)" }}>
          Target hafalan per hari (ayat)
          <input type="number" min={1} value={targetHarian}
            onChange={(e) => setTargetHarian(Number(e.target.value))}
            className="px-3 py-2.5 text-sm outline-none" style={kolom} />
        </label>
      </section>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Tema
        </h2>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TEMA.map((t) => {
            const aktif = theme === t.id

            return (
              <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTheme(t.id)}
                className="flex flex-col items-center gap-2 p-3"
                style={{
                  background: aktif ? "var(--tdp-primary-soft)" : "var(--tdp-bg)",
                  borderRadius: "var(--tdp-radius-sm)",
                  border: aktif ? "2px solid var(--tdp-primary)" : "2px solid transparent",
                }}>
                <span className="size-8 rounded-full" style={{ background: t.warna }} />
                <span className="text-[11px]" style={{ color: "var(--tdp-text)" }}>{t.label}</span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2 p-4" style={card}>
        <h2 className="mb-1 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Tampilan
        </h2>

        {([
          { k: "animation" as const, label: "Animasi dan confetti", nilai: animation, Icon: Sparkles },
          { k: "reminder" as const, label: "Tampilkan kartu pengingat murojaah", nilai: reminder, Icon: Bell },
        ]).map((s) => (
          <button key={s.k} onClick={() => toggle(s.k)}
            className="flex items-center gap-3 p-3 text-left text-sm"
            style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}>
            <s.Icon className="size-4" style={{ color: "var(--tdp-primary-ink)" }} />
            <span className="flex-1">{s.label}</span>

            <span className="flex h-6 w-11 items-center rounded-full p-0.5"
              style={{ background: s.nilai ? "var(--tdp-primary)" : "var(--tdp-primary-soft)" }}>
              <motion.span layout className="size-5 rounded-full bg-white"
                style={{ marginLeft: s.nilai ? "auto" : 0 }} />
            </span>
          </button>
        ))}
      </section>

      <section className="p-4" style={{ ...card, background: "#FFEFEF" }}>
        <h2 className="mb-1 flex items-center gap-2 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "#C93E58" }}>
          <AlertTriangle className="size-4" /> Hapus semua data
        </h2>
        <p className="mb-3 text-xs" style={{ color: "var(--tdp-text)" }}>
          Menghapus seluruh setoran hafalan, amalan, muqorror, mufrodat, jadwal, journal, catatan, dan mood.
          Tidak bisa dibatalkan.
        </p>

        {!yakin ? (
          <button onClick={() => setYakin(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs"
            style={{ background: "var(--tdp-card)", borderRadius: "var(--tdp-radius-sm)", color: "#C93E58" }}>
            <Trash2 className="size-3.5" /> Hapus semua data
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={resetAll} className="flex-1 py-2.5 text-xs text-white"
              style={{ background: "#C93E58", borderRadius: "var(--tdp-radius-sm)" }}>
              Ya, hapus sekarang
            </button>

            <button onClick={() => setYakin(false)} className="flex-1 py-2.5 text-xs"
              style={{ background: "var(--tdp-card)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}>
              Batal
            </button>
          </div>
        )}
      </section>
    </div>
  )
}