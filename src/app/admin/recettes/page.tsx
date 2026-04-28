'use client'
import React, { useState } from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { KpiGrid } from '@/components/admin/KpiGrid'
import { RecettesChart } from '@/components/admin/RecettesChart'
import { PSPDonut } from '@/components/admin/PSPDonut'
import { Card, CardHead } from '@/components/ui/Card'
import { formatAmount } from '@/lib/mock-data'

const MONTHLY = [
  { m: 'Jan', v: 18_200_000 }, { m: 'Fev', v: 21_500_000 }, { m: 'Mar', v: 19_800_000 },
  { m: 'Avr', v: 24_300_000 }, { m: 'Mai', v: 0 }, { m: 'Jun', v: 0 },
]

export default function RecettesPage() {
  const [showAmounts, setShowAmounts] = useState(true)
  const max = Math.max(...MONTHLY.map(d => d.v))

  return (
    <>
      <TopBar title="Recettes" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em] m-0 text-ink-900">
              Recettes
            </h1>
            <div className="text-sm text-ink-500 mt-1">Exercice 2026 · Marche Cocovico</div>
          </div>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer text-ink-700">
            <input
              type="checkbox"
              checked={showAmounts}
              onChange={e => setShowAmounts(e.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: '#1060b0' }}
            />
            Afficher les montants
          </label>
        </div>

        <KpiGrid showAmounts={showAmounts} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
          <RecettesChart showAmounts={showAmounts} />
          <PSPDonut showAmounts={showAmounts} />
        </div>

        {/* Monthly bar chart */}
        <Card>
          <CardHead title="Progression mensuelle 2026" sub="Recettes collectees par mois (k fcfa)" />
          <div className="flex items-end gap-3 h-40 px-2">
            {MONTHLY.map(d => (
              <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5">
                {showAmounts && d.v > 0 && (
                  <span className="text-[10px] text-ink-500 font-[family-name:var(--font-mono)]">
                    {Math.round(d.v / 1_000_000 * 10) / 10}M
                  </span>
                )}
                <div
                  className="w-full rounded-t-[4px]"
                  style={{
                    height: d.v > 0 ? `${(d.v / max) * 130}px` : 4,
                    background: d.v > 0 ? '#1060b0' : '#e7eaef',
                  }}
                />
                <span className="text-[11px] text-ink-500 font-semibold">{d.m}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Target progress */}
        <Card className="mt-4">
          <CardHead title="Objectif annuel 2026" sub="Taux de progression vers les 200 M fcfa" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Collecte a ce jour', value: '83,8 M', pct: 41.9, color: '#1060b0' },
              { label: 'Taux recouvrement', value: '84,7 %', pct: 84.7, color: '#008030', note: 'Objectif : 90 %' },
              { label: 'Contribuables actifs', value: '12 847', pct: 73, color: '#e8a33d' },
            ].map(item => (
              <div key={item.label}>
                <div className="text-[11px] uppercase tracking-[0.08em] text-ink-500 font-semibold mb-2">{item.label}</div>
                <div className="font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-[-0.02em] text-ink-900 mb-2.5">
                  {showAmounts ? item.value : '• • •'}
                </div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
                {item.note && <div className="text-[11px] text-ink-500 mt-1">{item.note}</div>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
