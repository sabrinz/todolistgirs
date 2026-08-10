"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  BarChart3, BookOpen, CalendarDays, Clock, Feather, Home, Languages,
  Library, Moon, NotebookPen, Repeat, Settings, Smile, Sparkles,
} from "lucide-react"
import { NAV } from "@/config/nav"
import { BunnyMascot } from "@/components/decor/mascot"

const ICONS = {
  home: Home, book: BookOpen, repeat: Repeat, library: Library,
  languages: Languages, moon: Moon, clock: Clock, calendar: CalendarDays,
  feather: Feather, notebook: NotebookPen, smile: Smile,
  chart: BarChart3, settings: Settings,
} as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto p-4 md:flex"
      style={{ background: "var(--tdp-sidebar)", borderRight: "1px solid var(--tdp-border)" }}
    >
      <div className="flex items-center gap-2.5">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Sparkles className="size-5 text-white" />
        </motion.span>

        <div className="min-w-0">
          <p className="text-lg leading-tight" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Rihlah
          </p>
          <p className="truncate text-[10px]" style={{ color: "var(--tdp-muted)" }}>
            Teman menuntut ilmu
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
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
              {Icon && <Icon className="relative z-10 size-4 shrink-0" />}
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div
        className="mt-auto shrink-0 rounded-3xl p-3 pt-1 text-center"
        style={{ background: "var(--tdp-card)", boxShadow: "var(--tdp-shadow-soft)" }}
      >
        <div className="flex justify-center">
          <BunnyMascot size={70} />
        </div>
        <p className="text-[11px]" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Semoga Allah mudahkan
        </p>
        <p className="text-[9px]" style={{ color: "var(--tdp-muted)" }}>
          Sedikit tapi terus-menerus
        </p>
      </div>
    </aside>
  )
}