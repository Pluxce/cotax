import React from 'react'
import { initials } from '@/lib/mock-data'

interface AvatarProps {
  name: string
  size?: number
  bg?: string
  style?: React.CSSProperties
}

export function Avatar({ name, size = 36, bg = 'var(--lagune-500)', style }: AvatarProps) {
  return (
    <div
      className="rounded-full text-white inline-flex items-center justify-center font-semibold shrink-0 font-[family-name:var(--font-ui)]"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.35, ...style }}
    >
      {initials(name)}
    </div>
  )
}
