"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type NoteMood = "senang" | "biasa" | "sedih"

export type Note = {
  id: string
  title: string
  body: string
  mood: NoteMood
  createdAt: string
  updatedAt: string
}

type Store = {
  notes: Note[]
  addNote: (input: { title: string; body: string; mood: NoteMood }) => void
  updateNote: (id: string, input: { title: string; body: string; mood: NoteMood }) => void
  removeNote: (id: string) => void
}

export const useNoteStore = create<Store>()(
  persist(
    (set) => ({
      notes: [],

      addNote: ({ title, body, mood }) =>
        set((s) => ({
          notes: [
            {
              id: crypto.randomUUID(),
              title: title.trim() || "Tanpa judul",
              body: body.trim(),
              mood,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.notes,
          ],
        })),

      updateNote: (id, { title, body, mood }) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  title: title.trim() || "Tanpa judul",
                  body: body.trim(),
                  mood,
                  updatedAt: new Date().toISOString(),
                }
              : n
          ),
        })),

      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    { name: "tdp-notes" }
  )
)