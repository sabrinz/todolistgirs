"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cariSurah } from "@/lib/quran"
import { kunciHari, useHafalanStore } from "@/store/hafalan-store"
import { useAmalanStore } from "@/store/amalan-store"
import { useJournalStore } from "@/store/journal-store"
import { useMoodStore } from "@/store/mood-store"
import { HARI_PANJANG, kuliahHari, useJadwalStore } from "@/store/jadwal-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const SINGKAT = ["Ah", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"]

function hijriahDari(d: Date) {
  try {
    return new Intl.DateTimeFormat("id-TN-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric",
    }).format(d).replace("AH", "H")
  } catch {
    return null
  }
}

function hijriahTanggal(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day: "numeric" }).format(d)
  } catch {
    return ""
  }
}

export default function KalenderPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { setoran } = useHafalanStore()
  const { amalan, log } = useAmalanStore()
  const { entri } = useJournalStore()
  const { moodByDate } = useMoodStore()
  const { kuliah } = useJadwalStore()

  const [acuan, setAcuan] = useState(new Date())
  const [dipilih, setDipilih] = useState(kunciHari())

  const sel = useMemo(() => {
    const awal = new Date(acuan.getFullYear(), acuan.getMonth(), 1)
    const jumlahHari = new Date(acuan.getFullYear(), acuan.getMonth() + 1, 0).getDate()
    const kosong = awal.getDay()

    const hasil: Array<Date | null> = Array.from({ length: kosong }, () => null)
    for (let i = 1; i <= jumlahHari; i++) hasil.push(new Date(acuan.getFullYear(), acuan.getMonth(), i))

    return hasil
  }, [acuan])

  const detail = useMemo(() => {
    const tanggal = new Date(dipilih + "T00:00:00")

    return {
      tanggal,
      setoran: setoran.filter((s) => s.tanggal === dipilih),
      amalanDicentang: log[dipilih] ?? [],
      journal: entri.filter((e) => e.tanggal === dipilih),
      mood: moodByDate[dipilih],
      kuliah: kuliahHari(kuliah, tanggal.getDay()),
    }
  }, [dipilih, setoran, log, entri, moodByDate, kuliah])

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <section
        className="relative overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative flex items-center gap-3">
          <button onClick={() => setAcuan(new Date(acuan.getFullYear(), acuan.getMonth() - 1, 1))}
            className="flex size-9 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur"
            aria-label="Bulan sebelumnya">
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>
              {acuan.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </h1>
            <p className="text-xs text-white/80">{hijriahDari(acuan) ?? ""}</p>
          </div>

          <button onClick={() => setAcuan(new Date(acuan.getFullYear(), acuan.getMonth() + 1, 1))}
            className="flex size-9 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur"
            aria-label="Bulan berikutnya">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      <section className="p-4" style={card}>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px]" style={{ color: "var(--tdp-muted)" }}>
          {SINGKAT.map((s) => <span key={s}>{s}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {sel.map((d, i) => {
            if (!d) return <span key={`kosong-${i}`} />

            const kunci = kunciHari(d)
            const iniHariIni = kunci === kunciHari()
            const aktif = kunci === dipilih

            const adaSetoran = setoran.some((s) => s.tanggal === kunci)
            const adaAmalan = (log[kunci]?.length ?? 0) > 0
            const adaJournal = entri.some((e) => e.tanggal === kunci)

            return (
              <motion.button key={kunci} whileTap={{ scale: 0.92 }} onClick={() => setDipilih(kunci)}
                className="flex aspect-square flex-col items-center justify-center gap-0.5"
                style={{
                  background: aktif ? "var(--tdp-primary)" : iniHariIni ? "var(--tdp-primary-soft)" : "var(--tdp-bg)",
                  color: aktif ? "#fff" : "var(--tdp-text)",
                  borderRadius: "var(--tdp-radius-sm)",
                }}>
                <span className="text-sm" style={{ fontFamily: "var(--font-baloo)" }}>{d.getDate()}</span>
                <span className="text-[8px] opacity-70">{hijriahTanggal(d)}</span>

                <span className="flex gap-0.5">
                  {adaSetoran && <span className="size-1 rounded-full" style={{ background: aktif ? "#fff" : "var(--tdp-sky)" }} />}
                  {adaAmalan && <span className="size-1 rounded-full" style={{ background: aktif ? "#fff" : "var(--tdp-mint)" }} />}
                  {adaJournal && <span className="size-1 rounded-full" style={{ background: aktif ? "#fff" : "var(--tdp-lilac)" }} />}
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-[10px]" style={{ color: "var(--tdp-muted)" }}>
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full" style={{ background: "var(--tdp-sky)" }} /> Setoran</span>
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full" style={{ background: "var(--tdp-mint)" }} /> Amalan</span>
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full" style={{ background: "var(--tdp-lilac)" }} /> Journal</span>
        </div>
      </section>

      <section className="p-4" style={card}>
        <h2 className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          {detail.tanggal.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </h2>
        <p className="mb-3 text-xs" style={{ color: "var(--tdp-muted)" }}>
          {hijriahDari(detail.tanggal) ?? ""} · {HARI_PANJANG[detail.tanggal.getDay()]}
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1 text-xs" style={{ color: "var(--tdp-primary-ink)" }}>Hafalan</p>
            {detail.setoran.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>Tidak ada setoran.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {detail.setoran.map((s) => (
                  <li key={s.id} className="px-3 py-2 text-xs"
                    style={{ background: "var(--tdp-sky-soft)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}>
                    {cariSurah(s.surah)?.nama} ayat {s.dari}–{s.sampai} · {s.tipe === "baru" ? "hafalan baru" : "murojaah"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1 text-xs" style={{ color: "var(--tdp-primary-ink)" }}>Amalan</p>
            <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
              {detail.amalanDicentang.length} dari {amalan.length} amalan tercentang
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs" style={{ color: "var(--tdp-primary-ink)" }}>Kuliah</p>
            {detail.kuliah.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>Tidak ada kuliah.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {detail.kuliah.map((k) => (
                  <li key={k.id} className="px-3 py-2 text-xs"
                    style={{ background: "var(--tdp-lemon-soft)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}>
                    {k.mulai}–{k.selesai} · {k.mata}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(detail.journal.length > 0 || detail.mood) && (
            <div>
              <p className="mb-1 text-xs" style={{ color: "var(--tdp-primary-ink)" }}>Catatan hati</p>
              {detail.mood && (
                <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>Suasana hati: {detail.mood}</p>
              )}
              {detail.journal.map((e) => (
                <p key={e.id} className="mt-1 px-3 py-2 text-xs"
                  style={{ background: "var(--tdp-lilac-soft)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}>
                  {e.judul}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}