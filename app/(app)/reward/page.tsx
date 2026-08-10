"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Award, Crown, Flame, Heart, Lock, Medal, Sparkles, Star, Sunrise, Trophy, Zap,
} from "lucide-react"
import { useTaskStore } from "@/store/task-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

export default function RewardPage() {
  const [mounted, setMounted] = useState(false)
  const { tasks, points, streak, moodByDate } = useTaskStore()
  const prevUnlocked = useRef<number | null>(null)

  useEffect(() => setMounted(true), [])

  const done = tasks.filter((t) => t.done).length
  const moodCount = Object.keys(moodByDate).length

  const badges = useMemo(
    () => [
      { id: "first", name: "Langkah Pertama", desc: "Selesaikan 1 tugas", Icon: Sparkles, now: done, target: 1 },
      { id: "five", name: "Rajin Banget", desc: "Selesaikan 5 tugas", Icon: Star, now: done, target: 5 },
      { id: "ten", name: "Produktif", desc: "Selesaikan 10 tugas", Icon: Medal, now: done, target: 10 },
      { id: "twentyfive", name: "Tak Terhentikan", desc: "Selesaikan 25 tugas", Icon: Zap, now: done, target: 25 },
      { id: "streak3", name: "Konsisten", desc: "Streak 3 hari", Icon: Flame, now: streak, target: 3 },
      { id: "streak7", name: "Seminggu Penuh", desc: "Streak 7 hari", Icon: Sunrise, now: streak, target: 7 },
      { id: "mood", name: "Kenali Diri", desc: "Isi mood 3 hari", Icon: Heart, now: moodCount, target: 3 },
      { id: "points", name: "Sang Putri", desc: "Kumpulkan 200 poin", Icon: Crown, now: points, target: 200 },
    ],
    [done, streak, moodCount, points]
  )

  const unlocked = badges.filter((b) => b.now >= b.target).length

  // Confetti saat ada lencana baru terbuka
  useEffect(() => {
    if (!mounted) return
    if (prevUnlocked.current !== null && unlocked > prevUnlocked.current) {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#FF6FA5", "#FFC2DA", "#C9A7F5", "#FFE08A", "#8FE0BE"],
      })
    }
    prevUnlocked.current = unlocked
  }, [unlocked, mounted])

  if (!mounted) return null

  const level = Math.floor(points / 100) + 1
  const inLevel = points % 100

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Reward & Achievement
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
          {unlocked} dari {badges.length} lencana sudah terbuka
        </p>
      </motion.div>

      {/* Kartu level */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
        style={{ ...card, background: "var(--tdp-primary-soft)" }}
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex size-16 shrink-0 items-center justify-center rounded-3xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Trophy className="size-8 text-white" />
        </motion.span>

        <div className="flex-1">
          <p
            className="text-2xl leading-tight"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Level {level}
          </p>
          <p className="text-xs" style={{ color: "var(--tdp-text)" }}>
            {points} poin • {100 - inLevel} poin lagi menuju Level {level + 1}
          </p>

          <div
            className="mt-3 h-3 w-full overflow-hidden rounded-full"
            style={{ background: "var(--tdp-card)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--tdp-primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${inLevel}%` }}
              transition={{ type: "spring", stiffness: 55 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Lencana */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5"
        style={card}
      >
        <p
          className="text-lg"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Koleksi Lencana
        </p>
        <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
          Terbuka otomatis saat target tercapai
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((b, i) => {
            const open = b.now >= b.target
            const pct = Math.min(100, Math.round((b.now / b.target) * 100))

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center rounded-3xl p-4 text-center"
                style={{
                  background: open ? "var(--tdp-primary-soft)" : "var(--tdp-bg)",
                  border: open ? "2px solid var(--tdp-primary)" : "2px solid transparent",
                  opacity: open ? 1 : 0.75,
                }}
              >
                <motion.span
                  animate={open ? { y: [0, -4, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
                  className="flex size-12 items-center justify-center rounded-2xl"
                  style={{ background: open ? "var(--tdp-primary)" : "var(--tdp-card)" }}
                >
                  {open ? (
                    <b.Icon className="size-6 text-white" />
                  ) : (
                    <Lock className="size-5" style={{ color: "var(--tdp-muted)" }} />
                  )}
                </motion.span>

                <p
                  className="mt-2.5 text-sm leading-tight"
                  style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
                >
                  {b.name}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                  {b.desc}
                </p>

                {!open && (
                  <>
                    <div
                      className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full"
                      style={{ background: "var(--tdp-card)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--tdp-primary)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                      {b.now} / {b.target}
                    </p>
                  </>
                )}

                {open && (
                  <span
                    className="mt-2 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px]"
                    style={{ background: "var(--tdp-card)", color: "var(--tdp-primary-ink)" }}
                  >
                    <Award className="size-3" />
                    Terbuka
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}