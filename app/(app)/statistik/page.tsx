"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Activity, CalendarCheck, Target, Zap } from "lucide-react"
import { daftarHari, hitungSkor } from "@/lib/skor"
import { ayatPadaTanggal, useHafalanStore } from "@/store/hafalan-store"
import { useAmalanStore } from "@/store/amalan-store"
import { useMuqorrorStore } from "@/store/muqorror-store"
import { useMufrodatStore } from "@/store/mufrodat-store"
import { useJournalStore } from "@/store/journal-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const R = 58
const KELILING = 2 * Math.PI * R

export default function StatistikPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { setoran, targetHarian } = useHafalanStore()
  const { amalan, log } = useAmalanStore()
  const { kitab } = useMuqorrorStore()
  const { kartu } = useMufrodatStore()
  const { entri } = useJournalStore()

  const skor = useMemo(
    () =>
      hitungSkor({
        setoran,
        targetHarian,
        logAmalan: log,
        jumlahAmalan: amalan.length,
        kitab,
        kartu,
        journal: entri,
        hariDinilai: 30,
      }),
    [setoran, targetHarian, log, amalan.length, kitab, kartu, entri]
  )

  const empatBelas = useMemo(() => daftarHari(14).reverse(), [])
  const puncak = Math.max(1, ...empatBelas.map((t) => ayatPadaTanggal(setoran, t)))

  const indeks = [
    { label: "Kerajinan", nilai: skor.kerajinan, Icon: CalendarCheck, warna: "var(--tdp-sky)",
      jelas: "Seberapa sering hadir mengisi, bukan seberapa banyak. Dihitung dari jumlah hari aktif dibagi 30 hari." },
    { label: "Ketepatan", nilai: skor.ketepatan, Icon: Target, warna: "var(--tdp-mint)",
      jelas: "Saat mengisi, seberapa penuh target harian dan ceklis amalan terpenuhi." },
    { label: "Keproduktivan", nilai: skor.keproduktivan, Icon: Zap, warna: "var(--tdp-lemon)",
      jelas: "Hasil nyata: ayat baru, halaman muqorror terbaca, dan kosakata yang sudah dikuasai." },
    { label: "Keaktifan", nilai: skor.keaktifan, Icon: Activity, warna: "var(--tdp-lilac)",
      jelas: "Merata memakai semua sisi aplikasi, bukan hanya satu halaman saja." },
  ]

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <section
        className="relative flex flex-col items-center gap-5 overflow-hidden p-5 md:flex-row"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-12 -top-12 size-44 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative shrink-0">
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={70} cy={70} r={R} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={12} />
            <motion.circle
              cx={70} cy={70} r={R} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round"
              strokeDasharray={KELILING}
              initial={{ strokeDashoffset: KELILING }}
              animate={{ strokeDashoffset: KELILING - (KELILING * skor.total) / 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              transform="rotate(-90 70 70)"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>{skor.total}%</span>
            <span className="text-[10px] text-white/80">{skor.predikat}</span>
          </div>
        </div>

        <div className="relative flex-1 text-center md:text-left">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Progres Diri</h1>
          <p className="text-sm text-white/85">
            {skor.hariAktif} hari aktif dari {skor.hariDinilai} hari terakhir
          </p>
          <p className="mt-2 inline-block rounded-full bg-white/25 px-3 py-1 text-xs text-white backdrop-blur">
            Predikat {skor.predikat}
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {indeks.map((x, i) => (
          <motion.div key={x.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="p-4" style={card}>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-2xl" style={{ background: x.warna }}>
                <x.Icon className="size-4" style={{ color: "#fff" }} />
              </span>

              <p className="flex-1 text-sm" style={{ color: "var(--tdp-text)" }}>{x.label}</p>

              <p className="text-2xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
                {x.nilai}%
              </p>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full" style={{ background: "var(--tdp-bg)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${x.nilai}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full" style={{ background: x.warna }} />
            </div>

            <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "var(--tdp-muted)" }}>{x.jelas}</p>
          </motion.div>
        ))}
      </section>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Ayat per hari, empat belas hari terakhir
        </h2>

        <div className="flex h-40 items-end gap-1.5">
          {empatBelas.map((t) => {
            const jumlah = ayatPadaTanggal(setoran, t)
            const tinggi = Math.round((jumlah / puncak) * 100)

            return (
              <div key={t} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px]" style={{ color: "var(--tdp-muted)" }}>{jumlah > 0 ? jumlah : ""}</span>

                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(tinggi, 2)}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full rounded-t-lg"
                  style={{ background: jumlah >= targetHarian ? "var(--tdp-primary)" : "var(--tdp-primary-soft)" }} />

                <span className="text-[8px]" style={{ color: "var(--tdp-muted)" }}>
                  {new Date(t).getDate()}
                </span>
              </div>
            )
          })}
        </div>

        <p className="mt-2 text-[11px]" style={{ color: "var(--tdp-muted)" }}>
          Batang penuh berarti target {targetHarian} ayat tercapai pada hari itu.
        </p>
      </section>

      <section className="p-4" style={{ ...card, background: "var(--tdp-mint-soft)" }}>
        <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Cara membaca predikat
        </h2>

        <ul className="flex flex-col gap-1 text-xs" style={{ color: "var(--tdp-text)" }}>
          <li>85% ke atas — Mumtaz</li>
          <li>75% sampai 84% — Jayyid Jiddan</li>
          <li>65% sampai 74% — Jayyid</li>
          <li>50% sampai 64% — Maqbul</li>
          <li>di bawah 50% — Bidayah, masih permulaan</li>
        </ul>
      </section>
    </div>
  )
}