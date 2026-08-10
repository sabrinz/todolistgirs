import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Bab = { id: string; nama: string; selesai: boolean }

export type Kitab = {
  id: string
  nama: string
  mataKuliah: string
  totalHalaman: number
  halamanDibaca: number
  tanggalUjian?: string
  bab: Bab[]
  createdAt: string
}

type State = {
  kitab: Kitab[]
  tambahKitab: (k: { nama: string; mataKuliah: string; totalHalaman: number; tanggalUjian?: string }) => void
  hapusKitab: (id: string) => void
  setHalaman: (id: string, halaman: number) => void
  setUjian: (id: string, tanggal?: string) => void
  tambahBab: (kitabId: string, nama: string) => void
  toggleBab: (kitabId: string, babId: string) => void
  hapusBab: (kitabId: string, babId: string) => void
}

export const useMuqorrorStore = create<State>()(
  persist(
    (set) => ({
      kitab: [],

      tambahKitab: (k) =>
        set((st) => ({
          kitab: [
            ...st.kitab,
            { ...k, id: crypto.randomUUID(), halamanDibaca: 0, bab: [], createdAt: new Date().toISOString() },
          ],
        })),

      hapusKitab: (id) => set((st) => ({ kitab: st.kitab.filter((k) => k.id !== id) })),

      setHalaman: (id, halaman) =>
        set((st) => ({
          kitab: st.kitab.map((k) =>
            k.id === id ? { ...k, halamanDibaca: Math.max(0, Math.min(k.totalHalaman, halaman)) } : k
          ),
        })),

      setUjian: (id, tanggal) =>
        set((st) => ({
          kitab: st.kitab.map((k) => (k.id === id ? { ...k, tanggalUjian: tanggal } : k)),
        })),

      tambahBab: (kitabId, nama) =>
        set((st) => ({
          kitab: st.kitab.map((k) =>
            k.id === kitabId
              ? { ...k, bab: [...k.bab, { id: crypto.randomUUID(), nama: nama.trim(), selesai: false }] }
              : k
          ),
        })),

      toggleBab: (kitabId, babId) =>
        set((st) => ({
          kitab: st.kitab.map((k) =>
            k.id === kitabId
              ? { ...k, bab: k.bab.map((b) => (b.id === babId ? { ...b, selesai: !b.selesai } : b)) }
              : k
          ),
        })),

      hapusBab: (kitabId, babId) =>
        set((st) => ({
          kitab: st.kitab.map((k) =>
            k.id === kitabId ? { ...k, bab: k.bab.filter((b) => b.id !== babId) } : k
          ),
        })),
    }),
    { name: "rihlah-muqorror" }
  )
)

export function persenKitab(k: Kitab) {
  if (k.totalHalaman <= 0) return 0
  return Math.round((k.halamanDibaca / k.totalHalaman) * 100)
}

export function sisaHari(tanggal?: string) {
  if (!tanggal) return null
  const target = new Date(tanggal + "T00:00:00")
  const kini = new Date()
  kini.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - kini.getTime()) / 86400000)
}

export function halamanPerHari(k: Kitab) {
  const sisa = sisaHari(k.tanggalUjian)
  if (sisa === null || sisa <= 0) return null
  return Math.ceil((k.totalHalaman - k.halamanDibaca) / sisa)
}