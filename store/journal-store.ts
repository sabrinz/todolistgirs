import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Semester = "winter" | "summer"

export type JournalMood = "senang" | "bersyukur" | "biasa" | "rindu" | "berat"

export type Entri = {
  id: string
  judul: string
  isi: string
  tanggal: string
  semester: Semester
  tahun: number
  mood: JournalMood
  createdAt: string
  updatedAt: string
}

export const LABEL_SEMESTER: Record<Semester, string> = {
  winter: "Winter Semester",
  summer: "Summer Semester",
}

export function kunciHari(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** Oktober sampai Februari dihitung Winter, Maret sampai September Summer */
export function semesterOtomatis(d = new Date()): Semester {
  const b = d.getMonth() + 1
  return b >= 10 || b <= 2 ? "winter" : "summer"
}

/** Januari dan Februari masih masuk tahun akademik sebelumnya */
export function tahunAkademik(d = new Date()) {
  const b = d.getMonth() + 1
  return b <= 2 ? d.getFullYear() - 1 : d.getFullYear()
}

type State = {
  entri: Entri[]
  tambah: (e: { judul: string; isi: string; mood: JournalMood }) => void
  ubah: (id: string, e: { judul: string; isi: string; mood: JournalMood }) => void
  hapus: (id: string) => void
}

export const useJournalStore = create<State>()(
  persist(
    (set) => ({
      entri: [],

      tambah: (e) =>
        set((st) => {
          const kini = new Date()
          return {
            entri: [
              {
                ...e,
                id: crypto.randomUUID(),
                tanggal: kunciHari(kini),
                semester: semesterOtomatis(kini),
                tahun: tahunAkademik(kini),
                createdAt: kini.toISOString(),
                updatedAt: kini.toISOString(),
              },
              ...st.entri,
            ],
          }
        }),

      ubah: (id, e) =>
        set((st) => ({
          entri: st.entri.map((x) =>
            x.id === id ? { ...x, ...e, updatedAt: new Date().toISOString() } : x
          ),
        })),

      hapus: (id) => set((st) => ({ entri: st.entri.filter((x) => x.id !== id) })),
    }),
    { name: "rihlah-journal" }
  )
)

export function kelompokSemester(entri: Entri[]) {
  const peta = new Map<string, Entri[]>()

  for (const e of entri) {
    const kunci = `${e.semester}-${e.tahun}`
    if (!peta.has(kunci)) peta.set(kunci, [])
    peta.get(kunci)!.push(e)
  }

  return [...peta.entries()]
    .map(([kunci, isi]) => {
      const [semester, tahun] = kunci.split("-")
      return {
        kunci,
        semester: semester as Semester,
        tahun: Number(tahun),
        label: `${LABEL_SEMESTER[semester as Semester]} ${tahun}/${Number(tahun) + 1}`,
        entri: isi.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      }
    })
    .sort((a, b) => b.tahun - a.tahun || a.semester.localeCompare(b.semester))
}