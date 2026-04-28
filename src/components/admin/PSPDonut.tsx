'use client'

interface PSPDonutProps {
  showAmounts?: boolean
}

export function PSPDonut({ showAmounts = true }: PSPDonutProps) {
  const psp = [
    { name: 'Orange Money', pct: 42, color: '#FF7900' },
    { name: 'Wave', pct: 28, color: '#1DC9F5' },
    { name: 'MTN Money', pct: 18, color: '#FFCC00' },
    { name: 'Moov Money', pct: 8, color: '#00A0E9' },
    { name: 'Espèces', pct: 4, color: '#6B7583' },
  ]

  let offset = 0
  const C = 2 * Math.PI * 44

  return (
    <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-ink-900 font-[family-name:var(--font-ui)] mb-0.5">
            Répartition PSP
          </h2>
          <div className="text-[13px] text-ink-500">
            7 derniers jours
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <svg viewBox="0 0 120 120" width="120" height="120" className="shrink-0">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--ink-100)" strokeWidth="14" />
          {psp.map((p, i) => {
            const len = (p.pct / 100) * C
            const el = (
              <circle
                key={i}
                cx="60" cy="60" r="44"
                fill="none" stroke={p.color} strokeWidth="14"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 60 60)"
                strokeLinecap="butt"
              />
            )
            offset += len
            return el
          })}
          <text x="60" y="58" textAnchor="middle"
            fontFamily="var(--font-display)" fontSize="22" fontWeight="600" fill="var(--fg-1)">
            {showAmounts ? '14,2' : '• •'}
          </text>
          <text x="60" y="74" textAnchor="middle" fontSize="9" fill="var(--fg-3)" letterSpacing="1">
            M FCFA
          </text>
        </svg>

        <div className="flex-1 flex flex-col gap-1.5">
          {psp.map((p) => (
            <div key={p.name} className="flex items-center gap-2.5 text-sm min-w-0">
              <span className="w-2.5 h-2.5 rounded-[2px] shrink-0" style={{ background: p.color }} />
              <span className="text-ink-700 flex-1 min-w-0 truncate">{p.name}</span>
              <span className="font-[family-name:var(--font-mono)] font-semibold text-ink-900 shrink-0 whitespace-nowrap">{p.pct} %</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
