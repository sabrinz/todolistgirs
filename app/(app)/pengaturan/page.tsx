"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bell, Check, Palette, RotateCcw, Sparkles, User, Volume2,
} from "lucide-react"
import { useSettingsStore, type ThemeId } from "@/store/settings-store"
import { useTaskStore } from "@/store/task-store"
import { useNoteStore } from "@/store/note-store"

const THEMES: { id: ThemeId; label: string; colors: string[] }[] = [
  { id: "pink", label: "Pink Princess", colors: ["#FF6FA5", "#FFC2DA", "#FFF6FA"] },
  { id: "purple", label: "Purple Dream", colors: ["#A97BE6", "#DCC8F7", "#F8F4FF"] },
  { id: "matcha", label: "Matcha Cute", colors: ["#7CC79B", "#CDEBD8", "#F4FBF6"] },
  { id: "blue", label: "Blue Sky", colors: ["#6FB6EE", "#C6E4FA", "#F4FAFF"] },
]

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className="flex h-7 w-12 shrink-0 items-center rounded-full px-1 transition-colors"
      style={{ background: on ? "var(--tdp-primary)" : "var(--tdp-border)" }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 32 }}
        className="size-5 rounded-full bg-white shadow"
        style={{ marginLeft: on ? "auto" : 0 }}
      />
    </button>
  )
}

export default function PengaturanPage() {
  const [mounted, setMounted] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const { name, theme, reminder, sound, animation, setName, setTheme, toggle, resetAll } =
    useSettingsStore()

  const tasks = useTaskStore((s) => s.tasks)
  const notes = useNoteStore((s) => s.notes)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggles = [
    { key: "reminder" as const, label: "Pengingat Tugas", desc: "Ingatkan saat waktunya tiba", Icon: Bell, value: reminder },
    { key: "sound" as const, label: "Efek Suara", desc: "Bunyi lucu saat tugas selesai", Icon: Volume2, value: sound },
    { key: "animation" as const, label: "Animasi & Confetti", desc: "Perayaan saat menyelesaikan tugas", Icon: Sparkles, value: animation },
  ]

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Pengaturan
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
          Atur aplikasi sesuai seleramu
        </p>
      </motion.div>

      {/* Profil */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
        style={card}
      >
        <span
          className="flex size-16 shrink-0 items-center justify-center rounded-3xl"
          style={{ background: "var(--tdp-primary-soft)" }}
        >
          <User className="size-7" style={{ color: "var(--tdp-primary-ink)" }} />
        </span>

        <div className="flex-1">
          <label className="text-xs" style={{ color: "var(--tdp-muted)" }}>
            Nama panggilan
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: "var(--tdp-bg)",
              border: "1px solid var(--tdp-border)",
              color: "var(--tdp-text)",
            }}
          />
          <p className="mt-1.5 text-[11px]" style={{ color: "var(--tdp-muted)" }}>
            Nama ini muncul di sapaan halaman Beranda
          </p>
        </div>

        <div className="flex gap-3 text-center">
          <div className="rounded-2xl px-4 py-3" style={{ background: "var(--tdp-bg)" }}>
            <p
              className="text-xl leading-none"
              style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
            >
              {tasks.length}
            </p>
            <p className="mt-1 text-[10px]" style={{ color: "var(--tdp-muted)" }}>Tugas</p>
          </div>
          <div className="rounded-2xl px-4 py-3" style={{ background: "var(--tdp-bg)" }}>
            <p
              className="text-xl leading-none"
              style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
            >
              {notes.length}
            </p>
            <p className="mt-1 text-[10px]" style={{ color: "var(--tdp-muted)" }}>Catatan</p>
          </div>
        </div>
      </motion.section>

      {/* Tema */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5"
        style={card}
      >
        <p className="flex items-center gap-2 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          <Palette className="size-5" />
          Tema Lucu
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((t) => {
            const active = theme === t.id
            return (
              <motion.button
                key={t.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTheme(t.id)}
                className="relative flex flex-col items-center gap-2 rounded-3xl p-4"
                style={{
                  background: "var(--tdp-bg)",
                  border: active ? "2px solid var(--tdp-primary)" : "2px solid transparent",
                }}
              >
                {active && (
                  <span
                    className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full"
                    style={{ background: "var(--tdp-primary)" }}
                  >
                    <Check className="size-3 text-white" />
                  </span>
                )}

                <span className="flex gap-1">
                  {t.colors.map((c) => (
                    <span
                      key={c}
                      className="size-5 rounded-full"
                      style={{ background: c, border: "1px solid rgba(0,0,0,0.05)" }}
                    />
                  ))}
                </span>

                <span className="text-[11px]" style={{ color: "var(--tdp-text)" }}>
                  {t.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.section>

      {/* Fitur */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5"
        style={card}
      >
        <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Fitur
        </p>

        <div className="mt-4 space-y-2">
          {toggles.map((t) => (
            <div
              key={t.key}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "var(--tdp-bg)" }}
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--tdp-card)" }}
              >
                <t.Icon className="size-4" style={{ color: "var(--tdp-primary)" }} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm" style={{ color: "var(--tdp-text)" }}>{t.label}</p>
                <p className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>{t.desc}</p>
              </div>

              <Switch on={t.value} onClick={() => toggle(t.key)} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Hapus data */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
        style={{ ...card, border: "2px dashed var(--tdp-border)" }}
      >
        <div className="flex-1">
          <p className="text-sm" style={{ color: "var(--tdp-text)" }}>Hapus Semua Data</p>
          <p className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>
            Menghapus seluruh tugas, catatan, mood, dan poin. Tidak bisa dibatalkan.
          </p>
        </div>

        {confirm ? (
          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="rounded-full px-4 py-2 text-xs text-white"
              style={{ background: "#E2467E" }}
            >
              Ya, hapus
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="rounded-full px-4 py-2 text-xs"
              style={{ background: "var(--tdp-bg)", color: "var(--tdp-text)" }}
            >
              Batal
            </button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setConfirm(true)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs"
            style={{ background: "var(--tdp-bg)", color: "var(--tdp-primary-ink)" }}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </motion.button>
        )}
      </motion.section>
    </div>
  )
}