import { create } from "zustand"
import { persist } from "zustand/middleware"

export type MoodValue = "bahagia" | "senang" | "biasa" | "rindu" | "lelah" | "sedih"

type State = {
  moodByDate: Record<string, MoodValue>
  catatanByDate: Record<string, string>
  setMood: (tanggal: string, mood: MoodValue) => void
  setCatatan: (tanggal: string, isi: string) => void
  hapus: (tanggal: string) => void
}

export const useMoodStore = create<State>()(
  persist(
    (set) => ({
      moodByDate: {},
      catatanByDate: {},

      setMood: (tanggal, mood) =>
        set((st) => ({ moodByDate: { ...st.moodByDate, [tanggal]: mood } })),

      setCatatan: (tanggal, isi) =>
        set((st) => ({ catatanByDate: { ...st.catatanByDate, [tanggal]: isi } })),

      hapus: (tanggal) =>
        set((st) => {
          const mood = { ...st.moodByDate }
          const catatan = { ...st.catatanByDate }
          delete mood[tanggal]
          delete catatan[tanggal]
          return { moodByDate: mood, catatanByDate: catatan }
        }),
    }),
    { name: "rihlah-mood" }
  )
)