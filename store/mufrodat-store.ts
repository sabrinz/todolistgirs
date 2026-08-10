import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Kartu = {
  id: string
  arab: string
  indo: string
  contoh?: string
  kategori: string
  benar: number
  salah: number
  terakhirDites?: string
  createdAt: string
}

type State = {
  kartu: Kartu[]
  tambah: (k: { arab: string; indo: string; contoh?: string; kategori: string }) => void
  hapus: (id: string) => void
  jawab: (id: string, benar: boolean) => void
  resetNilai: (id: string) => void
}

export const useMufrodatStore = create<State>()(
  persist(
    (set) => ({
      kartu: [],

      tambah: (k) =>
        set((st) => ({
          kartu: [
            {
              ...k,
              arab: k.arab.trim(),
              indo: k.indo.trim(),
              id: crypto.randomUUID(),
              benar: 0,
              salah: 0,
              createdAt: new Date().toISOString(),
            },
            ...st.kartu,
          ],
        })),

      hapus: (id) => set((st) => ({ kartu: st.kartu.filter((k) => k.id !== id) })),

      jawab: (id, benar) =>
        set((st) => ({
          kartu: st.kartu.map((k) =>
            k.id === id
              ? {
                  ...k,
                  benar: benar ? k.benar + 1 : k.benar,
                  salah: benar ? k.salah : k.salah + 1,
                  terakhirDites: new Date().toISOString(),
                }
              : k
          ),
        })),

      resetNilai: (id) =>
        set((st) => ({
          kartu: st.kartu.map((k) =>
            k.id === id ? { ...k, benar: 0, salah: 0, terakhirDites: undefined } : k
          ),
        })),
    }),
    { name: "rihlah-mufrodat" }
  )
)

export function akurasi(k: Kartu) {
  const total = k.benar + k.salah
  if (total === 0) return 0
  return Math.round((k.benar / total) * 100)
}

/** Dianggap dikuasai kalau benar minimal 3 kali dan akurasinya 80% ke atas */
export function sudahDikuasai(k: Kartu) {
  return k.benar >= 3 && akurasi(k) >= 80
}

export function kartuPerluDiulang(kartu: Kartu[]) {
  return kartu
    .filter((k) => !sudahDikuasai(k))
    .sort((a, b) => akurasi(a) - akurasi(b) || b.salah - a.salah)
}

export function kategoriUnik(kartu: Kartu[]) {
  return [...new Set(kartu.map((k) => k.kategori))].filter(Boolean).sort()
}