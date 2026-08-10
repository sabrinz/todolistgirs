"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarDays, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useTaskStore } from "@/store/task-store"

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

const CATEGORY_COLORS: Record<string, string> = {
  Sekolah: "var(--tdp-sky)",
  Belajar: "var(--tdp-lemon)",
  Kesehatan: "var(--tdp-mint)",
  "Self Care": "var(--tdp-lilac)",
  Hobi: "var(--tdp-primary-soft)",
}

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export default function KalenderPage() {
  const [mounted, setMounted] = useState(false)
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(keyOf(new Date()))

  const { tasks } = useTaskStore()

  useEffect(() => setMounted(true), [])

  // Kelompokkan tugas berdasarkan tanggal dibuat
  const byDate = useMemo(() => {
    const map = new Map<string, typeof tasks>()
    tasks.forEach((t) => {
      const k = t.createdAt.slice(0, 10)
      map.set(k, [...(map.get(k) ?? []), t])
    })
    return map
  }, [tasks])

  // Susun kotak-kotak tanggal untuk satu bulan
  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()

    const list: (Date | null)[] = Array.from({ length: firstDay }, () => null)
    for (let d = 1; d <= totalDays; d++) list.push(new Date(year, month, d))
    return list
  }, [cursor])

  if (!mounted) return null

  const todayKey = keyOf(new Date())
  const selectedTasks = byDate.get(selected) ?? []

  const shift = (n: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1))

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Kalender
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
          Klik tanggal untuk melihat tugas hari itu
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Kalender */}
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

          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {HARI.map((h) => (
              <p key={h} className="pb-2 text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                {h}
              </p>
            ))}

            {cells.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />

              const k = keyOf(d)
              const items = byDate.get(k) ?? []
              const isToday = k === todayKey
              const isSelected = k === selected

              return (
                <motion.button
                  key={k}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSelected(k)}
                  className="relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm"
                  style={{
                    background: isSelected ? "var(--tdp-primary)" : "var(--tdp-bg)",
                    color: isSelected ? "#fff" : "var(--tdp-text)",
                    border: isToday && !isSelected ? "2px solid var(--tdp-primary)" : "2px solid transparent",
                  }}
                >
                  {d.getDate()}

                  {items.length > 0 && (
                    <span className="absolute bottom-1.5 flex gap-0.5">
                      {items.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className="size-1.5 rounded-full"
                          style={{
                            background: isSelected ? "#fff" : CATEGORY_COLORS[t.category],
                          }}
                        />
                      ))}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        {/* Daftar tugas tanggal terpilih */}
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
            {selected === todayKey ? "Hari Ini" : "Tugas Tanggal Ini"}
          </p>
          <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
            {selectedTasks.length} tugas
          </p>

          <ul className="mt-4 space-y-2">
            <AnimatePresence mode="popLayout">
              {selectedTasks.map((t) => (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2.5"
                  style={{ background: "var(--tdp-bg)" }}
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: t.done ? "var(--tdp-primary)" : "transparent",
                      border: "2px solid var(--tdp-primary)",
                    }}
                  >
                    {t.done && <Check className="size-3 text-white" />}
                  </span>

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
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                    style={{ background: CATEGORY_COLORS[t.category], color: "var(--tdp-text)" }}
                  >
                    {t.category}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {selectedTasks.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span
                className="flex size-14 items-center justify-center rounded-full"
                style={{ background: "var(--tdp-bg)" }}
              >
                <CalendarDays className="size-6" style={{ color: "var(--tdp-primary)" }} />
              </span>
              <p className="text-sm" style={{ color: "var(--tdp-muted)" }}>
                Tidak ada tugas di tanggal ini
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}