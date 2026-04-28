'use client'

import { Pill } from '@/components/ui/Pill'

interface Payment {
  n: string
  name: string
  stall: string
  psp: string
  amt: string
  status: 'ok' | 'pend'
}

const payments: Payment[] = [
  { n: '2026-04-1847', name: 'Adjoua Kouamé', stall: 'B-214', psp: 'Orange', amt: '15 000', status: 'ok' },
  { n: '2026-04-1846', name: 'Kouadio Yao', stall: 'A-102', psp: 'Wave', amt: '10 000', status: 'ok' },
  { n: '2026-04-1845', name: 'Aïcha Traoré', stall: 'C-54', psp: 'MTN', amt: '15 000', status: 'ok' },
  { n: '2026-04-1844', name: 'Moussa Ouattara', stall: 'B-98', psp: 'Moov', amt: '8 000', status: 'pend' },
]

export function RecentPayments({ showAmounts = true }: { showAmounts?: boolean }) {
  return (
    <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-[22px] pt-5 pb-0 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-ink-900 font-[family-name:var(--font-ui)] mb-0.5">
            Derniers paiements
          </h2>
          <div className="text-[13px] text-ink-500">
            Flux temps réel
          </div>
        </div>
        <Pill variant="ok" dot pulse>
          LIVE
        </Pill>
      </div>

      <table className="w-full border-collapse mt-3">
        <thead>
          <tr>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              N° reçu
            </th>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Contribuable
            </th>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              PSP
            </th>
            <th className="text-right p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Montant
            </th>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((r) => (
            <tr key={r.n} className="hover:bg-ink-50 transition-colors duration-150">
              <td className="p-[12px_14px] text-sm font-[family-name:var(--font-mono)] tabular-nums text-ink-900 border-b border-ink-100">
                {r.n}
              </td>
              <td className="p-[12px_14px] text-sm border-b border-ink-100">
                <div className="font-semibold text-ink-900">{r.name}</div>
                <div className="text-[12px] text-ink-500">Étal {r.stall}</div>
              </td>
              <td className="p-[12px_14px] text-sm text-ink-700 border-b border-ink-100">
                {r.psp}
              </td>
              <td className="p-[12px_14px] text-sm font-[family-name:var(--font-mono)] font-semibold tabular-nums text-ink-900 text-right border-b border-ink-100">
                {showAmounts ? r.amt : '• • •'}
              </td>
              <td className="p-[12px_14px] text-sm border-b border-ink-100">
                {r.status === 'ok' ? (
                  <Pill variant="ok">Payé</Pill>
                ) : (
                  <Pill variant="pending">En cours</Pill>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
