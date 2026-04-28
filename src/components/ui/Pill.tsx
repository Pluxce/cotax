import React from 'react'

type PillVariant = 'ok' | 'late' | 'pending' | 'info' | 'tresor'

const PILL_CLS: Record<PillVariant, string> = {
  ok:      'bg-forest-100 text-forest-900',
  late:    'bg-terra-100  text-terra-900',
  pending: 'bg-ocre-100   text-ocre-900',
  info:    'bg-lagune-100 text-lagune-700',
  tresor:  'bg-tresor-100 text-tresor-700',
}

const DOT_CLS: Record<PillVariant, string> = {
  ok:      'bg-forest-600',
  late:    'bg-terra-500',
  pending: 'bg-ocre-700',
  info:    'bg-lagune-500',
  tresor:  'bg-tresor-500',
}

interface PillProps {
  variant: PillVariant
  dot?: boolean
  pulse?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

export function Pill({ variant, dot = false, pulse = false, children, style }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-[999px] text-[11px] font-semibold tracking-[0.04em] uppercase whitespace-nowrap ${PILL_CLS[variant]}`}
      style={style}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_CLS[variant]}`}
          style={pulse ? { animation: 'live-pulse 2s infinite' } : undefined}
        />
      )}
      {children}
    </span>
  )
}
