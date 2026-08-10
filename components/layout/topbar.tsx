"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, UserRound } from "lucide-react"
import { useSettingsStore } from "@/store/settings-store"

export function Topbar() {
  const [mounted, setMounted] = useState(false)
  const name = useSettingsStore((s) => s.name)
  const [hijriah, setHijriah] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    try {
      const f = new Intl.DateTimeFormat("id-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      setHijriah(f.format(new Date()).replace("AH", "H"))
    } catch {
      setHijriah(null)
    }
  }, [])

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 md:px-6"
      style={{ background: "var(--tdp-card)", borderBottom: "1px solid var(--tdp-border)" }}
    >
      <span className="flex items-center gap-2 md:hidden">
        <span
          className="flex size-9 items-center justify-center rounded-2xl"
          style={{ background: "var(--tdp-primary)" }}
        >
          <Sparkles className="size-4 text-white" />
        </span>
        <span className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Rihlah
        </span>
      </span>

      <div className="hidden flex-1 md:block">
        <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {hijriah ? ` · ${hijriah}` : ""}
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.04 }}
        className="ml-auto flex items-center gap-2 rounded-full px-3 py-1.5"
        style={{ background: "var(--tdp-bg)" }}
      >
        <span
          className="flex size-7 items-center justify-center rounded-full"
          style={{ background: "var(--tdp-primary-soft)" }}
        >
          <UserRound className="size-4" style={{ color: "var(--tdp-primary-ink)" }} />
        </span>
        <span className="text-xs" style={{ color: "var(--tdp-text)" }}>
          {mounted ? name : ""}
        </span>
      </motion.div>
    </header>
  )
}