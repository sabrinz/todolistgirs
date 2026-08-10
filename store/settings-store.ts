"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeId = "pink" | "purple" | "matcha" | "blue"

type Store = {
  name: string
  theme: ThemeId
  reminder: boolean
  sound: boolean
  animation: boolean
  setName: (name: string) => void
  setTheme: (theme: ThemeId) => void
  toggle: (key: "reminder" | "sound" | "animation") => void
  resetAll: () => void
}

export const useSettingsStore = create<Store>()(
  persist(
    (set) => ({
      name: "Sabrina",
      theme: "pink",
      reminder: true,
      sound: true,
      animation: true,

      setName: (name) => set({ name }),
      setTheme: (theme) => set({ theme }),
      toggle: (key) => set((s) => ({ [key]: !s[key] }) as Partial<Store>),

      resetAll: () => {
        localStorage.removeItem("tdp-store")
        localStorage.removeItem("tdp-notes")
        localStorage.removeItem("tdp-settings")
        location.reload()
      },
    }),
    { name: "tdp-settings" }
  )
)