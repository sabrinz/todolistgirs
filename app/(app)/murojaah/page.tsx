"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Repeat, Trash2 } from "lucide-react"
import { cariSurah } from "@/lib/quran"
import {
  ayatUnikPerSurah, kunciHari, useHafalanStore,
} from "@/store/hafalan-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

type Saring = "semua" | "perlu" | "aman"

export default function MurojaahPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { setoran, tambahSetoran, hapusSetoran } = useHafalanStore()
  const [saring, setSaring] = useState<Saring>("semua")

  const daftar = useMemo(() => {
    const peta = ayatUnikPerSurah(setoran)
    const terakhir = new Map<string, string>()

    for (const s of setoran) {
      const kunci = String(s.surah)
      const ada = terakhir.get(kunci)
      if (!ada || s.tanggal > ada) terakhir.set(kunci, s.tanggal)
    }

    const sekarang = new Date()
    sekarang.setHours(0, 0, 0, 0)

    return [...peta.entries()]
      .map(([n, kumpulan]) => {
        const ayat = [...kumpulan].sort((a, b) => a - b)
        const tgl = terakhir.get(String(n))!
        const selisih = Math.round((sekarang.getTime() - new Date(tgl + "T00:00:00").getTime()) / 86400000)

        return {
          nomor: n,
          nama: cariSurah(n)?.nama ?? "",
          jumlah: kumpulan.size,
          dari: ayat[0],
          sampai: ayat[ayat.length - 1],
          terakhir: tgl,
          selisih,
        }
      })
      .sort((a, b) => b.selisih - a.selisih)
  }, [setoran])

  const perlu = daftar.filter((d) => d.selisih >= 7)
  const tampil = saring === "semua" ? daftar : saring === "perlu" ? perlu : daftar.filter((d) => d.selisih < 7)

  const mingguIni = useMemo(() => {
    const batas = new Date()
    batas.setDate(batas.getDate() - 6)
    const kunci = kunciHari(batas)
    return setoran.filter((s) => s.tipe === "murojaah" && s.tanggal >= kunci).length
  }, [setoran])

  const riwayat = useMemo(
    () => setoran.filter((s) => s.tipe === "murojaah").slice(0, 20),
    [setoran]
  )

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <section
        className="relative overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Murojaah</h1>
          <p className="text-sm text-white/85">
            {daftar.length} surah dihafal · {perlu.length} perlu diulang · {mingguIni} murojaah pekan ini
          </p>
        </div>
      </section>

      <div className="flex gap-2">
        {([
          ["semua", `Semua (${daftar.length})`],
          ["perlu", `Perlu diulang (${perlu.length})`],
          ["aman", `Masih segar (${daftar.length - perlu.length})`],
        ] as Array<[Saring, string]>).map(([id, label]) => (
          <button
            key={id} onClick={() => setSaring(id)}
            className="rounded-full px-4 py-2 text-xs"
            style={{
              background: saring === id ? "var(--tdp-primary)" : "var(--tdp-card)",
              color: saring === id ? "#fff" : "var(--tdp-muted)",
              boxShadow: "var(--tdp-shadow-soft)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tampil.length === 0 ? (
        <div className="p-10 text-center text-sm" style={{ ...card, color: "var(--tdp-muted)" }}>
          Belum ada hafalan untuk dimurojaah. Mulai dulu dari halaman Hafalan.
        </div>
      ) : (
        <section className="grid gap-2 sm:grid-cols-2">
          {tampil.map((d) => {
            const merah = d.selisih >= 14
            const kuning = d.selisih >= 7 && d.selisih < 14

            return (
              <motion.div
                key={d.nomor} layout className="p-4"
                style={{
                  ...card,
                  background: merah ? "#FFEFEF" : kuning ? "var(--tdp-lemon-soft)" : "var(--tdp-mint-soft)",
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>
                      {d.nomor}. {d.nama}
                    </p>
                    <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
                      {d.jumlah} ayat · ayat {d.dari}–{d.sampai}
                    </p>
                  </div>

                  {d.selisih >= 7 ? (
                    <AlertCircle className="size-4 shrink-0" style={{ color: "var(--tdp-primary-ink)" }} />
                  ) : (
                    <CheckCircle2 className="size-4 shrink-0" style={{ color: "var(--tdp-mint)" }} />
                  )}
                </div>

                <p className="mt-2 text-xs" style={{ color: "var(--tdp-text)" }}>
                  {d.selisih === 0 ? "Diulang hari ini" : `Terakhir ${d.selisih} hari lalu`}
                </p>

                <button
                  onClick={() =>
                    tambahSetoran({ surah: d.nomor, dari: d.dari, sampai: d.sampai, tipe: "murojaah" })
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 py-2.5 text-xs text-white transition-transform active:scale-[0.98]"
                  style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}
                >
                  <Repeat className="size-3.5" /> Catat sudah diulang
                </button>
              </motion.div>
            )
          })}
        </section>
      )}

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Riwayat murojaah
        </h2>

        {riwayat.length === 0 ? (
          <p className="py-6 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>Belum ada.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {riwayat.map((s) => (
              <li
                key={s.id} className="flex items-center gap-3 p-3"
                style={{ background: "var(--tdp-lilac-soft)", borderRadius: "var(--tdp-radius-sm)" }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm" style={{ color: "var(--tdp-text)" }}>
                    {cariSurah(s.surah)?.nama} · ayat {s.dari}–{s.sampai}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                    {new Date(s.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                  </p>
                </div>

                <button onClick={() => hapusSetoran(s.id)} aria-label="Hapus">
                  <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}