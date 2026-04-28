import React from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  noPadding?: boolean
}

export function Card({ children, style, className, noPadding }: CardProps) {
  return (
    <div
      className={[
        'bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] shadow-[var(--elev-1)]',
        noPadding ? '' : 'px-[22px] py-5',
        className ?? '',
      ].join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}

interface CardHeadProps {
  title: string
  sub?: string
  right?: React.ReactNode
}

export function CardHead({ title, sub, right }: CardHeadProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
      <div>
        <div className="text-base font-semibold text-[var(--fg-1)] font-[family-name:var(--font-ui)]">
          {title}
        </div>
        {sub && (
          <div className="text-[13px] text-[var(--fg-3)] mt-0.5">{sub}</div>
        )}
      </div>
      {right}
    </div>
  )
}
