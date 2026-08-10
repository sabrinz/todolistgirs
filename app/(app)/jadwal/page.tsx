"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Clock, MapPin, Plus, Trash2, User } from "lucide-react"
import {
  HARI_PANJANG, ambilWaktuSholat, kuliahHari, sholatBerikutnya,
  useJadwalStore, type WaktuSholat,
} from "@/store/jadwal-store"
import { useSettingsStore } from "@/store/settings-store"

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

export default function JadwalPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { kuliah, tambah, hapus } = useJadwalStore()
  const { kota, setKota } = useSettingsStore()

  const [hariAktif, setHariAktif] = useState(new Date().getDay())
  const [buka, setBuka] = useState(false)

  const [mata, setMata] = useState("")
  const [mulai, setMulai] = useState("08:00")
  const [selesai, setSelesai] = useState("10:00")
  const [dosen, setDosen] = useState("")
  const [ruang, setRuang] = useState("")

  const [sholat, setSholat] = useState<WaktuSholat | null>(null)
  const [hijriah, setHijriah] = useState<string | null>(null)

  useEffect(() => {
    ambilWaktuSholat(kota).then((r) => {
      if (!r) return
      setSholat(r.waktu)
      setHijriah(r.hijriah)
    })
  }, [kota])

  const berikutnya = sholat ? sholatBerikutnya(sholat) : null
  const daftar = kuliahHari(kuliah, hariAktif)

  function simpan(e: React.FormEvent) {
    e.preventDefault()
    if (!mata.trim()) return

    tambah({
      hari: hariAktif,
      mulai, selesai,
      mata: mata.trim(),
      dosen: dosen.trim() || undefined,
      ruang: ruang.trim() || undefined,
    })

    setMata(""); setDosen(""); setRuang(""); setBuka(false)
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
          <h1 className="text-2xl text-white" style={{ fontFamily: "var(--font-baloo)" }}>Jadwal</h1>
          <p className="text-sm text-white/85">
            {kuliahHari(kuliah, new Date().getDay()).length} kuliah hari ini
            {hijriah ? ` · ${hijriah}` : ""}
          </p>

          {berikutnya && (
            <p className="mt-2 inline-block rounded-full bg-white/25 px-3 py-1 text-xs text-white backdrop-blur">
              {berikutnya.nama} {berikutnya.jam}
            </p>
          )}
        </div>
      </section>

      <section className="p-4" style={card}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
            Waktu sholat
          </h2>

          <input
            value={kota} onChange={(e) => setKota(e.target.value)}
            className="w-32 px-3 py-1.5 text-xs outline-none" style={kolom} aria-label="Kota"
          />
        </div>

        {!sholat ? (
          <p className="py-4 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
            Sedang mengambil waktu sholat untuk {kota}. Pastikan ada koneksi internet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {([
              ["Subuh", sholat.Fajr], ["Terbit", sholat.Sunrise], ["Dzuhur", sholat.Dhuhr],
              ["Ashar", sholat.Asr], ["Maghrib", sholat.Maghrib], ["Isya", sholat.Isha],
            ] as Array<[string, string]>).map(([nama, waktu]) => {
              const aktif = berikutnya?.nama === nama

              return (
                <div key={nama} className="p-2.5 text-center"
                  style={{
                    background: aktif ? "var(--tdp-primary)" : "var(--tdp-bg)",
                    borderRadius: "var(--tdp-radius-sm)",
                  }}>
                  <p className="text-[10px]" style={{ color: aktif ? "rgba(255,255,255,.85)" : "var(--tdp-muted)" }}>{nama}</p>
                  <p className="text-sm" style={{ fontFamily: "var(--font-baloo)", color: aktif ? "#fff" : "var(--tdp-text)" }}>{waktu}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {HARI_PANJANG.map((h, i) => {
          const aktif = hariAktif === i
          const jumlah = kuliahHari(kuliah, i).length

          return (
            <button key={h} onClick={() => setHariAktif(i)}
              className="shrink-0 rounded-full px-4 py-2 text-xs"
              style={{
                background: aktif ? "var(--tdp-primary)" : "var(--tdp-card)",
                color: aktif ? "#fff" : "var(--tdp-muted)",
                boxShadow: "var(--tdp-shadow-soft)",
              }}>
              {h}{jumlah > 0 ? ` (${jumlah})` : ""}
            </button>
          )
        })}
      </div>

      {daftar.length === 0 ? (
        <div className="p-10 text-center text-sm" style={{ ...card, color: "var(--tdp-muted)" }}>
          Belum ada kuliah pada hari {HARI_PANJANG[hariAktif]}.
        </div>
      ) : (
        <section className="flex flex-col gap-2">
          {daftar.map((k) => (
            <motion.div key={k.id} layout className="flex items-center gap-3 p-4" style={card}>
              <div className="shrink-0 text-center">
                <p className="text-sm" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>{k.mulai}</p>
                <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>{k.selesai}</p>
              </div>

              <div className="h-10 w-1 shrink-0 rounded-full" style={{ background: "var(--tdp-primary-soft)" }} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm" style={{ color: "var(--tdp-text)" }}>{k.mata}</p>

                <p className="flex flex-wrap items-center gap-2 text-[10px]" style={{ color: "var(--tdp-muted)" }}>
                  {k.dosen && <span className="flex items-center gap-1"><User className="size-3" />{k.dosen}</span>}
                  {k.ruang && <span className="flex items-center gap-1"><MapPin className="size-3" />{k.ruang}</span>}
                </p>
              </div>

              <button onClick={() => hapus(k.id)} aria-label="Hapus kuliah">
                <Trash2 className="size-4" style={{ color: "var(--tdp-muted)" }} />
              </button>
            </motion.div>
          ))}
        </section>
      )}

      <button onClick={() => setBuka((v) => !v)}
        className="flex items-center justify-center gap-2 py-3 text-sm text-white"
        style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius)", boxShadow: "var(--tdp-shadow)" }}>
        <Plus className="size-4" /> Tambah kuliah hari {HARI_PANJANG[hariAktif]}
      </button>

      <AnimatePresence>
        {buka && (
          <motion.form onSubmit={simpan}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 overflow-hidden p-4" style={card}>
            <input value={mata} onChange={(e) => setMata(e.target.value)} placeholder="Mata kuliah"
              className="px-3 py-2.5 text-sm outline-none" style={kolom} />

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 px-3 py-2 text-xs" style={kolom}>
                <Clock className="size-3.5" /> Mulai
                <input type="time" value={mulai} onChange={(e) => setMulai(e.target.value)}
                  className="ml-auto bg-transparent outline-none" />
              </label>

              <label className="flex items-center gap-2 px-3 py-2 text-xs" style={kolom}>
                <Clock className="size-3.5" /> Selesai
                <input type="time" value={selesai} onChange={(e) => setSelesai(e.target.value)}
                  className="ml-auto bg-transparent outline-none" />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input value={dosen} onChange={(e) => setDosen(e.target.value)} placeholder="Nama dosen, boleh dikosongkan"
                className="px-3 py-2.5 text-sm outline-none" style={kolom} />

              <input value={ruang} onChange={(e) => setRuang(e.target.value)} placeholder="Ruang atau qism"
                className="px-3 py-2.5 text-sm outline-none" style={kolom} />
            </div>

            <button type="submit" className="py-3 text-sm text-white"
              style={{ background: "var(--tdp-primary)", borderRadius: "var(--tdp-radius-sm)" }}>
              Simpan ke hari {HARI_PANJANG[hariAktif]}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}