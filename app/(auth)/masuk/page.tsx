"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BunnyMascot } from "@/components/decor/mascot"
import { useSettingsStore } from "@/store/settings-store"

const kolom = {
  background: "var(--tdp-bg)",
  borderRadius: "var(--tdp-radius-sm)",
  color: "var(--tdp-text)",
}

export default function MasukPage() {
  const router = useRouter()
  const setName = useSettingsStore((s) => s.setName)
  const [nama, setNama] = useState("")

  function lanjut(e: React.FormEvent) {
    e.preventDefault()
    if (nama.trim()) setName(nama)
    router.push("/beranda")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10" style={{ background: "var(--tdp-bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-sm p-7"
        style={{
          background: "var(--tdp-card)",
          borderRadius: "var(--tdp-radius)",
          boxShadow: "var(--tdp-shadow-soft)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <BunnyMascot size={110} />
          <h1 className="mt-3 text-2xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Ahlan wa sahlan
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
            Masuk untuk melanjutkan perjalananmu.
          </p>
        </div>

        <form onSubmit={lanjut} className="mt-6 space-y-3">
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
            className="w-full py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
            style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}
          >
            Masuk
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed" style={{ color: "var(--tdp-muted)" }}>
          Rihlah tidak memakai kata sandi. Semua hafalan, jurnal, dan catatan tersimpan di perangkat ini saja.
        </p>
        <p className="mt-3 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
          Baru pertama di sini?{" "}
          <Link href="/daftar" style={{ color: "var(--tdp-primary-ink)", fontWeight: 600 }}>
            Buat profil
          </Link>
        </p>
      </motion.div>
    </main>
  )
}