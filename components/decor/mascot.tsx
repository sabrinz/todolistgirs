"use client"

import { motion } from "framer-motion"

type Props = { size?: number; float?: boolean }

const blink = {
  animate: { scaleY: [1, 1, 0.1, 1] },
  transition: { repeat: Infinity, duration: 4.5, times: [0, 0.92, 0.96, 1] },
}

const floatAnim = (on: boolean) =>
  on
    ? {
        animate: { y: [0, -5, 0] },
        transition: { repeat: Infinity, duration: 3.4, ease: "easeInOut" as const },
      }
    : {}

export function BunnyMascot({ size = 120, float = true }: Props) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" {...floatAnim(float)}>
      <ellipse cx={45} cy={38} rx={9} ry={23} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} transform="rotate(-12 45 38)" />
      <ellipse cx={45} cy={40} rx={4} ry={15} fill="var(--tdp-primary-soft)" transform="rotate(-12 45 40)" />
      <ellipse cx={75} cy={38} rx={9} ry={23} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} transform="rotate(12 75 38)" />
      <ellipse cx={75} cy={40} rx={4} ry={15} fill="var(--tdp-primary-soft)" transform="rotate(12 75 40)" />
      <circle cx={60} cy={72} r={32} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <ellipse cx={41} cy={79} rx={7} ry={4.5} fill="var(--tdp-primary-soft)" opacity={0.75} />
      <ellipse cx={79} cy={79} rx={7} ry={4.5} fill="var(--tdp-primary-soft)" opacity={0.75} />
      <motion.g style={{ transformOrigin: "60px 68px" }} {...blink}>
        <circle cx={49} cy={68} r={4.2} fill="var(--tdp-primary-ink)" />
        <circle cx={71} cy={68} r={4.2} fill="var(--tdp-primary-ink)" />
        <circle cx={50.5} cy={66.5} r={1.5} fill="#fff" />
        <circle cx={72.5} cy={66.5} r={1.5} fill="#fff" />
      </motion.g>
      <path d="M56 77 L64 77 L60 81.5 Z" fill="var(--tdp-primary)" />
      <path d="M60 82 Q55 87 51 83" stroke="var(--tdp-primary-ink)" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M60 82 Q65 87 69 83" stroke="var(--tdp-primary-ink)" strokeWidth={2} fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}

export function BearMascot({ size = 120, float = true }: Props) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" {...floatAnim(float)}>
      <circle cx={36} cy={44} r={14} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <circle cx={36} cy={44} r={7} fill="var(--tdp-primary-soft)" />
      <circle cx={84} cy={44} r={14} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <circle cx={84} cy={44} r={7} fill="var(--tdp-primary-soft)" />
      <circle cx={60} cy={72} r={32} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <ellipse cx={38} cy={76} rx={6} ry={4} fill="var(--tdp-primary-soft)" opacity={0.7} />
      <ellipse cx={82} cy={76} rx={6} ry={4} fill="var(--tdp-primary-soft)" opacity={0.7} />
      <ellipse cx={60} cy={81} rx={17} ry={13} fill="var(--tdp-primary-soft)" opacity={0.55} />
      <motion.g style={{ transformOrigin: "60px 65px" }} {...blink}>
        <circle cx={48} cy={65} r={4} fill="var(--tdp-primary-ink)" />
        <circle cx={72} cy={65} r={4} fill="var(--tdp-primary-ink)" />
        <circle cx={49.3} cy={63.6} r={1.4} fill="#fff" />
        <circle cx={73.3} cy={63.6} r={1.4} fill="#fff" />
      </motion.g>
      <ellipse cx={60} cy={76} rx={5.5} ry={4} fill="var(--tdp-primary)" />
      <path d="M60 80 Q55 85 51 81" stroke="var(--tdp-primary-ink)" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M60 80 Q65 85 69 81" stroke="var(--tdp-primary-ink)" strokeWidth={2} fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}

export function CatMascot({ size = 120, float = true }: Props) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" {...floatAnim(float)}>
      <path d="M33 58 L34 26 L58 44 Z" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <path d="M38 52 L38 34 L52 45 Z" fill="var(--tdp-primary-soft)" />
      <path d="M87 58 L86 26 L62 44 Z" fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <path d="M82 52 L82 34 L68 45 Z" fill="var(--tdp-primary-soft)" />
      <circle cx={60} cy={70} r={32} fill="var(--tdp-card)" stroke="var(--tdp-primary-soft)" strokeWidth={3} />
      <ellipse cx={39} cy={77} rx={6.5} ry={4} fill="var(--tdp-primary-soft)" opacity={0.75} />
      <ellipse cx={81} cy={77} rx={6.5} ry={4} fill="var(--tdp-primary-soft)" opacity={0.75} />
      <motion.g style={{ transformOrigin: "60px 67px" }} {...blink}>
        <circle cx={49} cy={67} r={4.2} fill="var(--tdp-primary-ink)" />
        <circle cx={71} cy={67} r={4.2} fill="var(--tdp-primary-ink)" />
        <circle cx={50.5} cy={65.5} r={1.5} fill="#fff" />
        <circle cx={72.5} cy={65.5} r={1.5} fill="#fff" />
      </motion.g>
      <path d="M56 75 L64 75 L60 79.5 Z" fill="var(--tdp-primary)" />
      <path d="M60 80 Q55 85 51 81" stroke="var(--tdp-primary-ink)" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M60 80 Q65 85 69 81" stroke="var(--tdp-primary-ink)" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M28 72 L40 74 M28 80 L40 79" stroke="var(--tdp-primary-soft)" strokeWidth={2} strokeLinecap="round" />
      <path d="M92 72 L80 74 M92 80 L80 79" stroke="var(--tdp-primary-soft)" strokeWidth={2} strokeLinecap="round" />
    </motion.svg>
  )
}