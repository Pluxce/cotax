'use client'
import React from 'react'
import { CHART_HOURLY } from '@/lib/mock-data'
import { Card, CardHead } from '@/components/ui/Card'

interface RecettesChartProps {
  showAmounts?: boolean
}

export function RecettesChart({ showAmounts = true }: RecettesChartProps) {
  const max = 500
  const w = 560, h = 220
  const pad = { l: 40, r: 10, t: 16, b: 28 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const bw = innerW / CHART_HOURLY.length

  return (
    <Card>
      <CardHead
        title="Recettes heure par heure"
        sub="Marché Cocovico · 14 avril 2026"
        right={
          <div className="flex gap-3.5 text-xs text-[var(--fg-3)] items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-lagune-500 rounded-[2px] inline-block" />
              Aujourd'hui
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-ink-300 inline-block" />
              Moy. 7j
            </span>
          </div>
        }
      />
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        className="block"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {[0, 125, 250, 375, 500].map((v, i) => (
          <g key={i}>
            <line
              x1={pad.l} x2={w - pad.r}
              y1={pad.t + innerH - (v / max) * innerH}
              y2={pad.t + innerH - (v / max) * innerH}
              stroke="var(--border)" strokeWidth="1"
              strokeDasharray={i === 0 ? undefined : '2 3'}
            />
            <text
              x={pad.l - 6} y={pad.t + innerH - (v / max) * innerH + 3}
              textAnchor="end" fontSize="10" fill="var(--fg-3)"
            >
              {showAmounts ? v : '•'}
            </text>
          </g>
        ))}
        {CHART_HOURLY.map((d, i) => {
          const barH = (d.v / max) * innerH
          const x = pad.l + i * bw + 3
          const y = pad.t + innerH - barH
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw - 6} height={barH} fill="var(--lagune-500)" rx="3" />
              <text x={x + (bw - 6) / 2} y={pad.t + innerH + 16} textAnchor="middle" fontSize="10" fill="var(--fg-3)">
                {d.h}
              </text>
            </g>
          )
        })}
        <polyline
          fill="none" stroke="var(--ink-400)" strokeWidth="1.5" strokeDasharray="4 3"
          points={CHART_HOURLY.map((d, i) =>
            `${pad.l + i * bw + bw / 2},${pad.t + innerH - ((d.v * 0.82) / max) * innerH}`
          ).join(' ')}
        />
      </svg>
    </Card>
  )
}
