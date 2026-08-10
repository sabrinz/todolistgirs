"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { NotebookPen, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { mataKuliahUnik, useNoteStore } from "@/store/note-store"

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

export default function CatatanPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { notes, tambah, ubah, hapus } = useNoteStore()

  const [buka, setBuka] = useState(false)
  const [sedangDiubah, setSedangDiubah] = useState<string | null>(null)
  const [judul, setJudul] = useState("")
  const [isi, setIsi] = useState("")
  const [mata, setMata] = useState("")
  const [cari, setCari] = useState("")
  const [saring, setSaring] = useState("semua")

  const daftarMata = useMemo(() => mataKuliahUnik(notes), [notes])

  const tampil = useMemo(() => {
    const kata = cari.trim().toLowerCase()

    return notes
      .filter((n) => (saring === "semua" ? true : n.mataKuliah === saring))
      .filter((n) =>
        kata === "" ? true : `${n.judul} ${n.isi} ${n.mataKuliah}`.toLowerCase().includes(kata)
      )
  }, [notes, cari, saring])

  function reset() {
    setJudul(""); setIsi(""); setMata("")
    setSedangDiubah(null); setBuka(false)
  }

  function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!judul.trim() && !isi.trim()) return

    const data = {
      judul: judul.trim() || "Tanpa judul",
      isi: isi.trim(),
      mataKuliah: mata.trim() || "Umum",
    }

    if (sedangDiubah) ubah(sedangDiubah, data)
    else tambah(data)

    reset()
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
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Catatan</h1>
          <p className="text-sm text-white/85">
            {notes.length} catatan · {daftarMata.length} mata kuliah
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 px-3 py-2.5" style={kolom}>
          <Search className="size-4" style={{ color: "var(--tdp-muted)" }} />
          <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari catatan"
            className="w-full bg-transparent text-sm outline-none" />
        </label>

        <select value={saring} onChange={(e) => setSaring(e.target.value)}
          className="px-3 py-2.5 text-sm outline-none" style={kolom}>
          <option value="semua">Semua mata kuliah</option>
          {daftarMata.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <button onClick={() => (buka ? reset() : setBuka(true))}
        className="flex items-center justify-center gap-2 py-3 text-sm text-white"
        style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius)", boxShadow: "var(--tdp-shadow)" }}>
        <Plus className="size-4" /> {buka ? "Tutup" : "Catatan baru"}
      </button>

      <AnimatePresence>
        {buka && (
          <motion.form onSubmit={simpan}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 overflow-hidden p-4" style={card}>
            <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul catatan"
              className="px-3 py-2.5 text-sm outline-none" style={kolom} />

            <input value={mata} onChange={(e) => setMata(e.target.value)} placeholder="Mata kuliah"
              className="px-3 py-2.5 text-sm outline-none" style={kolom} list="mata-kuliah" />

            <datalist id="mata-kuliah">
              {daftarMata.map((m) => <option key={m} value={m} />)}
            </datalist>

            <textarea value={isi} onChange={(e) => setIsi(e.target.value)} rows={8}
              placeholder="Isi catatan. Boleh campur Arab dan Indonesia."
              className="resize-none px-3 py-2.5 text-sm outline-none" style={kolom} />

            <button type="submit" className="py-3 text-sm text-white"
              style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
              {sedangDiubah ? "Simpan perubahan" : "Simpan catatan"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {tampil.length === 0 ? (
        <div className="p-10 text-center text-sm" style={{ ...card, color: "var(--tdp-muted)" }}>
          {notes.length === 0 ? "Belum ada catatan." : "Tidak ada catatan yang cocok."}
        </div>
      ) : (
        <section className="grid gap-2 sm:grid-cols-2">
          {tampil.map((n) => (
            <motion.article key={n.id} layout className="p-4" style={card}>
              <div className="flex items-start gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "var(--tdp-sky-soft)" }}>
                  <NotebookPen className="size-4" style={{ color: "var(--tdp-primary-ink)" }} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>{n.judul}</p>
                  <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                    {n.mataKuliah} · {new Date(n.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSedangDiubah(n.id); setJudul(n.judul); setIsi(n.isi); setMata(n.mataKuliah); setBuka(true)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  aria-label="Ubah catatan"
                >
                  <Pencil className="size-3.5" style={{ color: "var(--tdp-muted)" }} />
                </button>

                <button onClick={() => hapus(n.id)} aria-label="Hapus catatan">
                  <Trash2 className="size-3.5" style={{ color: "var(--tdp-muted)" }} />
                </button>
              </div>

              {n.isi && (
                <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm" style={{ color: "var(--tdp-text)" }}>{n.isi}</p>
              )}
            </motion.article>
          ))}
        </section>
      )}
    </div>
  )
}