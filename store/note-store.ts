import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Note = {
  id: string
  judul: string
  isi: string
  mataKuliah: string
  createdAt: string
  updatedAt: string
}

type State = {
  notes: Note[]
  tambah: (n: { judul: string; isi: string; mataKuliah: string }) => void
  ubah: (id: string, n: { judul: string; isi: string; mataKuliah: string }) => void
  hapus: (id: string) => void
}

export const useNoteStore = create<State>()(
  persist(
    (set) => ({
      notes: [],

      tambah: (n) =>
        set((st) => ({
          notes: [
            {
              ...n,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...st.notes,
          ],
        })),

      ubah: (id, n) =>
        set((st) => ({
          notes: st.notes.map((x) =>
            x.id === id ? { ...x, ...n, updatedAt: new Date().toISOString() } : x
          ),
        })),

      hapus: (id) => set((st) => ({ notes: st.notes.filter((x) => x.id !== id) })),
    }),
    { name: "rihlah-notes" }
  )
)

export function mataKuliahUnik(notes: Note[]) {
  return [...new Set(notes.map((n) => n.mataKuliah))].filter(Boolean).sort()
}