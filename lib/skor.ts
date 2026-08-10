import type { Setoran } from "@/store/hafalan-store"
import { ayatBaruPadaTanggal, ayatPadaTanggal } from "@/store/hafalan-store"
import type { Kitab } from "@/store/muqorror-store"
import { persenKitab } from "@/store/muqorror-store"
import type { Kartu } from "@/store/mufrodat-store"
import { sudahDikuasai } from "@/store/mufrodat-store"
import type { Entri } from "@/store/journal-store"

export type Skor = {
  kerajinan: number
  ketepatan: number
  keproduktivan: number
  keaktifan: number
  total: number
  predikat: string
  hariAktif: number
  hariDinilai: number
}

export function daftarHari(jumlah: number) {
  const hasil: string[] = []
  const d = new Date()

  for (let i = 0; i < jumlah; i++) {
    const x = new Date(d)
    x.setDate(d.getDate() - i)
    hasil.push(
      `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`
    )
  }

  return hasil
}

export function predikatAzhar(nilai: number) {
  if (nilai >= 85) return "Mumtaz"
  if (nilai >= 75) return "Jayyid Jiddan"
  if (nilai >= 65) return "Jayyid"
  if (nilai >= 50) return "Maqbul"
  return "Bidayah"
}

const batas = (x: number) => Math.max(0, Math.min(100, Math.round(x)))

export function hitungSkor(d: {
  setoran: Setoran[]
  targetHarian: number
  logAmalan: Record<string, string[]>
  jumlahAmalan: number
  kitab: Kitab[]
  kartu: Kartu[]
  journal: Entri[]
  hariDinilai?: number
}): Skor {
  const hariDinilai = d.hariDinilai ?? 30
  const hari = daftarHari(hariDinilai)

  const tanggalJournal = new Set(d.journal.map((e) => e.tanggal))
  const tanggalSetoran = new Set(d.setoran.map((s) => s.tanggal))

  const aktifPada = (t: string) =>
    tanggalSetoran.has(t) || (d.logAmalan[t]?.length ?? 0) > 0 || tanggalJournal.has(t)

  // 1. KERAJINAN — seberapa sering hadir, bukan seberapa banyak
  const hariAktif = hari.filter(aktifPada).length
  const kerajinan = batas((hariAktif / hariDinilai) * 100)

  // 2. KETEPATAN — saat hadir, seberapa penuh targetnya dipenuhi
  let jumlahKetepatan = 0
  let pembagiKetepatan = 0

  for (const t of hari) {
    if (!aktifPada(t)) continue

    const capaianHafalan = Math.min(1, ayatPadaTanggal(d.setoran, t) / Math.max(1, d.targetHarian))
    const capaianAmalan = d.jumlahAmalan > 0 ? (d.logAmalan[t]?.length ?? 0) / d.jumlahAmalan : 0

    jumlahKetepatan += (capaianHafalan + capaianAmalan) / 2
    pembagiKetepatan++
  }

  const ketepatan = pembagiKetepatan === 0 ? 0 : batas((jumlahKetepatan / pembagiKetepatan) * 100)

  // 3. KEPRODUKTIVAN — hasil nyata dibanding targetnya
  const bagian: number[] = []

  const ayatBaru = hari.reduce((a, t) => a + ayatBaruPadaTanggal(d.setoran, t), 0)
  bagian.push(Math.min(1, ayatBaru / Math.max(1, d.targetHarian * hariDinilai)))

  if (d.kitab.length > 0) {
    bagian.push(d.kitab.reduce((a, k) => a + persenKitab(k) / 100, 0) / d.kitab.length)
  }

  if (d.kartu.length > 0) {
    bagian.push(d.kartu.filter(sudahDikuasai).length / d.kartu.length)
  }

  const keproduktivan = batas((bagian.reduce((a, b) => a + b, 0) / bagian.length) * 100)

  // 4. KEAKTIFAN — merata memakai semua sisi, bukan cuma satu
  const dalamJendela = (iso?: string) => (iso ? hari.includes(iso.slice(0, 10)) : false)

  const fitur = [
    d.setoran.some((s) => hari.includes(s.tanggal)),
    d.setoran.some((s) => s.tipe === "murojaah" && hari.includes(s.tanggal)),
    hari.some((t) => (d.logAmalan[t]?.length ?? 0) > 0),
    d.journal.some((e) => hari.includes(e.tanggal)),
    d.kitab.some((k) => k.halamanDibaca > 0),
    d.kartu.some((k) => dalamJendela(k.terakhirDites) || dalamJendela(k.createdAt)),
  ]

  const rasioFitur = fitur.filter(Boolean).length / fitur.length

  const jumlahInteraksi =
    d.setoran.filter((s) => hari.includes(s.tanggal)).length +
    hari.reduce((a, t) => a + (d.logAmalan[t]?.length ?? 0), 0) +
    d.journal.filter((e) => hari.includes(e.tanggal)).length +
    d.kartu.filter((k) => dalamJendela(k.terakhirDites)).length

  const kepadatan = Math.min(1, jumlahInteraksi / (hariDinilai * 3))
  const keaktifan = batas((rasioFitur * 0.65 + kepadatan * 0.35) * 100)

  const total = batas((kerajinan + ketepatan + keproduktivan + keaktifan) / 4)

  return {
    kerajinan,
    ketepatan,
    keproduktivan,
    keaktifan,
    total,
    predikat: predikatAzhar(total),
    hariAktif,
    hariDinilai,
  }
}