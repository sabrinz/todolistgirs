"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BatteryLow, ChevronLeft, ChevronRight, Frown, Laugh, Meh, Smile, Sparkles,
} from "lucide-react"
import { useTaskStore, todayKey, type MoodValue } from "@/store/task-store"

const MOODS: { value: MoodValue; label: string; Icon: typeof Smile; color: string }[] = [
  { value: "bahagia", label: "Bahagia", Icon: Laugh, color: "#FFD166" },
  { value: "senang", label: "Senang", Icon: Smile, color: "#8FE0BE" },
  { value: "biasa", label: "Biasa", Icon: Meh, color: "#A6D8FF" },
  { value: "sedih", label: "Sedih", Icon: Frown, color: "#C9A7F5" },
  { value: "lelah", label: "Lelah", Icon: BatteryLow, color: "#FFB3C8" },
]

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export default function MoodPage() {
  const [mounted, setMounted] = useState(false)
  const [cursor, setCursor] = useState(new Date())

  const { moodByDate, setMood } = useTaskStore()

  useEffect(() => setMounted(true), [])

  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()

    const list: (Date | null)[] = Array.from({ length: firstDay }, () => null)
    for (let d = 1; d <= totalDays; d++) list.push(new Date(year, month, d))
    return list
  }, [cursor])

  const monthStats = useMemo(() => {
    const prefix = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`
    const counts = new Map<MoodValue, number>()

    Object.entries(moodByDate).forEach(([k, v]) => {
      if (k.startsWith(prefix)) counts.set(v, (counts.get(v) ?? 0) + 1)
    })

    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0)
    return { counts, total }
  }, [moodByDate, cursor])

  if (!mounted) return null

  const today = todayKey()
  const current = moodByDate[today]

  const dominant = MOODS.reduce<{ mood: (typeof MOODS)[number] | null; n: number }>(
    (best, m) => {
      const n = monthStats.counts.get(m.value) ?? 0
      return n > best.n ? { mood: m, n } : best
    },
    { mood: null, n: 0 }
  )

  const shift = (n: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1))

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Mood Tracker
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
          Catat perasaanmu setiap hari
        </p>
      </motion.div>

      {/* Pilih mood hari ini */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
        style={{ ...card, background: "var(--tdp-primary-soft)" }}
      >
        <p
          className="text-lg"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Hari ini kamu merasa apa?
        </p>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {MOODS.map((m) => {
            const active = current === m.value
            return (
              <motion.button
                key={m.value}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMood(m.value)}
                className="flex flex-col items-center gap-2 rounded-3xl py-4 text-[11px]"
                style={{
                  background: active ? "var(--tdp-card)" : "rgba(255,255,255,0.45)",
                  border: active ? "2px solid var(--tdp-primary)" : "2px solid transparent",
                  color: "var(--tdp-text)",
                }}
              >
                <motion.span
                  animate={active ? { rotate: [0, -12, 12, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="flex size-11 items-center justify-center rounded-2xl"
                  style={{ background: m.color }}
                >
                  <m.Icon className="size-5" style={{ color: "var(--tdp-text)" }} />
                </motion.span>
                {m.label}
              </motion.button>
            )
          })}
        </div>

        <p className="mt-3 text-center text-[11px]" style={{ color: "var(--tdp-text)" }}>
          {current ? "Tersimpan — bisa diubah kapan saja" : "Belum diisi hari ini"}
        </p>
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Peta warna sebulan */}
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 lg:col-span-2"
          style={card}
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => shift(-1)}
              aria-label="Bulan sebelumnya"
              className="flex size-9 items-center justify-center rounded-full"
              style={{ background: "var(--tdp-bg)" }}
            >
              <ChevronLeft className="size-4" style={{ color: "var(--tdp-primary-ink)" }} />
            </motion.button>

            <p
              className="text-lg"
              style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
            >
              {BULAN[cursor.getMonth()]} {cursor.getFullYear()}
            </p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => shift(1)}
              aria-label="Bulan berikutnya"
              className="flex size-9 items-center justify-center rounded-full"
              style={{ background: "var(--tdp-bg)" }}
            >
              <ChevronRight className="size-4" style={{ color: "var(--tdp-primary-ink)" }} />
            </motion.button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
            {HARI.map((h) => (
              <p key={h} className="pb-1 text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                {h}
              </p>
            ))}

            {cells.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />

              const k = keyOf(d)
              const m = MOODS.find((x) => x.value === moodByDate[k])
              const isToday = k === today

              return (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.006 }}
                  whileHover={{ scale: 1.15 }}
                  title={m ? `${d.getDate()} — ${m.label}` : `${d.getDate()} — belum diisi`}
                  className="flex aspect-square items-center justify-center rounded-xl text-[11px]"
                  style={{
                    background: m ? m.color : "var(--tdp-bg)",
                    color: "var(--tdp-text)",
                    border: isToday ? "2px solid var(--tdp-primary)" : "2px solid transparent",
                  }}
                >
                  {d.getDate()}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {MOODS.map((m) => (
              <span key={m.value} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                <span className="size-3 rounded-full" style={{ background: m.color }} />
                {m.label}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Ringkasan bulan */}
        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5"
          style={card}
        >
          <p
            className="text-lg"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Ringkasan Bulan Ini
          </p>
          <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
            {monthStats.total} hari tercatat
          </p>

          {monthStats.total === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span
                className="flex size-14 items-center justify-center rounded-full"
                style={{ background: "var(--tdp-bg)" }}
              >
                <Sparkles className="size-6" style={{ color: "var(--tdp-primary)" }} />
              </span>
              <p className="text-sm" style={{ color: "var(--tdp-muted)" }}>
                Belum ada catatan mood bulan ini
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {MOODS.map((m) => {
                  const n = monthStats.counts.get(m.value) ?? 0
                  const pct = Math.round((n / monthStats.total) * 100)

                  return (
                    <div key={m.value}>
                      <div className="flex items-center gap-2 text-[11px]">
                        <m.Icon className="size-3.5" style={{ color: "var(--tdp-primary-ink)" }} />
                        <span style={{ color: "var(--tdp-text)" }}>{m.label}</span>
                        <span className="ml-auto" style={{ color: "var(--tdp-muted)" }}>
                          {n} hari
                        </span>
                      </div>

                      <div
                        className="mt-1 h-2 w-full overflow-hidden rounded-full"
                        style={{ background: "var(--tdp-bg)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: m.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ type: "spring", stiffness: 55 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {dominant.mood && (
                <div
                  className="mt-5 rounded-2xl p-4 text-center"
                  style={{ background: "var(--tdp-bg)" }}
                >
                  <span
                    className="mx-auto flex size-11 items-center justify-center rounded-2xl"
                    style={{ background: dominant.mood.color }}
                  >
                    <dominant.mood.Icon className="size-5" style={{ color: "var(--tdp-text)" }} />
                  </span>
                  <p className="mt-2 text-xs" style={{ color: "var(--tdp-muted)" }}>
                    Perasaan paling sering
                  </p>
                  <p
                    className="text-base"
                    style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
                  >
                    {dominant.mood.label}
                  </p>
                </div>
              )}
            </>
          )}
        </motion.section>
      </div>
    </div>
  )
}