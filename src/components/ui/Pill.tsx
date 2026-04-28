import React from 'react'

type PillVariant = 'ok' | 'late' | 'pending' | 'info' | 'tresor' | 'success' | 'danger' | 'warning' | 'success' | 'danger' | 'warning'
type PillSize = 'sm' | 'md'

const PILL_CLS: Record<PillVariant, string> = {
  ok:      'bg-forest-100 text-forest-900',
  late:    'bg-terra-100  text-terra-900',
  pending: 'bg-ocre-100   text-ocre-800',
  info:    'bg-lagune-100 text-lagune-700',
  tresor:  'bg-tresor-100 text-tresor-700',
  success: 'bg-forest-100 text-forest-900',
  danger:  'bg-terra-100  text-terra-900',
  warning: 'bg-ocre-100   text-ocre-800',
}

const DOT_CLS: Record<PillVariant, string> = {
  ok:      'bg-forest-600',
  late:    'bg-terra-500',
  pending: 'bg-ocre-700',
  info:    'bg-lagune-500',
  tresor:  'bg-tresor-500',
  success: 'bg-forest-600',
  danger:  'bg-terra-500',
  warning: 'bg-ocre-700',
}

const SIZE_CLS: Record<PillSize, string> = {
  sm: 'text-[11px] px-[9px] py-[3px]',
  md: 'text-[12px] px-[11px] py-[4px]',
}

interface PillProps {
  variant?: PillVariant | 'success' | 'danger' | 'warning'
  dot?: boolean
  pulse?: boolean
  size?: PillSize
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export function Pill({ variant = 'ok', dot = false, pulse = false, size = 'sm', children, style, className }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] rounded-[999px] font-semibold tracking-[0.04em] uppercase whitespace-nowrap border border-transparent ${PILL_CLS[variant]} ${SIZE_CLS[size]}${className ? ` ${className}` : ''}`}
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
