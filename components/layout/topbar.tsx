"use client"

import { motion } from "framer-motion"
import { Bell, Crown, Search, UserRound } from "lucide-react"
import { useSettingsStore } from "@/store/settings-store"

export function Topbar() {
  const name = useSettingsStore((s) => s.name)

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 backdrop-blur md:px-6"
      style={{ background: "var(--tdp-card)", borderBottom: "1px solid var(--tdp-border)" }}
    >
      <div className="flex items-center gap-2 md:hidden">
        <span
          className="flex size-8 items-center justify-center rounded-xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Crown className="size-4 text-white" />
        </span>
        <p style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          To-Do Princess
        </p>
      </div>

      <div
        className="hidden w-80 items-center gap-2 rounded-full px-4 py-2 md:flex"
        style={{ background: "var(--tdp-bg)" }}
      >
        <Search className="size-4" style={{ color: "var(--tdp-muted)" }} />
        <input
          placeholder="Cari tugas..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--tdp-text)" }}
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} className="relative" aria-label="Notifikasi">
          <Bell className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -right-1 -top-1 size-2.5 rounded-full"
            style={{ background: "var(--tdp-primary)" }}
          />
        </motion.button>

        <div
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
          style={{ background: "var(--tdp-bg)" }}
        >
          <span
            className="flex size-8 items-center justify-center rounded-full"
            style={{ background: "var(--tdp-primary-soft)" }}
          >
            <UserRound className="size-4" style={{ color: "var(--tdp-primary-ink)" }} />
          </span>
          <span className="hidden text-xs sm:block" style={{ color: "var(--tdp-text)" }}>
            {name}
          </span>
        </div>
      </div>
    </header>
  )
}