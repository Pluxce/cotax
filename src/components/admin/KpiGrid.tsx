'use client'
import React from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { KPI_DATA, formatAmount } from '@/lib/mock-data'
import { Pill } from '@/components/ui/Pill'

interface KpiGridProps {
  showAmounts?: boolean
}

export function KpiGrid({ showAmounts = true }: KpiGridProps) {
  const mask = (v: string) => showAmounts ? v : '• • • •'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {/* Recettes du jour — gradient card */}
      <div className="bg-gradient-to-br from-lagune-900 to-lagune-700 rounded-lg border border-transparent p-5 shadow-[var(--elev-1)] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-10 brightness-0 invert"
          style={{ backgroundImage: "url('/assets/pattern-kita.svg')", backgroundSize: 180 }}
        />
        <div className="text-[11px] tracking-[0.06em] uppercase text-white/70 font-semibold mb-2.5 relative z-[1] pr-14">
          Recettes du jour
          <span className="absolute top-[-2px] right-0 inline-flex items-center gap-[3px] bg-white/[0.18] text-forest-200 py-px px-[7px] rounded-[999px] text-[11px] font-[family-name:var(--font-mono)] font-semibold whitespace-nowrap">
            <ArrowUp size={10} /> {KPI_DATA.recettesJourDelta} %
          </span>
        </div>
        <div className="font-[family-name:var(--font-display)] text-[32px] font-semibold text-white tracking-[-0.02em] tabular-nums relative z-[1]">
          {mask(formatAmount(KPI_DATA.recettesJour))}
          <span className="font-[family-name:var(--font-ui)] text-xs font-medium text-white/65 tracking-[0.08em] uppercase ml-1.5">FCFA</span>
        </div>
        <div className="text-xs text-white/70 mt-2 relative z-[1]">
          vs {formatAmount(KPI_DATA.recettesJourRef)} hier · 14 avril 2026
        </div>
      </div>

      {/* Contribuables payés */}
      <KpiCard
        label="Contribuables payés"
        trend={
          <span className="inline-flex items-center gap-[3px] bg-forest-100 text-forest-900 py-px px-2 rounded-[999px] text-[11px] font-[family-name:var(--font-mono)] font-semibold">
            <ArrowUp size={10} /> {KPI_DATA.contribuablesPaiesDelta}
          </span>
        }
        value={
          <>
            {KPI_DATA.contribuablesPaies}
            <span className="font-[family-name:var(--font-ui)] text-xs font-medium text-[var(--fg-3)] tracking-[0.08em] uppercase ml-1.5">
              / {KPI_DATA.contribuablesTotal}
            </span>
          </>
        }
        sub={`${Math.round(KPI_DATA.contribuablesPaies / KPI_DATA.contribuablesTotal * 100)} % du marché Cocovico`}
      />

      {/* En retard */}
      <KpiCard
        label="En retard"
        trend={
          <span className="inline-flex items-center gap-[3px] bg-terra-100 text-terra-900 py-px px-2 rounded-[999px] text-[11px] font-[family-name:var(--font-mono)] font-semibold">
            <ArrowDown size={10} /> +{KPI_DATA.enRetardDelta}
          </span>
        }
        value={
          <>
            {KPI_DATA.enRetard}
            <span className="font-[family-name:var(--font-ui)] text-xs font-medium text-[var(--fg-3)] tracking-[0.08em] uppercase ml-1.5">
              contrib.
            </span>
          </>
        }
        sub="Relances SMS à programmer"
      />

      {/* Réconcilié Trésor */}
      <KpiCard
        label="Réconcilié Trésor"
        trend={<Pill variant="tresor" dot>OK</Pill>}
        value={
          <>
            {showAmounts ? '14,2' : '• •'}
            <span className="font-[family-name:var(--font-ui)] text-xs font-medium text-[var(--fg-3)] tracking-[0.08em] uppercase ml-1.5">
              M FCFA · {KPI_DATA.tresorReconcilie / 1_000_000 > 0 ? KPI_DATA.tresorJours : 0} j
            </span>
          </>
        }
        sub={`Dernier rapprochement : ${KPI_DATA.tresorLastSync}`}
      />
    </div>
  )
}

function KpiCard({ label, trend, value, sub }: {
  label: string
  trend: React.ReactNode
  value: React.ReactNode
  sub: string
}) {
  return (
    <div className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] p-5 shadow-[var(--elev-1)]">
      <div className="text-[11px] tracking-[0.06em] uppercase text-[var(--fg-3)] font-semibold mb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {label}
        <span className="whitespace-nowrap">{trend}</span>
      </div>
      <div className="font-[family-name:var(--font-display)] text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-[var(--fg-1)] tabular-nums break-words">
        {value}
      </div>
      <div className="text-xs text-[var(--fg-3)] mt-2">{sub}</div>
    </div>
  )
}
