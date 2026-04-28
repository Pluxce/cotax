import React from 'react'
import { RECENT_PAYMENTS, formatAmount } from '@/lib/mock-data'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'

interface RecentPaymentsProps {
  showAmounts?: boolean
}

export function RecentPayments({ showAmounts = true }: RecentPaymentsProps) {
  return (
    <Card noPadding>
      <div className="px-[22px] pt-5 flex items-start justify-between gap-2.5 flex-wrap">
        <div>
          <div className="text-base font-semibold text-[var(--fg-1)] font-[family-name:var(--font-ui)]">
            Derniers paiements
          </div>
          <div className="text-[13px] text-[var(--fg-3)] mt-0.5">Flux temps réel</div>
        </div>
        <Pill variant="ok" dot pulse>LIVE</Pill>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-3" style={{ minWidth: 480 }}>
          <thead>
            <tr>
              {['N° reçu', 'Contribuable', 'PSP', 'Montant', 'Statut'].map((h, i) => (
                <th
                  key={h}
                  className="py-2.5 px-3.5 text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold border-b border-[var(--border)]"
                  style={{ textAlign: i === 3 ? 'right' : 'left' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_PAYMENTS.map(r => (
              <tr key={r.receiptNum}>
                <td className="py-3 px-3.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--fg-1)] border-b border-[var(--border-subtle)]">
                  {r.receiptNum}
                </td>
                <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                  <div className="font-semibold text-sm text-[var(--fg-1)]">{r.contribuable}</div>
                  <div className="text-xs text-[var(--fg-3)]">Étal {r.stall}</div>
                </td>
                <td className="py-3 px-3.5 text-sm text-[var(--fg-2)] border-b border-[var(--border-subtle)]">
                  {r.psp}
                </td>
                <td className="py-3 px-3.5 text-right font-[family-name:var(--font-mono)] tabular-nums font-semibold text-sm border-b border-[var(--border-subtle)]">
                  {showAmounts ? formatAmount(r.amount) : '• • •'}
                </td>
                <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                  <Pill variant={r.status === 'ok' ? 'ok' : 'pending'} dot>
                    {r.status === 'ok' ? 'Payé' : 'En cours'}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
