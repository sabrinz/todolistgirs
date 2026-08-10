import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Amalan = { id: string; nama: string; ikon: string; bawaan: boolean }

export const AMALAN_BAWAAN: Amalan[] = [
  { id: "tilawah", nama: "Tilawah 1 juz", ikon: "book", bawaan: true },
  { id: "dzikir-pagi", nama: "Dzikir pagi", ikon: "sunrise", bawaan: true },
  { id: "dzikir-petang", nama: "Dzikir petang", ikon: "sunset", bawaan: true },
  { id: "dhuha", nama: "Sholat Dhuha", ikon: "sun", bawaan: true },
  { id: "qiyam", nama: "Qiyamullail", ikon: "moon", bawaan: true },
  { id: "murojaah", nama: "Murojaah hafalan", ikon: "repeat", bawaan: true },
  { id: "kitab", nama: "Baca muqorror", ikon: "library", bawaan: true },
  { id: "istighfar", nama: "Istighfar 100x", ikon: "heart", bawaan: true },
]

type State = {
  amalan: Amalan[]
  log: Record<string, string[]>
  toggle: (tanggal: string, id: string) => void
  tambahAmalan: (nama: string, ikon?: string) => void
  hapusAmalan: (id: string) => void
}

export const useAmalanStore = create<State>()(
  persist(
    (set) => ({
      amalan: AMALAN_BAWAAN,
      log: {},

      toggle: (tanggal, id) =>
        set((st) => {
          const hari = st.log[tanggal] ?? []
          const baru = hari.includes(id) ? hari.filter((x) => x !== id) : [...hari, id]
          return { log: { ...st.log, [tanggal]: baru } }
        }),

      tambahAmalan: (nama, ikon = "check") =>
        set((st) => ({
          amalan: [...st.amalan, { id: crypto.randomUUID(), nama: nama.trim(), ikon, bawaan: false }],
        })),

      hapusAmalan: (id) =>
        set((st) => ({
          amalan: st.amalan.filter((a) => a.id !== id),
          log: Object.fromEntries(
            Object.entries(st.log).map(([t, isi]) => [t, isi.filter((x) => x !== id)])
          ),
        })),
    }),
    { name: "rihlah-amalan" }
  )
)

export function persenAmalan(log: Record<string, string[]>, tanggal: string, jumlah: number) {
  if (jumlah === 0) return 0
  return Math.round(((log[tanggal]?.length ?? 0) / jumlah) * 100)
}

export function rentetanAmalan(log: Record<string, string[]>) {
  const kunci = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  const d = new Date()
  let rentetan = 0

  if (!log[kunci(d)]?.length) d.setDate(d.getDate() - 1)

  while (log[kunci(d)]?.length) {
    rentetan++
    d.setDate(d.getDate() - 1)
  }

  return rentetan
}