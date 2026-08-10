"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  BatteryLow, Check, ChevronRight, Flame, Frown, Laugh, ListChecks,
  Meh, Plus, Quote, Smile, Sparkles, Trash2, TrendingUp, Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTaskStore, todayKey, type Category, type MoodValue } from "@/store/task-store"
import { useSettingsStore } from "@/store/settings-store"

const CATEGORIES: { name: Category; color: string }[] = [
  { name: "Sekolah", color: "var(--tdp-sky)" },
  { name: "Belajar", color: "var(--tdp-lemon)" },
  { name: "Kesehatan", color: "var(--tdp-mint)" },
  { name: "Self Care", color: "var(--tdp-lilac)" },
  { name: "Hobi", color: "var(--tdp-primary-soft)" },
]

const MOODS: { value: MoodValue; label: string; Icon: typeof Smile }[] = [
  { value: "bahagia", label: "Bahagia", Icon: Laugh },
  { value: "senang", label: "Senang", Icon: Smile },
  { value: "biasa", label: "Biasa", Icon: Meh },
  { value: "sedih", label: "Sedih", Icon: Frown },
  { value: "lelah", label: "Lelah", Icon: BatteryLow },
]

const QUOTES = [
  "You don't have to be perfect to be amazing.",
  "Sedikit demi sedikit tetap lebih baik daripada tidak sama sekali.",
  "Kamu tidak harus cepat, cukup jangan berhenti.",
  "Hari ini cukup jadi versi kecil dirimu yang lebih baik.",
]

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

export default function BerandaPage() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<"Semua" | Category>("Semua")
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<Category>("Sekolah")
  const [time, setTime] = useState("")

  const { tasks, points, streak, moodByDate, addTask, toggleTask, removeTask, setMood, touchStreak } =
    useTaskStore()
    const { name, animation } = useSettingsStore()

  useEffect(() => {
    setMounted(true)
    touchStreak()
  }, [touchStreak])

  const done = tasks.filter((t) => t.done).length
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0
  const mood = moodByDate[todayKey()]

  const visible = useMemo(
    () => (filter === "Semua" ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter]
  )

  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], [])

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

  if (!mounted) return null

  const summary = [
    { label: "Total Tugas", value: tasks.length, sub: "tugas kamu", Icon: ListChecks },
    { label: "Selesai", value: done, sub: "tugas", Icon: Check },
    { label: "Progress", value: `${progress}%`, sub: progress >= 70 ? "Hampir selesai!" : "Ayo semangat!", Icon: TrendingUp },
    { label: "Reward Points", value: points, sub: `${done * 10} dari tugas selesai`, Icon: Trophy },
  ]

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center"
      >
        <div className="flex-1">
          <h1
            className="text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Haii, {name}!
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: "var(--tdp-muted)" }}>
            <Sparkles className="size-4" />
            Semangat hari ini ya! Kamu hebat!
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3 px-5 py-3" style={card}>
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="flex size-10 items-center justify-center rounded-full"
            style={{ background: "var(--tdp-primary-soft)" }}
          >
            <Flame className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
          </motion.span>
          <div>
            <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>Streak</p>
            <p className="text-lg leading-tight" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              {streak} Hari
            </p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="p-4"
            style={card}
          >
            <div className="flex items-start justify-between">
              <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>{s.label}</p>
              <span className="flex size-8 items-center justify-center rounded-full" style={{ background: "var(--tdp-bg)" }}>
                <s.Icon className="size-4" style={{ color: "var(--tdp-primary)" }} />
              </span>
            </div>

            <motion.p
              key={String(s.value)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-2 text-3xl leading-none"
              style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
            >
              {s.value}
            </motion.p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--tdp-muted)" }}>{s.sub}</p>

            {s.label === "Progress" && (
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--tdp-primary-soft)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--tdp-primary)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 60 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 lg:col-span-2"
          style={card}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              Tugas Hari Ini
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
              {open ? "Tutup" : "Tambah Tugas"}
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
                    placeholder="Contoh: Belajar 1 jam"
                    className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--tdp-card)", border: "1px solid var(--tdp-border)", color: "var(--tdp-text)" }}
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
                      style={{ background: "var(--tdp-card)", border: "1px solid var(--tdp-border)", color: "var(--tdp-text)" }}
                    />
                    <button
                      type="submit"
                      className="ml-auto rounded-full px-5 py-2 text-xs text-white"
                      style={{ background: "var(--tdp-primary)" }}
                    >
                      Simpan Tugas
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["Semua", ...CATEGORIES.map((c) => c.name)] as const).map((f) => {
              const active = filter === f
              const count = f === "Semua" ? tasks.length : tasks.filter((t) => t.category === f).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-full px-3 py-1.5 text-xs transition-colors"
                  style={active
                    ? { background: "var(--tdp-primary)", color: "#fff" }
                    : { background: "var(--tdp-bg)", color: "var(--tdp-muted)" }}
                >
                  {f} <span className="opacity-70">{count}</span>
                </button>
              )
            })}
          </div>

          <ul className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {visible.map((t) => (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
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
                    className={cn("min-w-0 flex-1 truncate text-sm", t.done && "line-through opacity-50")}
                    style={{ color: "var(--tdp-text)" }}
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

                  <span className="hidden w-12 shrink-0 text-right text-[11px] md:block" style={{ color: "var(--tdp-muted)" }}>
                    {t.time}
                  </span>

                  <button
                    onClick={() => removeTask(t.id)}
                    aria-label="Hapus"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
                  </button>

                  <ChevronRight className="size-4 shrink-0" style={{ color: "var(--tdp-muted)" }} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2 py-10 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-full" style={{ background: "var(--tdp-bg)" }}>
                <ListChecks className="size-6" style={{ color: "var(--tdp-primary)" }} />
              </span>
              <p className="text-sm" style={{ color: "var(--tdp-muted)" }}>
                Belum ada tugas. Yuk tambah satu!
              </p>
            </motion.div>
          )}
        </motion.section>

        <div className="space-y-4">
          <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="p-5" style={card}>
            <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              Mood Hari Ini
            </p>
            <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>Bagaimana perasaanmu?</p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {MOODS.map((m) => {
                const active = mood === m.value
                return (
                  <motion.button
                    key={m.value}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setMood(m.value)}
                    className="flex flex-col items-center gap-1.5 rounded-2xl py-3 text-[11px]"
                    style={{
                      background: active ? "var(--tdp-primary-soft)" : "var(--tdp-bg)",
                      color: "var(--tdp-text)",
                    }}
                  >
                    <m.Icon className="size-6" style={{ color: "var(--tdp-primary-ink)" }} />
                    {m.label}
                  </motion.button>
                )
              })}
            </div>

            <p className="mt-3 text-center text-[11px]" style={{ color: "var(--tdp-muted)" }}>
              {mood ? "Mood tersimpan untuk hari ini" : "Belum diisi hari ini"}
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 text-center"
            style={{ ...card, background: "var(--tdp-primary-soft)" }}
          >
            <Quote className="mx-auto size-5" style={{ color: "var(--tdp-primary-ink)" }} />
            <p className="mt-2 text-sm italic" style={{ color: "var(--tdp-text)" }}>
              {quote}
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  )
}