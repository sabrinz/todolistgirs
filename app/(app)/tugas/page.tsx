"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Check, Inbox, Search, Trash2 } from "lucide-react"
import { useTaskStore, type Category } from "@/store/task-store"

const CATEGORY_COLORS: Record<string, string> = {
  Sekolah: "var(--tdp-sky)",
  Belajar: "var(--tdp-lemon)",
  Kesehatan: "var(--tdp-mint)",
  "Self Care": "var(--tdp-lilac)",
  Hobi: "var(--tdp-primary-soft)",
}

const CATEGORIES: Category[] = ["Sekolah", "Belajar", "Kesehatan", "Self Care", "Hobi"]
const STATUS = ["Semua", "Belum", "Selesai"] as const
const SORTS = ["Terbaru", "Terlama", "A-Z"] as const

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

export default function TugasPage() {
  const [mounted, setMounted] = useState(false)
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Semua")
  const [kategori, setKategori] = useState<"Semua" | Category>("Semua")
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Terbaru")

  const { tasks, toggleTask, removeTask } = useTaskStore()

  useEffect(() => setMounted(true), [])

  const visible = useMemo(() => {
    let list = [...tasks]

    if (q.trim()) {
      const needle = q.toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(needle))
    }
    if (status === "Belum") list = list.filter((t) => !t.done)
    if (status === "Selesai") list = list.filter((t) => t.done)
    if (kategori !== "Semua") list = list.filter((t) => t.category === kategori)

    if (sort === "Terbaru") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sort === "Terlama") list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    if (sort === "A-Z") list.sort((a, b) => a.title.localeCompare(b.title))

    return list
  }, [tasks, q, status, kategori, sort])

  if (!mounted) return null

  const handleToggle = (id: string) => {
    if (toggleTask(id)) {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#FF6FA5", "#FFC2DA", "#C9A7F5", "#FFE08A"],
      })
    }
  }

  const chip = (active: boolean) =>
    active
      ? { background: "var(--tdp-primary)", color: "#fff" }
      : { background: "var(--tdp-bg)", color: "var(--tdp-muted)" }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Tugas Saya
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
          {tasks.filter((t) => !t.done).length} tugas belum selesai dari {tasks.length} total
        </p>
      </motion.div>

      {/* Pencarian & saringan */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 p-5"
        style={card}
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2.5"
          style={{ background: "var(--tdp-bg)" }}
        >
          <Search className="size-4" style={{ color: "var(--tdp-muted)" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari tugas..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--tdp-text)" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="rounded-full px-3.5 py-1.5 text-xs transition-colors"
              style={chip(status === s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["Semua", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setKategori(c)}
              className="rounded-full px-3 py-1.5 text-[11px] transition-colors"
              style={
                kategori === c
                  ? { background: "var(--tdp-primary)", color: "#fff" }
                  : {
                      background: c === "Semua" ? "var(--tdp-bg)" : CATEGORY_COLORS[c],
                      color: "var(--tdp-text)",
                    }
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>
            Urutkan:
          </span>
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="rounded-full px-3 py-1 text-[11px] transition-colors"
              style={chip(sort === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Daftar tugas */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5"
        style={card}
      >
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {visible.map((t) => (
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

                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm"
                    style={{
                      color: "var(--tdp-text)",
                      textDecoration: t.done ? "line-through" : "none",
                      opacity: t.done ? 0.5 : 1,
                    }}
                  >
                    {t.title}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                    {new Date(t.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                    {t.time ? ` • ${t.time}` : ""}
                  </p>
                </div>

                <span
                  className="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] sm:block"
                  style={{ background: CATEGORY_COLORS[t.category], color: "var(--tdp-text)" }}
                >
                  {t.category}
                </span>

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

        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <span
              className="flex size-14 items-center justify-center rounded-full"
              style={{ background: "var(--tdp-bg)" }}
            >
              <Inbox className="size-6" style={{ color: "var(--tdp-primary)" }} />
            </span>
            <p className="text-sm" style={{ color: "var(--tdp-muted)" }}>
              {tasks.length === 0
                ? "Belum ada tugas sama sekali. Tambah dari Beranda ya!"
                : "Tidak ada tugas yang cocok dengan pencarianmu"}
            </p>
          </div>
        )}
      </motion.section>
    </div>
  )
}