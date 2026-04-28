'use client'
import React from 'react'
import { PSP_DATA } from '@/lib/mock-data'
import { Card, CardHead } from '@/components/ui/Card'

interface PSPDonutProps {
  showAmounts?: boolean
}

export function PSPDonut({ showAmounts = true }: PSPDonutProps) {
  const C = 2 * Math.PI * 44
  let offset = 0

  return (
    <Card>
      <CardHead title="Répartition PSP" sub="7 derniers jours" />
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 120 120" width={120} height={120} className="shrink-0">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--ink-100)" strokeWidth="14" />
          {PSP_DATA.map((p, i) => {
            const len = (p.pct / 100) * C
            const el = (
              <circle
                key={i} cx="60" cy="60" r="44" fill="none"
                stroke={p.color} strokeWidth="14"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 60 60)"
                strokeLinecap="butt"
              />
            )
            offset += len
            return el
          })}
          <text
            x="60" y="57" textAnchor="middle"
            fontFamily="var(--font-display)" fontSize="22" fontWeight="600" fill="var(--fg-1)"
          >
            {showAmounts ? '14,2' : '• •'}
          </text>
          <text x="60" y="73" textAnchor="middle" fontSize="9" fill="var(--fg-3)" letterSpacing="1">M FCFA</text>
        </svg>
        <div className="flex-1 flex flex-col gap-1.5">
          {PSP_DATA.map(p => (
            <div key={p.name} className="flex items-center gap-2.5 text-[13px]">
              <span className="w-2.5 h-2.5 rounded-[2px] shrink-0" style={{ background: p.color }} />
              <span className="text-[var(--fg-2)] flex-1">{p.name}</span>
              <span className="font-[family-name:var(--font-mono)] font-semibold text-[var(--fg-1)]">{p.pct} %</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
