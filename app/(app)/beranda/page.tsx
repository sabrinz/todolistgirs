"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Check, ChevronRight, Clock, Flame, Library, Moon } from "lucide-react"
import { BunnyMascot } from "@/components/decor/mascot"
import { useSettingsStore } from "@/store/settings-store"
import {
  ayatPadaTanggal, kunciHari, persenHafalan, rentetanHafalan,
  totalAyatHafal, useHafalanStore,
} from "@/store/hafalan-store"
import { persenAmalan, rentetanAmalan, useAmalanStore } from "@/store/amalan-store"
import { halamanPerHari, persenKitab, sisaHari, useMuqorrorStore } from "@/store/muqorror-store"
import { ambilWaktuSholat, sholatBerikutnya, type WaktuSholat } from "@/store/jadwal-store"

const card = {
  background: "var(--tdp-card)",
  borderRadius: "var(--tdp-radius)",
  boxShadow: "var(--tdp-shadow-soft)",
}

export default function BerandaPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { name, kota } = useSettingsStore()
  const { setoran, targetHarian } = useHafalanStore()
  const { amalan, log, toggle } = useAmalanStore()
  const { kitab } = useMuqorrorStore()

  const [sholat, setSholat] = useState<WaktuSholat | null>(null)
  const [hijriah, setHijriah] = useState<string | null>(null)

  useEffect(() => {
    ambilWaktuSholat(kota).then((r) => {
      if (!r) return
      setSholat(r.waktu)
      setHijriah(r.hijriah)
    })
  }, [kota])

  const hari = kunciHari()

  const ayatHariIni = useMemo(() => ayatPadaTanggal(setoran, hari), [setoran, hari])
  const persenTarget = Math.min(100, Math.round((ayatHariIni / Math.max(1, targetHarian)) * 100))
  const amalanHariIni = log[hari] ?? []
  const belumDicentang = amalan.filter((a) => !amalanHariIni.includes(a.id))

  const kitabTerdekat = useMemo(
    () =>
      kitab
        .filter((k) => k.tanggalUjian && (sisaHari(k.tanggalUjian) ?? -1) >= 0)
        .sort((a, b) => (sisaHari(a.tanggalUjian) ?? 0) - (sisaHari(b.tanggalUjian) ?? 0))[0],
    [kitab]
  )

  const berikutnya = sholat ? sholatBerikutnya(sholat) : null
  const jam = new Date().getHours()
  const sapaan = jam < 11 ? "Sabahal khair" : jam < 15 ? "Selamat siang" : jam < 18 ? "Masaal khair" : "Selamat malam"

  if (!mounted) return null

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center gap-4 overflow-hidden p-5"
        style={{ background: "var(--tdp-gradient)", borderRadius: "var(--tdp-radius)" }}
      >
        <div className="absolute -right-10 -top-10 size-40 rounded-full opacity-20" style={{ background: "#fff" }} />
        <div className="absolute -bottom-14 right-24 size-32 rounded-full opacity-15" style={{ background: "#fff" }} />

        <div className="relative min-w-0 flex-1">
          <p className="text-sm text-white/85">{sapaan},</p>
          <h1 className="truncate text-2xl text-white md:text-3xl" style={{ fontFamily: "var(--font-baloo)" }}>
            {name}
          </h1>
          <p className="mt-1 text-xs text-white/80">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
            {hijriah ? ` · ${hijriah}` : ""}
          </p>

          {berikutnya && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1.5 text-xs text-white backdrop-blur">
              <Clock className="size-3.5" />
              {berikutnya.nama} {berikutnya.jam}
              {berikutnya.sisaMenit !== null && (
                <span className="opacity-80">
                  · {Math.floor(berikutnya.sisaMenit / 60)}j {berikutnya.sisaMenit % 60}m lagi
                </span>
              )}
            </div>
          )}
        </div>

        <div className="relative hidden shrink-0 sm:block">
          <BunnyMascot size={120} />
        </div>
      </motion.section>

      {sholat && (
        <section className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {([
            ["Subuh", sholat.Fajr], ["Terbit", sholat.Sunrise], ["Dzuhur", sholat.Dhuhr],
            ["Ashar", sholat.Asr], ["Maghrib", sholat.Maghrib], ["Isya", sholat.Isha],
          ] as Array<[string, string]>).map(([nama, waktu]) => {
            const aktif = berikutnya?.nama === nama
            return (
              <div
                key={nama}
                className="p-2.5 text-center"
                style={{
                  ...card,
                  background: aktif ? "var(--tdp-primary)" : "var(--tdp-card)",
                  borderRadius: "var(--tdp-radius-sm)",
                }}
              >
                <p className="text-[10px]" style={{ color: aktif ? "rgba(255,255,255,.8)" : "var(--tdp-muted)" }}>
                  {nama}
                </p>
                <p className="text-sm" style={{ fontFamily: "var(--font-baloo)", color: aktif ? "#fff" : "var(--tdp-text)" }}>
                  {waktu}
                </p>
              </div>
            )
          })}
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Ayat dihafal", nilai: totalAyatHafal(setoran), sub: `${persenHafalan(setoran)}% Al-Qur'an`, Icon: BookOpen, warna: "var(--tdp-sky-soft)" },
          { label: "Hafalan hari ini", nilai: `${ayatHariIni}/${targetHarian}`, sub: `${persenTarget}% target`, Icon: Check, warna: "var(--tdp-mint-soft)" },
          { label: "Amalan hari ini", nilai: `${amalanHariIni.length}/${amalan.length}`, sub: `${persenAmalan(log, hari, amalan.length)}% selesai`, Icon: Moon, warna: "var(--tdp-lilac-soft)" },
          { label: "Rentetan hari", nilai: Math.max(rentetanHafalan(setoran), rentetanAmalan(log)), sub: "hari berturut-turut", Icon: Flame, warna: "var(--tdp-lemon-soft)" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4"
            style={{ ...card, background: s.warna }}
          >
            <s.Icon className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
            <p className="mt-2 text-2xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-text)" }}>
              {s.nilai}
            </p>
            <p className="text-xs" style={{ color: "var(--tdp-text)" }}>{s.label}</p>
            <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>{s.sub}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="p-4" style={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              Amalan belum dicentang
            </h2>
            <Link href="/amalan" className="flex items-center text-xs" style={{ color: "var(--tdp-muted)" }}>
              Semua <ChevronRight className="size-3.5" />
            </Link>
          </div>

          {belumDicentang.length === 0 ? (
            <p className="py-6 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
              Semua amalan hari ini sudah dicentang. Barakallahu fiik.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {belumDicentang.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => toggle(hari, a.id)}
                    className="flex w-full items-center gap-3 p-3 text-left text-sm transition-transform active:scale-[0.98]"
                    style={{ background: "var(--tdp-bg)", borderRadius: "var(--tdp-radius-sm)", color: "var(--tdp-text)" }}
                  >
                    <span
                      className="size-5 shrink-0 rounded-full"
                      style={{ border: "2px solid var(--tdp-primary-soft)" }}
                    />
                    {a.nama}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="p-4" style={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
              Muqorror terdekat
            </h2>
            <Link href="/muqorror" className="flex items-center text-xs" style={{ color: "var(--tdp-muted)" }}>
              Semua <ChevronRight className="size-3.5" />
            </Link>
          </div>

          {!kitabTerdekat ? (
            <p className="py-6 text-center text-sm" style={{ color: "var(--tdp-muted)" }}>
              Belum ada kitab dengan tanggal imtihan.
            </p>
          ) : (
            <div>
              <div className="flex items-start gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "var(--tdp-lilac-soft)" }}
                >
                  <Library className="size-5" style={{ color: "var(--tdp-primary-ink)" }} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm" style={{ color: "var(--tdp-text)" }}>{kitabTerdekat.nama}</p>
                  <p className="text-xs" style={{ color: "var(--tdp-muted)" }}>{kitabTerdekat.mataKuliah}</p>
                </div>

                <div className="text-right">
                  <p className="text-xl" style={{ fontFamily: "var(--font-baloo)", color: "var(--tdp-primary-ink)" }}>
                    {sisaHari(kitabTerdekat.tanggalUjian)}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--tdp-muted)" }}>hari lagi</p>
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--tdp-bg)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${persenKitab(kitabTerdekat)}%` }}
                  className="h-full rounded-full"
                  style={{ background: "var(--tdp-primary)" }}
                />
              </div>

              <p className="mt-2 text-xs" style={{ color: "var(--tdp-muted)" }}>
                {kitabTerdekat.halamanDibaca} dari {kitabTerdekat.totalHalaman} halaman
                {halamanPerHari(kitabTerdekat) !== null && ` · perlu ${halamanPerHari(kitabTerdekat)} halaman per hari`}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}