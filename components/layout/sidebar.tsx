"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  BarChart3, CalendarDays, Crown, Gift, Home, ListTodo,
  NotebookPen, Settings, Smile, Sun,
} from "lucide-react"
import { NAV } from "@/config/nav"
import { BunnyMascot } from "@/components/decor/mascot"

const ICONS = {
  home: Home,
  sun: Sun,
  calendar: CalendarDays,
  list: ListTodo,
  notebook: NotebookPen,
  smile: Smile,
  chart: BarChart3,
  gift: Gift,
  settings: Settings,
} as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden w-64 shrink-0 flex-col gap-6 p-5 md:flex"
      style={{ background: "var(--tdp-sidebar)", borderRight: "1px solid var(--tdp-border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Crown className="size-5 text-white" />
        </motion.span>
        <div>
          <p
            className="text-lg leading-tight"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            To-Do Princess
          </p>
          <p className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>
            Buat harimu lebih produktif
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS]
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-colors"
              style={{ color: active ? "#fff" : "var(--tdp-text)" }}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "var(--tdp-primary)", boxShadow: "var(--tdp-shadow)" }}
                />
              )}
              <Icon className="relative z-10 size-4.5" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Kartu penyemangat */}
      <div
        className="mt-auto rounded-3xl p-4 pt-2 text-center"
        style={{ background: "var(--tdp-card)", boxShadow: "var(--tdp-shadow)" }}
      >
        <div className="flex justify-center">
          <BunnyMascot size={84} />
        </div>
        <p
          className="mt-1 text-xs"
          style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
        >
          You can do it, girl!
        </p>
      </div>
    </aside>
  )
}