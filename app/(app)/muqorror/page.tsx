"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarClock, ChevronDown, Library, Minus, Plus, Trash2 } from "lucide-react"
import {
  halamanPerHari, persenKitab, sisaHari, useMuqorrorStore,
} from "@/store/muqorror-store"

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

export default function MuqorrorPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { kitab, tambahKitab, hapusKitab, setHalaman, setUjian, tambahBab, toggleBab, hapusBab } =
    useMuqorrorStore()

  const [buka, setBuka] = useState(false)
  const [nama, setNama] = useState("")
  const [mata, setMata] = useState("")
  const [total, setTotal] = useState("")
  const [ujian, setUjianInput] = useState("")
  const [terbuka, setTerbuka] = useState<string | null>(null)
  const [babBaru, setBabBaru] = useState("")

  function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!nama.trim() || !Number(total)) return

    tambahKitab({
      nama: nama.trim(),
      mataKuliah: mata.trim(),
      totalHalaman: Number(total),
      tanggalUjian: ujian || undefined,
    })

    setNama(""); setMata(""); setTotal(""); setUjianInput(""); setBuka(false)
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
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Muqorror</h1>
          <p className="text-sm text-white/85">{kitab.length} kitab sedang dipelajari</p>
        </div>
      </section>

      <button
        onClick={() => setBuka((v) => !v)}
        className="flex items-center justify-center gap-2 py-3 text-sm text-white"
        style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius)", boxShadow: "var(--tdp-shadow)" }}
      >
        <Plus className="size-4" /> Tambah kitab
      </button>

      <AnimatePresence>
        {buka && (
          <motion.form
            onSubmit={simpan}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 overflow-hidden p-4" style={card}
          >
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kitab, misalnya Tafsir Al-Munir"
              className="px-3 py-2.5 text-sm outline-none" style={kolom} />

            <input value={mata} onChange={(e) => setMata(e.target.value)} placeholder="Mata kuliah, misalnya Tafsir"
              className="px-3 py-2.5 text-sm outline-none" style={kolom} />

            <div className="grid gap-3 sm:grid-cols-2">
              <input type="number" min={1} value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Jumlah halaman"
                className="px-3 py-2.5 text-sm outline-none" style={kolom} />

              <input type="date" value={ujian} onChange={(e) => setUjianInput(e.target.value)}
                className="px-3 py-2.5 text-sm outline-none" style={kolom} />
            </div>

            <button type="submit" className="py-3 text-sm text-white"
              style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
              Simpan kitab
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {kitab.length === 0 ? (
        <div className="p-10 text-center text-sm" style={{ ...card, color: "var(--tdp-muted)" }}>
          Belum ada kitab. Tambahkan muqorror semester ini beserta tanggal imtihannya.
        </div>
      ) : (
        <section className="flex flex-col gap-3">
          {kitab.map((k) => {
            const persen = persenKitab(k)
            const sisa = sisaHari(k.tanggalUjian)
            const perHari = halamanPerHari(k)
            const babSelesai = k.bab.filter((b) => b.selesai).length

            return (
              <motion.div key={k.id} layout className="p-4" style={card}>
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: "var(--tdp-lilac-soft)" }}>
                    <Library className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>{k.nama}</p>
                    <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>
                      {k.mataKuliah || "Tanpa mata kuliah"}
                      {k.bab.length > 0 && ` · ${babSelesai}/${k.bab.length} bab`}
                    </p>
                  </div>

                  <button onClick={() => hapusKitab(k.id)} aria-label="Hapus kitab">
                    <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => setHalaman(k.id, k.halamanDibaca - 1)}
                    className="flex size-8 items-center justify-center" style={kolom} aria-label="Kurangi">
                    <Minus className="size-3.5" />
                  </button>

                  <input type="number" min={0} max={k.totalHalaman} value={k.halamanDibaca}
                    onChange={(e) => setHalaman(k.id, Number(e.target.value))}
                    className="w-16 px-2 py-1.5 text-center text-sm outline-none" style={kolom} />

                  <span className="text-xs" style={{ color: "var(--tdp-muted)" }}>dari {k.totalHalaman} halaman</span>

                  <button onClick={() => setHalaman(k.id, k.halamanDibaca + 1)}
                    className="ml-auto flex size-8 items-center justify-center text-white"
                    style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }} aria-label="Tambah">
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full" style={{ background: "var(--tdp-bg)" }}>
                  <motion.div animate={{ width: `${persen}%` }} className="h-full rounded-full"
                    style={{ background: "var(--tdp-primary)" }} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--tdp-muted)" }}>
                  <span>{persen}% selesai</span>

                  {sisa !== null && (
                    <span className="flex items-center gap-1 rounded-full px-2.5 py-1"
                      style={{ background: sisa <= 7 ? "#FFEFEF" : "var(--tdp-lemon-soft)", color: "var(--tdp-text)" }}>
                      <CalendarClock className="size-3" />
                      {sisa > 0 ? `Imtihan ${sisa} hari lagi` : sisa === 0 ? "Imtihan hari ini" : "Imtihan sudah lewat"}
                    </span>
                  )}

                  {perHari !== null && perHari > 0 && <span>Perlu {perHari} halaman per hari</span>}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input type="date" value={k.tanggalUjian ?? ""}
                    onChange={(e) => setUjian(k.id, e.target.value || undefined)}
                    className="px-3 py-2 text-xs outline-none" style={kolom} />

                  <button onClick={() => setTerbuka(terbuka === k.id ? null : k.id)}
                    className="ml-auto flex items-center gap-1 text-xs" style={{ color: "var(--tdp-primary-ink)" }}>
                    Bab <ChevronDown className="size-3.5" style={{ transform: terbuka === k.id ? "rotate(180deg)" : "none" }} />
                  </button>
                </div>

                <AnimatePresence>
                  {terbuka === k.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <ul className="mt-3 flex flex-col gap-2">
                        {k.bab.map((b) => (
                          <li key={b.id} className="flex items-center gap-3 p-2.5"
                            style={{ background: b.selesai ? "var(--tdp-mint-soft)" : "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)" }}>
                            <button onClick={() => toggleBab(k.id, b.id)} className="flex flex-1 items-center gap-2.5 text-left text-sm"
                              style={{ color: "var(--tdp-text)", textDecoration: b.selesai ? "line-through" : "none" }}>
                              <span className="size-4 shrink-0 rounded-full"
                                style={{ background: b.selesai ? "var(--tdp-primary)" : "transparent", border: "2px solid var(--tdp-primary-soft)" }} />
                              {b.nama}
                            </button>

                            <button onClick={() => hapusBab(k.id, b.id)} aria-label="Hapus bab">
                              <Trash2 className="size-3.5" style={{ color: "var(--tdp-muted)" }} />
                            </button>
                          </li>
                        ))}
                      </ul>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (!babBaru.trim()) return
                          tambahBab(k.id, babBaru)
                          setBabBaru("")
                        }}
                        className="mt-2 flex gap-2"
                      >
                        <input value={babBaru} onChange={(e) => setBabBaru(e.target.value)} placeholder="Nama bab baru"
                          className="flex-1 px-3 py-2 text-xs outline-none" style={kolom} />
                        <button type="submit" className="px-3 text-xs text-white"
                          style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
                          Tambah
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </section>
      )}
    </div>
  )
}