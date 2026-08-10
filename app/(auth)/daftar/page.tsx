"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Feather, Moon } from "lucide-react"
import { BunnyMascot } from "@/components/decor/mascot"
import { useSettingsStore } from "@/store/settings-store"

const SOROTAN = [
  { icon: BookOpen, judul: "Hafalan & murojaah", isi: "Catat ayat baru, lihat surah yang perlu diulang." },
  { icon: Moon, judul: "Amalan harian", isi: "Sholat, tilawah, wirid, lengkap dengan rentetan hari." },
  { icon: Feather, judul: "Journal semester", isi: "Winter dan Summer semester tersimpan rapi." },
]

export default function DaftarPage() {
  const router = useRouter()
  const setName = useSettingsStore((s) => s.setName)
  const [nama, setNama] = useState("")

  function mulai(e: React.FormEvent) {
    e.preventDefault()
    if (!nama.trim()) return
    setName(nama.trim())
    router.push("/beranda")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10" style={{ background: "var(--tdp-bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-md p-7"
        style={{
          background: "var(--tdp-card)",
          borderRadius: "var(--tdp-radius)",
          boxShadow: "var(--tdp-shadow-soft)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <BunnyMascot size={110} />
          <h1 className="mt-3 text-2xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Buat profil
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
            Cukup satu nama. Tanpa email, tanpa kata sandi.
          </p>
        </div>

        <form onSubmit={mulai} className="mt-6 space-y-3">
          <label className="block text-sm font-medium" style={{ color: "var(--tdp-text)" }}>
            Nama panggilan
          </label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Ukhti"
            className="w-full px-4 py-3 text-sm outline-none"
            style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
          />
          <button
            type="submit"
            disabled={!nama.trim()}
            className="w-full py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
            style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}
          >
            Mulai perjalanan
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {SOROTAN.map((s) => (
            <div
              key={s.judul}
              className="flex items-start gap-3 p-3"
              style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)" }}
            >
              <span
                className="grid size-9 shrink-0 place-items-center"
                style={{ background: "var(--tdp-card)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-primary-ink)" }}
              >
                <s.icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--tdp-text)" }}>
                  {s.judul}
                </p>
                <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
                  {s.isi}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
          Sudah pernah mengisi nama?{" "}
          <Link href="/masuk" style={{ color: "var(--tdp-primary-ink)", fontWeight: 600 }}>
            Masuk
          </Link>
        </p>
        <p className="mt-2 text-center text-xs" style={{ color: "var(--tdp-muted)" }}>
          Kota untuk jadwal sholat bisa diubah kapan saja di halaman Pengaturan.
        </p>
      </motion.div>
    </main>
  )
}