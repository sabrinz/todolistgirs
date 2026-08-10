"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ListTodo, Plus, Smile, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const LEFT = [
  { label: "Beranda", href: "/beranda", Icon: Home },
  { label: "Tugas", href: "/tugas", Icon: ListTodo },
]

const RIGHT = [
  { label: "Mood", href: "/mood", Icon: Smile },
  { label: "Statistik", href: "/statistik", Icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  const item = (i: { label: string; href: string; Icon: typeof Home }) => {
    const active = pathname === i.href || pathname.startsWith(i.href + "/")
    return (
      <Link
        key={i.href}
        href={i.href}
        className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px]"
        style={{ color: active ? "var(--primary-ink)" : "var(--muted)" }}
      >
        <i.Icon className={cn("size-5", active && "scale-110")} />
        {i.label}
      </Link>
    )
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-end border-t px-2 pb-1 md:hidden"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      {LEFT.map(item)}

      <Link
        href="/tugas"
        aria-label="Tambah tugas"
        className="mx-1 -mt-6 flex size-14 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: "var(--primary)", boxShadow: "var(--shadow-soft)" }}
      >
        <Plus className="size-7" />
      </Link>

      {RIGHT.map(item)}
    </nav>
  )
}