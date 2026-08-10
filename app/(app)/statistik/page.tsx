"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts"
import { CalendarCheck, Flame, Target, TrendingUp } from "lucide-react"
import { useTaskStore } from "@/store/task-store"

const CATEGORY_COLORS: Record<string, string> = {
  Sekolah: "#A6D8FF",
  Belajar: "#FFE08A",
  Kesehatan: "#8FE0BE",
  "Self Care": "#C9A7F5",
  Hobi: "#FFC2DA",
}

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

export default function StatistikPage() {
  const [mounted, setMounted] = useState(false)
  const { tasks, points, streak } = useTaskStore()

  useEffect(() => setMounted(true), [])

  // Grafik 7 hari terakhir — dihitung dari waktu tugas diselesaikan
  const weekly = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const key = d.toISOString().slice(0, 10)

      return {
        hari: HARI[d.getDay()],
        selesai: tasks.filter((t) => t.completedAt?.slice(0, 10) === key).length,
      }
    })
  }, [tasks])

  // Donat — pembagian tugas per kategori
  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    tasks.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + 1))
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [tasks])

  if (!mounted) return null

  const done = tasks.filter((t) => t.done).length
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0
  const weekTotal = weekly.reduce((a, b) => a + b.selesai, 0)

  const stats = [
    { label: "Tugas Selesai", value: done, Icon: CalendarCheck },
    { label: "Minggu Ini", value: weekTotal, Icon: TrendingUp },
    { label: "Streak", value: `${streak} hari`, Icon: Flame },
    { label: "Poin", value: points, Icon: Target },
  ]

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          Statistik & Progress
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
          Lihat perkembangan kamu minggu ini
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
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
              <span
                className="flex size-8 items-center justify-center rounded-full"
                style={{ background: "var(--tdp-bg)" }}
              >
                <s.Icon className="size-4" style={{ color: "var(--tdp-primary)" }} />
              </span>
            </div>
            <p
              className="mt-2 text-3xl leading-none"
              style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
            >
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Grafik mingguan */}
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 lg:col-span-2"
          style={card}
        >
          <p
            className="text-lg"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Progress Mingguan
          </p>
          <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
            Jumlah tugas yang kamu selesaikan tiap hari
          </p>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6FA5" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#FF6FA5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hari"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#A98A97", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#A98A97", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: "#FFC2DA", strokeWidth: 2 }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--tdp-border)",
                    background: "var(--tdp-card)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="selesai"
                  stroke="#FF6FA5"
                  strokeWidth={3}
                  fill="url(#pinkFill)"
                  dot={{ r: 5, fill: "#FF6FA5", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Donat kategori */}
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
            Per Kategori
          </p>

          {byCategory.length === 0 ? (
            <p className="py-16 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
              Belum ada data. Tambah tugas dulu ya!
            </p>
          ) : (
            <>
              <div className="relative mt-2 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      stroke="none"
                      animationDuration={900}
                    >
                      {byCategory.map((c) => (
                        <Cell key={c.name} fill={CATEGORY_COLORS[c.name] ?? "#FFC2DA"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid var(--tdp-border)",
                        background: "var(--tdp-card)",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p
                    className="text-2xl leading-none"
                    style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
                  >
                    {progress}%
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                    selesai
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {byCategory.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="size-3 rounded-full"
                      style={{ background: CATEGORY_COLORS[c.name] ?? "#FFC2DA" }}
                    />
                    <span style={{ color: "var(--tdp-text)" }}>{c.name}</span>
                    <span className="ml-auto" style={{ color: "var(--tdp-muted)" }}>
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.section>
      </div>
    </div>
  )
}