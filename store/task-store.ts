"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Category = "Sekolah" | "Belajar" | "Kesehatan" | "Self Care" | "Hobi"

export type Task = {
  id: string
  title: string
  category: Category
  time?: string
  done: boolean
  createdAt: string
  completedAt?: string
}

export type MoodValue = "bahagia" | "senang" | "biasa" | "sedih" | "lelah"

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10)

const yesterdayKey = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dayKey(d)
}

type Store = {
  tasks: Task[]
  moodByDate: Record<string, MoodValue>
  points: number
  streak: number
  lastActiveDate: string | null
  addTask: (input: { title: string; category: Category; time?: string }) => void
  toggleTask: (id: string) => boolean
  removeTask: (id: string) => void
  setMood: (mood: MoodValue) => void
  touchStreak: () => void
}

export const useTaskStore = create<Store>()(
  persist(
    (set, get) => ({
      tasks: [],
      moodByDate: {},
      points: 0,
      streak: 0,
      lastActiveDate: null,

      addTask: ({ title, category, time }) =>
        set((s) => ({
          tasks: [
            {
              id: crypto.randomUUID(),
              title: title.trim(),
              category,
              time,
              done: false,
              createdAt: new Date().toISOString(),
            },
            ...s.tasks,
          ],
        })),

      toggleTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return false
        const willComplete = !task.done

        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  done: willComplete,
                  completedAt: willComplete ? new Date().toISOString() : undefined,
                }
              : t
          ),
          points: Math.max(0, s.points + (willComplete ? 10 : -10)),
        }))

        return willComplete
      },

      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      setMood: (mood) =>
        set((s) => ({ moodByDate: { ...s.moodByDate, [dayKey()]: mood } })),

      touchStreak: () => {
        const { lastActiveDate, streak } = get()
        const today = dayKey()
        if (lastActiveDate === today) return
        set({
          lastActiveDate: today,
          streak: lastActiveDate === yesterdayKey() ? streak + 1 : 1,
        })
      },
    }),
    { name: "tdp-store" }
  )
)

export const todayKey = dayKey