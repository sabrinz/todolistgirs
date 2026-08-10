"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Home, Library, Moon, Repeat } from "lucide-react"

const ITEMS = [
  { label: "Beranda", href: "/beranda", Icon: Home },
  { label: "Hafalan", href: "/hafalan", Icon: BookOpen },
  { label: "Murojaah", href: "/murojaah", Icon: Repeat },
  { label: "Muqorror", href: "/muqorror", Icon: Library },
  { label: "Amalan", href: "/amalan", Icon: Moon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 md:hidden"
      style={{
        background: "var(--tdp-card)",
        borderTop: "1px solid var(--tdp-border)",
        boxShadow: "0 -6px 20px rgba(255,111,165,0.10)",
      }}
    >
      {ITEMS.map((it) => {
        const active = pathname === it.href

        return (
          <Link
            key={it.href}
            href={it.href}
            className="relative flex flex-1 flex-col items-center gap-1 py-1 text-[10px]"
            style={{ color: active ? "var(--tdp-primary-ink)" : "var(--tdp-muted)" }}
          >
            {active && (
              <motion.span
                layoutId="bottom-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute -top-1 h-1 w-8 rounded-full"
                style={{ background: "var(--tdp-primary)" }}
              />
            )}
            <it.Icon className="size-5" />
            {it.label}
          </Link>
        )
      })}
    </nav>
  )
}