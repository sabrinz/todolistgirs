"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import { BookOpen, Check, Flame, Layers, Plus, Trash2 } from "lucide-react"
import { JUZ, SURAH, cariSurah } from "@/lib/quran"
import { useSettingsStore } from "@/store/settings-store"
import {
  ayatPadaTanggal, ayatUnikPerSurah, kunciHari, perluMurojaah, persenHafalan,
  rentetanHafalan, surahSelesai, totalAyatHafal, useHafalanStore,
} from "@/store/hafalan-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const R = 54
const KELILING = 2 * Math.PI * R

function predikat(p: number) {
  if (p >= 85) return "Mumtaz"
  if (p >= 75) return "Jayyid Jiddan"
  if (p >= 65) return "Jayyid"
  if (p >= 50) return "Maqbul"
  return "Bidayah"
}

export default function HafalanPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const animation = useSettingsStore((s) => s.animation)
  const { setoran, juzHafal, targetHarian, tambahSetoran, hapusSetoran, toggleJuz, setTargetHarian } =
    useHafalanStore()

  const atas = useRef<HTMLDivElement>(null)
  const [nomorSurah, setNomorSurah] = useState(78)
  const [dari, setDari] = useState(1)
  const [sampai, setSampai] = useState(5)
  const [tipe, setTipe] = useState<"baru" | "murojaah">("baru")
  const [catatan, setCatatan] = useState("")

  const surahTerpilih = cariSurah(nomorSurah)
  const hari = kunciHari()

  const ayatHariIni = ayatPadaTanggal(setoran, hari)
  const persenTarget = Math.min(100, Math.round((ayatHariIni / Math.max(1, targetHarian)) * 100))
  const persen = persenHafalan(setoran)
  const selesai = useMemo(() => surahSelesai(setoran), [setoran])
  const perSurah = useMemo(() => ayatUnikPerSurah(setoran), [setoran])
  const pengingat = useMemo(() => perluMurojaah(setoran, 7), [setoran])

  const riwayat = useMemo(() => {
    const peta = new Map<string, typeof setoran>()
    for (const s of setoran) {
      if (!peta.has(s.tanggal)) peta.set(s.tanggal, [])
      peta.get(s.tanggal)!.push(s)
    }
    return [...peta.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14)
  }, [setoran])

  function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!surahTerpilih) return

    const a = Math.min(dari, sampai)
    const b = Math.max(dari, sampai)

    tambahSetoran({ surah: nomorSurah, dari: a, sampai: b, tipe, catatan: catatan.trim() || undefined })
    setCatatan("")

    if (animation) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#FF6FA5", "#FFC2DA", "#C9A7F5", "#FFE08A", "#8FE0BE"],
      })
    }
  }

  if (!mounted) return null

  return (
    <div ref={atas} className="mx-auto flex max-w-5xl flex-col gap-4">
      <section
        className="relative flex flex-col items-center gap-5 overflow-hidden p-5 md:flex-row"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-12 -top-12 size-44 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative shrink-0">
          <svg width={132} height={132} viewBox="0 0 132 132">
            <circle cx={66} cy={66} r={R} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={11} />
            <motion.circle
              cx={66} cy={66} r={R} fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round"
              strokeDasharray={KELILING}
              initial={{ strokeDashoffset: KELILING }}
              animate={{ strokeDashoffset: KELILING - (KELILING * persen) / 100 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              transform="rotate(-90 66 66)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>{persen}%</span>
            <span className="text-[10px] text-white/80">Al-Qur'an</span>
          </div>
        </div>

        <div className="relative flex-1 text-center md:text-left">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Hafalan</h1>
          <p className="text-sm text-white/85">
            {totalAyatHafal(setoran)} ayat tersimpan · predikat {predikat(persen)}
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1.5 text-xs text-white backdrop-blur">
            Target harian
            <input
              type="number" min={1} value={targetHarian}
              onChange={(e) => setTargetHarian(Number(e.target.value))}
              className="w-12 bg-transparent text-center outline-none"
            />
            ayat · hari ini {ayatHariIni} ({persenTarget}%)
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Ayat dihafal", nilai: totalAyatHafal(setoran), Icon: BookOpen, warna: "var(--tdp-sky-soft)" },
          { label: "Surah selesai", nilai: selesai.length, Icon: Check, warna: "var(--tdp-mint-soft)" },
          { label: "Juz dikuasai", nilai: juzHafal.length, Icon: Layers, warna: "var(--tdp-lilac-soft)" },
          { label: "Rentetan hari", nilai: rentetanHafalan(setoran), Icon: Flame, warna: "var(--tdp-lemon-soft)" },
        ].map((s) => (
          <div key={s.label} className="p-4" style={{ ...card, background: s.warna }}>
            <s.Icon className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
            <p className="mt-2 text-2xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>{s.nilai}</p>
            <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>{s.label}</p>
          </div>
        ))}
      </section>

      <form onSubmit={simpan} className="flex flex-col gap-3 p-4" style={card}>
        <div className="flex gap-2">
          {(["baru", "murojaah"] as const).map((t) => (
            <button
              key={t} type="button" onClick={() => setTipe(t)}
              className="rounded-full px-4 py-1.5 text-xs"
              style={{
                background: tipe === t ? "var(--tdp-primary)" : "var(--tdp-bg)",
                color: tipe === t ? "#fff" : "var(--tdp-muted)",
              }}
            >
              {t === "baru" ? "Hafalan baru" : "Murojaah"}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <select
            value={nomorSurah}
            onChange={(e) => setNomorSurah(Number(e.target.value))}
            className="px-3 py-2.5 text-sm outline-none sm:col-span-2"
            style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
          >
            {SURAH.map((s) => (
              <option key={s.n} value={s.n}>{s.n}. {s.nama} ({s.ayat} ayat)</option>
            ))}
          </select>

          <input
            type="number" min={1} max={surahTerpilih?.ayat} value={dari}
            onChange={(e) => setDari(Number(e.target.value))} placeholder="Dari ayat"
            className="px-3 py-2.5 text-sm outline-none"
            style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
          />

          <input
            type="number" min={1} max={surahTerpilih?.ayat} value={sampai}
            onChange={(e) => setSampai(Number(e.target.value))} placeholder="Sampai ayat"
            className="px-3 py-2.5 text-sm outline-none"
            style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
          />
        </div>

        <input
          value={catatan} onChange={(e) => setCatatan(e.target.value)}
          placeholder="Catatan, misalnya bagian yang masih tersendat"
          className="px-3 py-2.5 text-sm outline-none"
          style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-3 text-sm text-white transition-transform active:scale-[0.98]"
          style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)", boxShadow: "var(--tdp-shadow)" }}
        >
          <Plus className="size-4" /> Simpan setoran
        </button>
      </form>

      <AnimatePresence>
        {pengingat.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="p-4" style={{ ...card, background: "var(--tdp-lemon-soft)" }}
          >
            <p className="text-sm" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              Waktunya murojaah
            </p>
            <p className="mb-2 text-xs" style={{ color: "var(--tdp-muted)" }}>
              Surah berikut belum diulang lebih dari sepekan. Ketuk untuk mengisi setoran murojaah.
            </p>

            <div className="flex flex-wrap gap-2">
              {pengingat.map((p) => (
                <button
                  key={p.surah}
                  onClick={() => {
                    setNomorSurah(p.surah)
                    setTipe("murojaah")
                    atas.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="rounded-full px-3 py-1.5 text-xs"
                  style={{ background: "var(--tdp-card)", color: "var(--tdp-text)" }}
                >
                  {cariSurah(p.surah)?.nama} · {p.selisih} hari
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="p-4" style={card}>
        <h2 className="mb-1 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Peta 30 juz
        </h2>
        <p className="mb-3 text-xs" style={{ color: "var(--tdp-muted)" }}>Ketuk juz yang sudah dikuasai.</p>

        <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
          {JUZ.map((j) => {
            const aktif = juzHafal.includes(j)
            return (
              <motion.button
                key={j} whileTap={{ scale: 0.9 }} onClick={() => toggleJuz(j)}
                className="aspect-square text-sm"
                style={{
                  background: aktif ? "var(--tdp-primary)" : "var(--tdp-bg)",
                  color: aktif ? "#fff" : "var(--tdp-muted)",
                  borderRadius: "var(--tdp-radius-sm)",
                  fontFamily: "var(--font-baloo)",
                }}
              >
                {j}
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Sedang dihafal
        </h2>

        {perSurah.size === 0 ? (
          <p className="py-6 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
            Belum ada setoran. Mulai dari satu ayat pun tidak masalah.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {[...perSurah.entries()]
              .filter(([n, set]) => set.size < (cariSurah(n)?.ayat ?? 0))
              .sort((a, b) => b[1].size - a[1].size)
              .map(([n, set]) => {
                const s = cariSurah(n)!
                const p = Math.round((set.size / s.ayat) * 100)

                return (
                  <div key={n}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span style={{ color: "var(--tdp-text)" }}>{s.nama}</span>
                      <span style={{ color: "var(--tdp-muted)" }}>{set.size}/{s.ayat} ayat · {p}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--tdp-bg)" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${p}%` }}
                        className="h-full rounded-full" style={{ background: "var(--tdp-primary)" }}
                      />
                    </div>
                  </div>
                )
              })}

            {selesai.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selesai.map((s) => (
                  <span
                    key={s.n} className="rounded-full px-3 py-1 text-xs"
                    style={{ background: "var(--tdp-mint-soft)", color: "var(--tdp-text)" }}
                  >
                    {s.nama} selesai
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="p-4" style={card}>
        <h2 className="mb-3 text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
          Riwayat setoran
        </h2>

        {riwayat.length === 0 ? (
          <p className="py-6 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>Belum ada riwayat.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {riwayat.map(([tanggal, isi]) => (
              <div key={tanggal}>
                <p className="mb-2 text-xs" style={{ color: "var(--tdp-muted)" }}>
                  {new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                </p>

                <ul className="flex flex-col gap-2">
                  {isi.map((s) => (
                    <li
                      key={s.id} className="flex items-center gap-3 p-3"
                      style={{
                        background: s.tipe === "baru" ? "var(--tdp-sky-soft)" : "var(--tdp-lilac-soft)",
                        borderRadius: "var(--tdp-radius-sm)",
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm" style={{ color: "var(--tdp-text)" }}>
                          {cariSurah(s.surah)?.nama} · ayat {s.dari}–{s.sampai}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                          {s.tipe === "baru" ? "Hafalan baru" : "Murojaah"}
                          {s.catatan ? ` · ${s.catatan}` : ""}
                        </p>
                      </div>

                      <button onClick={() => hapusSetoran(s.id)} aria-label="Hapus">
                        <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}