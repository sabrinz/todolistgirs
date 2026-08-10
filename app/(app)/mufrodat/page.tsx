"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Eye, Plus, RotateCcw, Trash2, X } from "lucide-react"
import {
  akurasi, kartuPerluDiulang, kategoriUnik, sudahDikuasai, useMufrodatStore, type Kartu,
} from "@/store/mufrodat-store"

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

export default function MufrodatPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { kartu, tambah, hapus, jawab, resetNilai } = useMufrodatStore()

  const [arab, setArab] = useState("")
  const [indo, setIndo] = useState("")
  const [contoh, setContoh] = useState("")
  const [kategori, setKategori] = useState("")
  const [pilihKategori, setPilihKategori] = useState("semua")

  const [tes, setTes] = useState<Kartu | null>(null)
  const [terbuka, setTerbuka] = useState(false)

  const kategoriList = useMemo(() => kategoriUnik(kartu), [kartu])

  const tersaring = useMemo(
    () => (pilihKategori === "semua" ? kartu : kartu.filter((k) => k.kategori === pilihKategori)),
    [kartu, pilihKategori]
  )

  const dikuasai = kartu.filter(sudahDikuasai).length

  function acak() {
    const kolamPrioritas = kartuPerluDiulang(tersaring)
    const kolam = kolamPrioritas.length > 0 ? kolamPrioritas.slice(0, 8) : tersaring
    if (kolam.length === 0) return

    setTes(kolam[Math.floor(Math.random() * kolam.length)])
    setTerbuka(false)
  }

  function nilai(benar: boolean) {
    if (!tes) return
    jawab(tes.id, benar)
    acak()
  }

  function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!arab.trim() || !indo.trim()) return

    tambah({
      arab, indo,
      contoh: contoh.trim() || undefined,
      kategori: kategori.trim() || "Umum",
    })

    setArab(""); setIndo(""); setContoh("")
  }

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <section
        className="relative overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-12 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />

        <div className="relative">
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Mufrodat</h1>
          <p className="text-sm text-white/85">
            {kartu.length} kosakata · {dikuasai} sudah dikuasai
          </p>
        </div>
      </section>

      <section className="p-4" style={card}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Mode tes
          </h2>

          <select value={pilihKategori} onChange={(e) => setPilihKategori(e.target.value)}
            className="px-3 py-1.5 text-xs outline-none" style={kolom}>
            <option value="semua">Semua kategori</option>
            {kategoriList.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        {!tes ? (
          <button onClick={acak} disabled={tersaring.length === 0}
            className="w-full py-3 text-sm text-white disabled:opacity-40"
            style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
            {tersaring.length === 0 ? "Belum ada kartu untuk dites" : "Mulai tes"}
          </button>
        ) : (
          <div>
            <motion.div key={tes.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center"
              style={{ background: "var(--tdp-sky-soft)", borderRadius: "var(--tdp-radius)" }}>
              <p dir="rtl" className="text-3xl" style={{ color: "var(--tdp-text)" }}>{tes.arab}</p>

              <AnimatePresence>
                {terbuka ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
                      {tes.indo}
                    </p>
                    {tes.contoh && (
                      <p dir="rtl" className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>{tes.contoh}</p>
                    )}
                  </motion.div>
                ) : (
                  <button onClick={() => setTerbuka(true)}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-xs"
                    style={{ background: "var(--tdp-card)", color: "var(--tdp-text)" }}>
                    <Eye className="size-3.5" /> Lihat artinya
                  </button>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => nilai(false)} className="flex items-center justify-center gap-2 py-3 text-sm"
                style={{ background: "#FFEFEF", borderRadius: "var(--tdp-radius-sm)", color: "#C93E58" }}>
                <X className="size-4" /> Belum hafal
              </button>

              <button onClick={() => nilai(true)} className="flex items-center justify-center gap-2 py-3 text-sm text-white"
                style={{ background: "var(--tdp-mint)", borderRadius: "var(--tdp-radius-sm)" }}>
                <Check className="size-4" /> Sudah hafal
              </button>
            </div>

            <button onClick={() => setTes(null)} className="mt-2 w-full py-2 text-xs" style={{ color: "var(--tdp-muted)" }}>
              Selesai berlatih
            </button>
          </div>
        )}
      </section>

      <form onSubmit={simpan} className="flex flex-col gap-3 p-4" style={card}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input dir="rtl" value={arab} onChange={(e) => setArab(e.target.value)} placeholder="الكلمة"
            className="px-3 py-2.5 text-lg outline-none" style={kolom} />

          <input value={indo} onChange={(e) => setIndo(e.target.value)} placeholder="Arti dalam bahasa Indonesia"
            className="px-3 py-2.5 text-sm outline-none" style={kolom} />
        </div>

        <input dir="rtl" value={contoh} onChange={(e) => setContoh(e.target.value)} placeholder="Contoh kalimat, boleh dikosongkan"
          className="px-3 py-2.5 text-sm outline-none" style={kolom} />

        <input value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="Kategori, misalnya Nahwu atau Tafsir"
          className="px-3 py-2.5 text-sm outline-none" style={kolom} list="kategori-mufrodat" />

        <datalist id="kategori-mufrodat">
          {kategoriList.map((k) => <option key={k} value={k} />)}
        </datalist>

        <button type="submit" className="flex items-center justify-center gap-2 py-3 text-sm text-white"
          style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
          <Plus className="size-4" /> Simpan kosakata
        </button>
      </form>

      {tersaring.length > 0 && (
        <section className="grid gap-2 sm:grid-cols-2">
          {tersaring.map((k) => (
            <motion.div key={k.id} layout className="flex items-center gap-3 p-3.5"
              style={{ ...card, background: sudahDikuasai(k) ? "var(--tdp-mint-soft)" : "var(--tdp-card)" }}>
              <div className="min-w-0 flex-1">
                <p dir="rtl" className="text-lg" style={{ color: "var(--tdp-text)" }}>{k.arab}</p>
                <p className="truncate text-sm" style={{ color: "var(--tdp-text)" }}>{k.indo}</p>
                <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                  {k.kategori} · benar {k.benar} · salah {k.salah}
                  {k.benar + k.salah > 0 && ` · ${akurasi(k)}%`}
                </p>
              </div>

              <button onClick={() => resetNilai(k.id)} aria-label="Reset nilai">
                <RotateCcw className="size-4" style={{ color: "var(--tdp-muted)" }} />
              </button>

              <button onClick={() => hapus(k.id)} aria-label="Hapus kartu">
                <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
              </button>
            </motion.div>
          ))}
        </section>
      )}
    </div>
  )
}