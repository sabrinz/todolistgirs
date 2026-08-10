"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Frown, NotebookPen, Pencil, Plus, Search, Smile, Meh, Trash2, X } from "lucide-react"
import { useNoteStore, type NoteMood } from "@/store/note-store"

const MOODS: { value: NoteMood; label: string; Icon: typeof Smile; color: string }[] = [
  { value: "senang", label: "Senang", Icon: Smile, color: "var(--tdp-mint)" },
  { value: "biasa", label: "Biasa", Icon: Meh, color: "var(--tdp-lemon)" },
  { value: "sedih", label: "Sedih", Icon: Frown, color: "var(--tdp-lilac)" },
]

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow)",
}

export default function CatatanPage() {
  const [mounted, setMounted] = useState(false)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [mood, setMood] = useState<NoteMood>("senang")

  const { notes, addNote, updateNote, removeNote } = useNoteStore()

  useEffect(() => setMounted(true), [])

  const visible = useMemo(() => {
    if (!q.trim()) return notes
    const needle = q.toLowerCase()
    return notes.filter(
      (n) => n.title.toLowerCase().includes(needle) || n.body.toLowerCase().includes(needle)
    )
  }, [notes, q])

  if (!mounted) return null

  const reset = () => {
    setTitle("")
    setBody("")
    setMood("senang")
    setEditing(null)
    setOpen(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() && !body.trim()) return
    if (editing) updateNote(editing, { title, body, mood })
    else addNote({ title, body, mood })
    reset()
  }

  const startEdit = (id: string) => {
    const n = notes.find((x) => x.id === id)
    if (!n) return
    setEditing(id)
    setTitle(n.title)
    setBody(n.body)
    setMood(n.mood)
    setOpen(true)
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex-1">
          <h1
            className="text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
          >
            Catatan & Diary
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--tdp-muted)" }}>
            {notes.length} catatan tersimpan
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => (open ? reset() : setOpen(true))}
          className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs text-white"
          style={{ background: "var(--tdp-primary)", boxShadow: "var(--tdp-shadow)" }}
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }}>
            <Plus className="size-4" />
          </motion.span>
          {open ? "Tutup" : "Tulis Catatan"}
        </motion.button>
      </motion.div>

      {/* Formulir */}
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 p-5" style={card}>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul catatan..."
                className="w-full bg-transparent text-xl outline-none"
                style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
              />

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Tulis apa pun yang kamu rasakan hari ini..."
                className="w-full resize-none rounded-2xl p-3 text-sm outline-none"
                style={{ background: "var(--tdp-bg)", color: "var(--tdp-text)" }}
              />

              <div className="flex flex-wrap items-center gap-2">
                {MOODS.map((m) => (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition-transform hover:scale-105"
                    style={{
                      background: mood === m.value ? m.color : "var(--tdp-bg)",
                      color: "var(--tdp-text)",
                    }}
                  >
                    <m.Icon className="size-3.5" />
                    {m.label}
                  </button>
                ))}

                <button
                  type="submit"
                  className="ml-auto rounded-full px-5 py-2 text-xs text-white"
                  style={{ background: "var(--tdp-primary)" }}
                >
                  {editing ? "Perbarui" : "Simpan Catatan"}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Pencarian */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2.5"
        style={{ background: "var(--tdp-card)", boxShadow: "var(--tdp-shadow)" }}
      >
        <Search className="size-4" style={{ color: "var(--tdp-muted)" }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari catatan..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--tdp-text)" }}
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Hapus pencarian">
            <X className="size-4" style={{ color: "var(--tdp-muted)" }} />
          </button>
        )}
      </div>

      {/* Daftar catatan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {visible.map((n) => {
            const m = MOODS.find((x) => x.value === n.mood)!
            return (
              <motion.article
                key={n.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                whileHover={{ y: -5 }}
                className="group flex flex-col p-5"
                style={{ ...card, borderTop: `6px solid ${m.color}` }}
              >
                <div className="flex items-start gap-2">
                  <p
                    className="flex-1 text-lg leading-tight"
                    style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}
                  >
                    {n.title}
                  </p>
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full"
                    style={{ background: m.color }}
                  >
                    <m.Icon className="size-3.5" style={{ color: "var(--tdp-text)" }} />
                  </span>
                </div>

                <p
                  className="mt-2 line-clamp-4 flex-1 whitespace-pre-wrap text-sm"
                  style={{ color: "var(--tdp-text)" }}
                >
                  {n.body}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "var(--tdp-muted)" }}>
                    {new Date(n.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => startEdit(n.id)}
                      aria-label="Ubah catatan"
                      className="flex size-7 items-center justify-center rounded-full"
                      style={{ background: "var(--tdp-bg)" }}
                    >
                      <Pencil className="size-3.5" style={{ color: "var(--tdp-primary-ink)" }} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeNote(n.id)}
                      aria-label="Hapus catatan"
                      className="flex size-7 items-center justify-center rounded-full"
                      style={{ background: "var(--tdp-bg)" }}
                    >
                      <Trash2 className="size-3.5" style={{ color: "var(--tdp-muted)" }} />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 py-16 text-center"
          style={card}
        >
          <span
            className="flex size-14 items-center justify-center rounded-full"
            style={{ background: "var(--tdp-bg)" }}
          >
            <NotebookPen className="size-6" style={{ color: "var(--tdp-primary)" }} />
          </span>
          <p className="text-sm" style={{ color: "var(--tdp-muted)" }}>
            {notes.length === 0
              ? "Belum ada catatan. Tulis yang pertama yuk!"
              : "Tidak ada catatan yang cocok"}
          </p>
        </motion.div>
      )}
    </div>
  )
}