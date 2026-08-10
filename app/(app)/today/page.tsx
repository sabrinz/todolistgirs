"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Check, Clock, Coffee, Moon, PartyPopper, Plus, Sun, Sunrise, Trash2,
} from "lucide-react"
import { useTaskStore, todayKey, type Category } from "@/store/task-store"
import { useSettingsStore } from "@/store/settings-store"

const CATEGORIES: { name: Category; color: string }[] = [
  { name: "Sekolah", color: "var(--tdp-sky)" },
  { name: "Belajar", color: "var(--tdp-lemon)" },
  { name: "Kesehatan", color: "var(--tdp-mint)" },
  { name: "Self Care", color: "var(--tdp-lilac)" },
  { name: "Hobi", color: "var(--tdp-primary-soft)" },
]

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

export default function TodayPage() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<Category>("Sekolah")
  const [time, setTime] = useState("")

  const { tasks, addTask, toggleTask, removeTask } = useTaskStore()
  const { name, animation } = useSettingsStore()

  useEffect(() => setMounted(true), [])

  const todayTasks = useMemo(
    () => tasks.filter((t) => t.createdAt.slice(0, 10) === todayKey()),
    [tasks]
  )

  if (!mounted) return null

  const done = todayTasks.filter((t) => t.done).length
  const total = todayTasks.length
  const progress = total ? Math.round((done / total) * 100) : 0
  const belum = todayTasks.filter((t) => !t.done)
  const berikutnya = belum[belum.length - 1]

  const hour = new Date().getHours()
  const greeting =
    hour < 11
      ? { text: "Selamat pagi", Icon: Sunrise }
      : hour < 15
      ? { text: "Selamat siang", Icon: Sun }
      : hour < 19
      ? { text: "Selamat sore", Icon: Coffee }
      : { text: "Selamat malam", Icon: Moon }

  const tanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handleToggle = (id: string) => {
    const completed = toggleTask(id)
    if (completed && animation) {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#FF6FA5", "#FFC2DA", "#C9A7F5", "#FFE08A"],
      })
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask({ title, category, time: time || undefined })
    setTitle("")
    setTime("")
    setOpen(false)
  }

  // Lingkaran progress
  const R = 52
  const KELILING = 2 * Math.PI * R

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--tdp-muted)" }}>
          <greeting.Icon className="size-4" />
          {tanggal}
        </p>
        <h1
          className="mt-1 text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          {greeting.text}, {name}!
        </h1>
      </motion.div>

      {/* Lingkaran progress */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 p-6 sm:flex-row"
        style={card}
      >
        <div className="relative size-32 shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={R} fill="none"
              stroke="var(--tdp-bg)" strokeWidth="12"
            />
            <motion.circle
              cx="60" cy="60" r={R} fill="none"
              stroke="var(--tdp-primary)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={KELILING}
              initial={{ strokeDashoffset: KELILING }}
              animate={{ strokeDashoffset: KELILING - (KELILING * progress) / 100 }}
              transition={{ type: "spring", stiffness: 45, damping: 15 }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              key={progress}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl leading-none"
              style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
            >
              {progress}%
            </motion.p>
            <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>
              {done}/{total} selesai
            </p>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          {total === 0 ? (
            <>
              <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
                Hari ini masih kosong
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
                Tambahkan satu tugas kecil untuk memulai
              </p>
            </>
          ) : belum.length === 0 ? (
            <>
              <p className="flex items-center justify-center gap-2 text-lg sm:justify-start" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
                <PartyPopper className="size-5" />
                Semua tugas selesai!
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
                Kamu hebat hari ini. Istirahat yang cukup ya!
              </p>
            </>
          ) : (
            <>
              <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
                Tugas berikutnya
              </p>
              <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
                {berikutnya.title}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
                Tinggal {belum.length} tugas lagi. Ayo semangat!
              </p>
            </>
          )}
        </div>
      </motion.section>

      {/* Daftar tugas hari ini */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5"
        style={card}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Fokus Hari Ini
          </p>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full px-4 py-2 text-xs text-white"
            style={{ background: "var(--tdp-primary)", boxShadow: "var(--tdp-shadow)" }}
          >
            <motion.span animate={{ rotate: open ? 45 : 0 }}>
              <Plus className="size-4" />
            </motion.span>
            {open ? "Tutup" : "Tambah"}
          </motion.button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 rounded-2xl p-4" style={{ background: "var(--tdp-bg)" }}>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Apa yang mau kamu selesaikan hari ini?"
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--tdp-card)",
                    border: "1px solid var(--tdp-border)",
                    color: "var(--tdp-text)",
                  }}
                />

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setCategory(c.name)}
                      className="rounded-full px-3 py-1.5 text-[11px] transition-transform hover:scale-105"
                      style={{
                        background: category === c.name ? c.color : "var(--tdp-card)",
                        color: "var(--tdp-text)",
                        border: "1px solid var(--tdp-border)",
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-xl px-3 py-2 text-sm outline-none"
                    style={{
                      background: "var(--tdp-card)",
                      border: "1px solid var(--tdp-border)",
                      color: "var(--tdp-text)",
                    }}
                  />
                  <button
                    type="submit"
                    className="ml-auto rounded-full px-5 py-2 text-xs text-white"
                    style={{ background: "var(--tdp-primary)" }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <ul className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {todayTasks.map((t) => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3"
                style={{ background: "var(--tdp-bg)" }}
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleToggle(t.id)}
                  aria-label="Tandai selesai"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: "var(--tdp-primary)",
                    background: t.done ? "var(--tdp-primary)" : "transparent",
                  }}
                >
                  <AnimatePresence>
                    {t.done && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="size-4 text-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <span
                  className="min-w-0 flex-1 truncate text-sm"
                  style={{
                    color: "var(--tdp-text)",
                    textDecoration: t.done ? "line-through" : "none",
                    opacity: t.done ? 0.5 : 1,
                  }}
                >
                  {t.title}
                </span>

                <span
                  className="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] sm:block"
                  style={{
                    background: CATEGORIES.find((c) => c.name === t.category)?.color,
                    color: "var(--tdp-text)",
                  }}
                >
                  {t.category}
                </span>

                {t.time && (
                  <span
                    className="hidden shrink-0 items-center gap-1 text-[11px] md:flex"
                    style={{ color: "var(--tdp-muted)" }}
                  >
                    <Clock className="size-3" />
                    {t.time}
                  </span>
                )}

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => removeTask(t.id)}
                  aria-label="Hapus tugas"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {total === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex size-14 items-center justify-center rounded-full"
              style={{ background: "var(--tdp-bg)" }}
            >
              <Sun className="size-6" style={{ color: "var(--tdp-primary)" }} />
            </motion.span>
            <p className="text-sm" style={{ color: "var(--tdp-muted)" }}>
              Belum ada tugas hari ini. Klik Tambah untuk memulai!
            </p>
          </div>
        )}
      </motion.section>
    </div>
  )
}