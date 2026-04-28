'use client'

import { IcoArrowUp, IcoArrowDown } from '@/components/ui/Icons'
import { Pill } from '@/components/ui/Pill'

interface KpiProps {
  showAmounts?: boolean
}

const AMOUNT_CLS =
  'font-[family-name:var(--font-display)] font-semibold tracking-[-0.02em] tabular-nums whitespace-nowrap leading-none ' +
  'text-[clamp(22px,2.2vw,32px)] text-ink-900'

const UNIT_CLS =
  'font-[family-name:var(--font-ui)] font-medium tracking-[0.08em] uppercase ml-1.5 text-[11px] text-ink-500'

const TREND_CLS =
  'font-[family-name:var(--font-mono)] text-[11px] font-semibold px-2 py-px rounded-full inline-flex items-center gap-[3px] whitespace-nowrap'

export function KpiGrid({ showAmounts = true }: KpiProps) {
  const mask = (n: string) => (showAmounts ? n : '• • •')

  return (
    <div className="grid gap-4 mb-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1 — Highlighted (lagune gradient + kita) */}
      <div className="relative overflow-hidden rounded-[16px] p-5 bg-gradient-to-br from-lagune-900 to-lagune-700 text-white shadow-elev-1">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/pattern-kita.svg')",
            backgroundSize: '180px',
            filter: 'brightness(0) invert(1)',
          }}
        />
        <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-white/70 truncate">
            Recettes du jour
          </span>
          <span className={`${TREND_CLS} bg-white/15 text-forest-100`}>
            <IcoArrowUp size={10} /> 12,4 %
          </span>
        </div>
        <div className={`${AMOUNT_CLS} text-white relative z-10`}>
          {mask('2 430 000')}
          <span className={`${UNIT_CLS} text-white/70`}>FCFA</span>
        </div>
        <div className="text-[12px] mt-2 text-white/70 relative z-10 truncate">
          vs 2 162 000 hier · 14 avril 2026
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-paper-0 rounded-[16px] p-5 border border-ink-100 shadow-elev-1">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-ink-500 truncate">
            Contribuables payés
          </span>
          <span className={`${TREND_CLS} bg-forest-100 text-forest-900`}>
            <IcoArrowUp size={10} /> 18
          </span>
        </div>
        <div className={AMOUNT_CLS}>
          {mask('284')}<span className={UNIT_CLS}>/ 412</span>
        </div>
        <div className="text-[12px] text-ink-500 mt-2 truncate">
          69 % du marché Cocovico
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-paper-0 rounded-[16px] p-5 border border-ink-100 shadow-elev-1">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-ink-500 truncate">
            En retard
          </span>
          <span className={`${TREND_CLS} bg-terra-100 text-terra-900`}>
            <IcoArrowDown size={10} /> +3
          </span>
        </div>
        <div className={AMOUNT_CLS}>
          {mask('47')}<span className={UNIT_CLS}>comm.</span>
        </div>
        <div className="text-[12px] text-ink-500 mt-2 truncate">
          Relances SMS à programmer
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-paper-0 rounded-[16px] p-5 border border-ink-100 shadow-elev-1">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] tracking-[0.08em] uppercase font-semibold text-ink-500 truncate">
            Réconcilié Trésor
          </span>
          <Pill variant="info" dot>OK</Pill>
        </div>
        <div className={AMOUNT_CLS}>
          {mask('14,2')}<span className={UNIT_CLS}>M FCFA · 7 j</span>
        </div>
        <div className="text-[12px] text-ink-500 mt-2 truncate">
          Dernier rapprochement : hier 22h
        </div>
      </div>
    </div>
  )
}
