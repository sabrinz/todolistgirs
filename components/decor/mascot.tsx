"use client"

import { motion } from "framer-motion"

type Props = { size?: number; float?: boolean }

const blink = {
  animate: { scaleY: [1, 1, 0.1, 1] },
  transition: { repeat: Infinity, duration: 4.5, times: [0, 0.92, 0.96, 1] },
}

const floatAnim = (on: boolean) =>
  on
    ? { animate: { y: [0, -5, 0] }, transition: { repeat: Infinity, duration: 3.4, ease: "easeInOut" as const } }
    : {}

/* Kelinci */
export function BunnyMascot({ size = 120, float = true }: Props) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" {...floatAnim(float)}>
      <ellipse cx="45" cy="32" rx="9" ry="23" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" transform="rotate(-12 45 32)" />
      <ellipse cx="45" cy="32" rx="4" ry="15" fill="var(--tdp-primary-soft)" transform="rotate(-12 45 32)" />
      <ellipse cx="75" cy="32" rx="9" ry="23" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" transform="rotate(12 75 32)" />
      <ellipse cx="75" cy="32" rx="4" ry="15" fill="var(--tdp-primary-soft)" transform="rotate(12 75 32)" />

      <circle cx="60" cy="72" r="32" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" />

      <ellipse cx="41" cy="79" rx="7" ry="4.5" fill="var(--tdp-primary-soft)" />
      <ellipse cx="79" cy="79" rx="7" ry="4.5" fill="var(--tdp-primary-soft)" />

      <motion.g {...blink} style={{ transformOrigin: "60px 68px" }}>
        <circle cx="49" cy="68" r="4.2" fill="var(--tdp-primary-ink)" />
        <circle cx="71" cy="68" r="4.2" fill="var(--tdp-primary-ink)" />
        <circle cx="50.6" cy="66.4" r="1.5" fill="#fff" />
        <circle cx="72.6" cy="66.4" r="1.5" fill="#fff" />
      </motion.g>

      <path d="M56 77 L64 77 L60 81.5 Z" fill="var(--tdp-primary)" />
      <path d="M60 81.5 q-4.5 5.5 -9 1.5" stroke="var(--tdp-primary-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M60 81.5 q4.5 5.5 9 1.5" stroke="var(--tdp-primary-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}

/* Beruang */
export function BearMascot({ size = 120, float = true }: Props) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" {...floatAnim(float)}>
      <circle cx="36" cy="44" r="14" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" />
      <circle cx="36" cy="44" r="7" fill="var(--tdp-primary-soft)" />
      <circle cx="84" cy="44" r="14" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" />
      <circle cx="84" cy="44" r="7" fill="var(--tdp-primary-soft)" />

      <circle cx="60" cy="70" r="32" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" />

      <ellipse cx="38" cy="76" rx="7" ry="4.5" fill="var(--tdp-primary-soft)" />
      <ellipse cx="82" cy="76" rx="7" ry="4.5" fill="var(--tdp-primary-soft)" />
      <ellipse cx="60" cy="81" rx="17" ry="13" fill="var(--tdp-primary-soft)" opacity="0.55" />

      <motion.g {...blink} style={{ transformOrigin: "60px 65px" }}>
        <circle cx="48" cy="65" r="4.2" fill="var(--tdp-primary-ink)" />
        <circle cx="72" cy="65" r="4.2" fill="var(--tdp-primary-ink)" />
        <circle cx="49.6" cy="63.4" r="1.5" fill="#fff" />
        <circle cx="73.6" cy="63.4" r="1.5" fill="#fff" />
      </motion.g>

      <ellipse cx="60" cy="76" rx="5.5" ry="4" fill="var(--tdp-primary-ink)" />
      <path d="M60 80 q-5 6 -9.5 1" stroke="var(--tdp-primary-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M60 80 q5 6 9.5 1" stroke="var(--tdp-primary-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}

/* Kucing */
export function CatMascot({ size = 120, float = true }: Props) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" {...floatAnim(float)}>
      <path d="M33 58 L34 26 L58 44 Z" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M39 51 L40 35 L52 45 Z" fill="var(--tdp-primary-soft)" />
      <path d="M87 58 L86 26 L62 44 Z" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M81 51 L80 35 L68 45 Z" fill="var(--tdp-primary-soft)" />

      <circle cx="60" cy="70" r="32" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth="3" />

      <ellipse cx="39" cy="77" rx="7" ry="4.5" fill="var(--tdp-primary-soft)" />
      <ellipse cx="81" cy="77" rx="7" ry="4.5" fill="var(--tdp-primary-soft)" />

      <motion.g {...blink} style={{ transformOrigin: "60px 67px" }}>
        <circle cx="49" cy="67" r="4.2" fill="var(--tdp-primary-ink)" />
        <circle cx="71" cy="67" r="4.2" fill="var(--tdp-primary-ink)" />
        <circle cx="50.6" cy="65.4" r="1.5" fill="#fff" />
        <circle cx="72.6" cy="65.4" r="1.5" fill="#fff" />
      </motion.g>

      <path d="M56.5 76 L63.5 76 L60 79.5 Z" fill="var(--tdp-primary)" />
      <path d="M60 79.5 q-4 5 -8 1" stroke="var(--tdp-primary-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M60 79.5 q4 5 8 1" stroke="var(--tdp-primary-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      <path d="M28 72 L40 74 M28 80 L40 79" stroke="var(--tdp-primary-soft)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M92 72 L80 74 M92 80 L80 79" stroke="var(--tdp-primary-soft)" strokeWidth="2.2" strokeLinecap="round" />
    </motion.svg>
  )
}