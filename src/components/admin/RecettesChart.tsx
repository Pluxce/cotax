'use client'

interface RecettesChartProps {
  showAmounts?: boolean
}

export function RecettesChart({ showAmounts = true }: RecettesChartProps) {
  const data = [
    { h: '7h', v: 80 }, { h: '8h', v: 180 }, { h: '9h', v: 310 },
    { h: '10h', v: 420 }, { h: '11h', v: 380 }, { h: '12h', v: 190 },
    { h: '13h', v: 150 }, { h: '14h', v: 280 }, { h: '15h', v: 330 },
    { h: '16h', v: 240 }, { h: '17h', v: 150 }, { h: '18h', v: 90 },
  ]

  const max = 500
  const w = 560
  const h = 220
  const pad = { l: 40, r: 10, t: 16, b: 28 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const bw = innerW / data.length

  return (
    <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 p-[22px_24px]">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-ink-900 font-[family-name:var(--font-ui)] mb-0.5">
            Recettes heure par heure
          </h2>
          <div className="text-[13px] text-ink-500">
            Marché Cocovico · 14 avril 2026
          </div>
        </div>
        <div className="flex gap-3.5 text-[12px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-lagune-500 rounded-[2px]" />
            Aujourd'hui
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-[2px] bg-ink-300" />
            Moy. 7j
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} width="100%" className="block font-[family-name:var(--font-mono)]">
        {/* Gridlines */}
        {[0, 125, 250, 375, 500].map((v, i) => (
          <g key={i}>
            <line
              x1={pad.l} y1={pad.t + innerH - (v / max) * innerH}
              x2={w - pad.r} y2={pad.t + innerH - (v / max) * innerH}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray={i === 0 ? '' : '2 3'}
            />
            <text
              x={pad.l - 6} y={pad.t + innerH - (v / max) * innerH + 3}
              textAnchor="end" fontSize="10" fill="var(--fg-3)"
            >
              {showAmounts ? v : '•'}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.v / max) * innerH
          const x = pad.l + i * bw + 3
          const y = pad.t + innerH - barH
          return (
            <rect
              key={i}
              x={x} y={y}
              width={bw - 6} height={barH}
              fill="var(--lagune-500)"
              rx="3"
            />
          )
        })}

        {/* Hour labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={pad.l + i * bw + bw / 2}
            y={pad.t + innerH + 16}
            textAnchor="middle" fontSize="10" fill="var(--fg-3)"
          >
            {d.h}
          </text>
        ))}

        {/* Average line */}
        <polyline
          fill="none" stroke="var(--ink-400)" strokeWidth="1.5" strokeDasharray="4 3"
          points={data.map((d, i) => `${pad.l + i * bw + bw / 2},${pad.t + innerH - ((d.v * 0.82) / max) * innerH}`).join(' ')}
        />
      </svg>
    </div>
  )
}
