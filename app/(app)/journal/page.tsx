"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CloudRain, Heart, Meh, Pencil, Plus, Smile, Sparkles, Trash2 } from "lucide-react"
import {
  kelompokSemester, useJournalStore, type JournalMood,
} from "@/store/journal-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

const kolom = {
  background: "var(--tdp-bg)",
  borderRadius: "var(--tdp-radius-sm)",
  color: "var(--tdp-text)",
}

const MOODS: Array<{ id: JournalMood; label: string; Icon: typeof Smile; warna: string }> = [
  { id: "senang", label: "Senang", Icon: Smile, warna: "var(--tdp-mint-soft)" },
  { id: "bersyukur", label: "Bersyukur", Icon: Sparkles, warna: "var(--tdp-lemon-soft)" },
  { id: "biasa", label: "Biasa", Icon: Meh, warna: "var(--tdp-sky-soft)" },
  { id: "rindu", label: "Rindu rumah", Icon: Heart, warna: "var(--tdp-primary-soft)" },
  { id: "berat", label: "Berat", Icon: CloudRain, warna: "var(--tdp-lilac-soft)" },
]

export default function JournalPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { entri, tambah, ubah, hapus } = useJournalStore()

  const [buka, setBuka] = useState(false)
  const [sedangDiubah, setSedangDiubah] = useState<string | null>(null)
  const [judul, setJudul] = useState("")
  const [isi, setIsi] = useState("")
  const [mood, setMood] = useState<JournalMood>("biasa")

  const kelompok = useMemo(() => kelompokSemester(entri), [entri])

  function reset() {
    setJudul(""); setIsi(""); setMood("biasa")
    setSedangDiubah(null); setBuka(false)
  }

  function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!judul.trim() && !isi.trim()) return

    const data = { judul: judul.trim() || "Tanpa judul", isi: isi.trim(), mood }

    if (sedangDiubah) ubah(sedangDiubah, data)
    else tambah(data)

    reset()
  }

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <section
        className="relative overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Journal</h1>
          <p className="text-sm text-white/85">
            {entri.length} tulisan · tersimpan otomatis per semester
          </p>
        </div>
      </section>

      <button onClick={() => (buka ? reset() : setBuka(true))}
        className="flex items-center justify-center gap-2 py-3 text-sm text-white"
        style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius)", boxShadow: "var(--tdp-shadow)" }}>
        <Plus className="size-4" /> {buka ? "Tutup" : "Tulis hari ini"}
      </button>

      <AnimatePresence>
        {buka && (
          <motion.form onSubmit={simpan}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 overflow-hidden p-4" style={card}>
            <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul hari ini"
              className="px-3 py-2.5 text-sm outline-none" style={kolom} />

            <textarea value={isi} onChange={(e) => setIsi(e.target.value)} rows={6}
              placeholder="Tuliskan apa saja. Yang membuat lelah, yang membuat bersyukur, atau doa untuk hari esok."
              className="resize-none px-3 py-2.5 text-sm outline-none" style={kolom} />

            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const aktif = mood === m.id
                return (
                  <button key={m.id} type="button" onClick={() => setMood(m.id)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                    style={{
                      background: aktif ? "var(--tdp-primary)" : m.warna,
                      color: aktif ? "#fff" : "var(--tdp-text)",
                    }}>
                    <m.Icon className="size-3.5" /> {m.label}
                  </button>
                )
              })}
            </div>

            <button type="submit" className="py-3 text-sm text-white"
              style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
              {sedangDiubah ? "Simpan perubahan" : "Simpan tulisan"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {kelompok.length === 0 ? (
        <div className="p-10 text-center text-sm" style={{ ...card, color: "var(--tdp-muted)" }}>
          Belum ada tulisan. Nanti akan terkumpul rapi per Winter dan Summer Semester.
        </div>
      ) : (
        kelompok.map((g) => (
          <section key={g.kunci} className="flex flex-col gap-2">
            <h2 className="px-1 text-sm" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              {g.label} · {g.entri.length} tulisan
            </h2>

            {g.entri.map((e) => {
              const m = MOODS.find((x) => x.id === e.mood) ?? MOODS[2]

              return (
                <motion.article key={e.id} layout className="p-4" style={{ ...card, background: m.warna }}>
                  <div className="flex items-start gap-2">
                    <m.Icon className="mt-0.5 size-4 shrink-0" style={{ color: "var(--tdp-primary-ink)" }} />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>{e.judul}</p>
                      <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                        {new Date(e.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSedangDiubah(e.id); setJudul(e.judul); setIsi(e.isi); setMood(e.mood); setBuka(true)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                      aria-label="Ubah tulisan"
                    >
                      <Pencil className="size-3.5" style={{ color: "var(--tdp-muted)" }} />
                    </button>

                    <button onClick={() => hapus(e.id)} aria-label="Hapus tulisan">
                      <Trash2 className="size-3.5" style={{ color: "var(--tdp-muted)" }} />
                    </button>
                  </div>

                  {e.isi && (
                    <p className="mt-2 whitespace-pre-wrap text-sm" style={{ color: "var(--tdp-text)" }}>{e.isi}</p>
                  )}
                </motion.article>
              )
            })}
          </section>
        ))
      )}
    </div>
  )
}