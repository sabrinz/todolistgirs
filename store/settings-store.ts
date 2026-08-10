import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeId =
  | "pink" | "purple" | "matcha" | "blue"
  | "strawberry" | "lavender" | "chocolate" | "minimalist"

export const KUNCI_DATA = [
  "rihlah-hafalan", "rihlah-amalan", "rihlah-muqorror", "rihlah-mufrodat",
  "rihlah-jadwal", "rihlah-journal", "rihlah-notes", "rihlah-mood",
]

type State = {
  name: string
  kota: string
  theme: ThemeId
  animation: boolean
  reminder: boolean
  setName: (v: string) => void
  setKota: (v: string) => void
  setTheme: (v: ThemeId) => void
  toggle: (k: "animation" | "reminder") => void
  resetAll: () => void
}

export const useSettingsStore = create<State>()(
  persist(
    (set) => ({
      name: "Ukhti",
      kota: "Cairo",
      theme: "pink",
      animation: true,
      reminder: true,

      setName: (v) => set({ name: v.trim() || "Ukhti" }),
      setKota: (v) => set({ kota: v.trim() || "Cairo" }),
      setTheme: (v) => set({ theme: v }),
      toggle: (k) => set((st) => ({ [k]: !st[k] }) as Partial<State>),

      resetAll: () => {
        if (typeof window === "undefined") return
        for (const k of KUNCI_DATA) window.localStorage.removeItem(k)
        window.location.reload()
      },
    }),
    { name: "rihlah-settings" }
  )
)