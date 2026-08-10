import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Kuliah = {
  id: string
  hari: number // 0 Ahad sampai 6 Sabtu
  mulai: string // "08:00"
  selesai: string
  mata: string
  dosen?: string
  ruang?: string
}

export const HARI_PANJANG = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

type State = {
  kuliah: Kuliah[]
  tambah: (k: Omit<Kuliah, "id">) => void
  hapus: (id: string) => void
}

export const useJadwalStore = create<State>()(
  persist(
    (set) => ({
      kuliah: [],
      tambah: (k) => set((st) => ({ kuliah: [...st.kuliah, { ...k, id: crypto.randomUUID() }] })),
      hapus: (id) => set((st) => ({ kuliah: st.kuliah.filter((x) => x.id !== id) })),
    }),
    { name: "rihlah-jadwal" }
  )
)

export function kuliahHari(kuliah: Kuliah[], hari: number) {
  return kuliah.filter((k) => k.hari === hari).sort((a, b) => a.mulai.localeCompare(b.mulai))
}

export type WaktuSholat = {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

const HOST = "api.aladhan.com"

export async function ambilWaktuSholat(
  kota = "Cairo"
): Promise<{ waktu: WaktuSholat; hijriah: string } | null> {
  try {
    const alamat = "https://" + HOST + "/v1/timingsByCity?city=" + encodeURIComponent(kota) + "&country=Egypt&method=5"
    const alamatLama =
      `https://${HOST}/v1/timingsByCity?city=` +
      encodeURIComponent(kota) +
      `&country=Egypt&method=5`

    const res = await fetch(alamat)
    if (!res.ok) return null

    const json = await res.json()
    const t = json.data.timings
    const h = json.data.date.hijri

    return {
      waktu: {
        Fajr: t.Fajr,
        Sunrise: t.Sunrise,
        Dhuhr: t.Dhuhr,
        Asr: t.Asr,
        Maghrib: t.Maghrib,
        Isha: t.Isha,
      },
      hijriah: `${h.day} ${h.month.en} ${h.year} H`,
    }
  } catch {
    return null
  }
}

/** Menentukan sholat berikutnya dari jam sekarang */
export function sholatBerikutnya(w: WaktuSholat) {
  const urutan: Array<[string, string]> = [
    ["Subuh", w.Fajr], ["Terbit", w.Sunrise], ["Dzuhur", w.Dhuhr],
    ["Ashar", w.Asr], ["Maghrib", w.Maghrib], ["Isya", w.Isha],
  ]

  const kini = new Date()
  const menitKini = kini.getHours() * 60 + kini.getMinutes()

  for (const [nama, jam] of urutan) {
    const [j, m] = jam.split(":").map(Number)
    if (j * 60 + m > menitKini) return { nama, jam, sisaMenit: j * 60 + m - menitKini }
  }

  return { nama: "Subuh", jam: w.Fajr, sisaMenit: null }
}