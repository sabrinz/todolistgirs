import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SURAH, TOTAL_AYAT } from "@/lib/quran"

export type TipeSetoran = "baru" | "murojaah"

export type Setoran = {
  id: string
  tanggal: string
  surah: number
  dari: number
  sampai: number
  tipe: TipeSetoran
  catatan?: string
  createdAt: string
}

export function kunciHari(d = new Date()) {
  const bulan = String(d.getMonth() + 1).padStart(2, "0")
  const hari = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${bulan}-${hari}`
}

export const tanggalHariIni = kunciHari

type State = {
  setoran: Setoran[]
  juzHafal: number[]
  targetHarian: number
  tambahSetoran: (s: Omit<Setoran, "id" | "createdAt" | "tanggal"> & { tanggal?: string }) => void
  hapusSetoran: (id: string) => void
  toggleJuz: (juz: number) => void
  setTargetHarian: (n: number) => void
}

export const useHafalanStore = create<State>()(
  persist(
    (set) => ({
      setoran: [],
      juzHafal: [],
      targetHarian: 5,

      tambahSetoran: (s) =>
        set((st) => ({
          setoran: [
            {
              ...s,
              tanggal: s.tanggal ?? kunciHari(),
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...st.setoran,
          ],
        })),

      hapusSetoran: (id) => set((st) => ({ setoran: st.setoran.filter((x) => x.id !== id) })),

      toggleJuz: (juz) =>
        set((st) => ({
          juzHafal: st.juzHafal.includes(juz)
            ? st.juzHafal.filter((j) => j !== juz)
            : [...st.juzHafal, juz],
        })),

      setTargetHarian: (n) => set({ targetHarian: Math.max(1, n) }),
    }),
    { name: "rihlah-hafalan" }
  )
)

export function ayatPadaTanggal(setoran: Setoran[], tanggal: string) {
  return setoran
    .filter((s) => s.tanggal === tanggal)
    .reduce((a, s) => a + (s.sampai - s.dari + 1), 0)
}

export function ayatBaruPadaTanggal(setoran: Setoran[], tanggal: string) {
  return setoran
    .filter((s) => s.tanggal === tanggal && s.tipe === "baru")
    .reduce((a, s) => a + (s.sampai - s.dari + 1), 0)
}

export function ayatUnikPerSurah(setoran: Setoran[]) {
  const peta = new Map<number, Set<number>>()

  for (const s of setoran) {
    if (s.tipe !== "baru") continue
    if (!peta.has(s.surah)) peta.set(s.surah, new Set())
    const kumpulan = peta.get(s.surah)!
    for (let a = s.dari; a <= s.sampai; a++) kumpulan.add(a)
  }

  return peta
}

export function totalAyatHafal(setoran: Setoran[]) {
  let total = 0
  for (const k of ayatUnikPerSurah(setoran).values()) total += k.size
  return total
}

export function persenHafalan(setoran: Setoran[]) {
  return Math.round((totalAyatHafal(setoran) / TOTAL_AYAT) * 1000) / 10
}

export function surahSelesai(setoran: Setoran[]) {
  const peta = ayatUnikPerSurah(setoran)
  return SURAH.filter((s) => (peta.get(s.n)?.size ?? 0) >= s.ayat)
}

export function perluMurojaah(setoran: Setoran[], batasHari = 7) {
  const peta = ayatUnikPerSurah(setoran)
  const terakhir = new Map<number, string>()

  for (const s of setoran) {
    const ada = terakhir.get(s.surah)
    if (!ada || s.tanggal > ada) terakhir.set(s.surah, s.tanggal)
  }

  const sekarang = Date.now()

  return [...peta.keys()]
    .map((n) => {
      const tgl = terakhir.get(n)!
      const selisih = Math.floor((sekarang - new Date(tgl).getTime()) / 86400000)
      return { surah: n, terakhir: tgl, selisih, jumlahAyat: peta.get(n)?.size ?? 0 }
    })
    .filter((x) => x.selisih >= batasHari)
    .sort((a, b) => b.selisih - a.selisih)
}

export function rentetanHafalan(setoran: Setoran[]) {
  const tanggal = new Set(setoran.map((s) => s.tanggal))
  const d = new Date()
  let rentetan = 0

  if (!tanggal.has(kunciHari(d))) d.setDate(d.getDate() - 1)

  while (tanggal.has(kunciHari(d))) {
    rentetan++
    d.setDate(d.getDate() - 1)
  }

  return rentetan
}