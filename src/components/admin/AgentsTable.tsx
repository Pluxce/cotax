import React from 'react'
import { AGENTS, formatAmount } from '@/lib/mock-data'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'

interface AgentsTableProps {
  showAmounts?: boolean
}

export function AgentsTable({ showAmounts = true }: AgentsTableProps) {
  return (
    <Card noPadding>
      <div className="px-[22px] pt-5">
        <div className="text-base font-semibold text-[var(--fg-1)] font-[family-name:var(--font-ui)]">
          Performance des agents
        </div>
        <div className="text-[13px] text-[var(--fg-3)] mt-0.5">Aujourd'hui · par montant collecté</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-3" style={{ minWidth: 540 }}>
          <thead>
            <tr>
              {['Agent', 'Zone', 'Collecté', 'Reçus', 'Tendance'].map((h, i) => (
                <th
                  key={h}
                  className="py-2.5 px-3.5 text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold border-b border-[var(--border)]"
                  style={{ textAlign: i >= 2 && i <= 3 ? 'right' : 'left' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGENTS.map(a => (
              <tr key={a.id}>
                <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      name={a.name}
                      size={30}
                      bg={a.role === 'Contrôleur' ? 'var(--forest-600)' : 'var(--lagune-500)'}
                    />
                    <div>
                      <div className="font-semibold text-sm text-[var(--fg-1)]">{a.name}</div>
                      <div className="text-xs text-[var(--fg-3)]">{a.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3.5 text-sm text-[var(--fg-2)] border-b border-[var(--border-subtle)]">
                  {a.zone}
                </td>
                <td className="py-3 px-3.5 text-right font-[family-name:var(--font-mono)] tabular-nums font-semibold text-sm border-b border-[var(--border-subtle)]">
                  {a.collected !== null ? (showAmounts ? formatAmount(a.collected) : '• • •') : '—'}
                  {a.collected !== null && (
                    <span className="text-[11px] text-[var(--fg-3)] font-normal ml-[3px]">FCFA</span>
                  )}
                </td>
                <td className="py-3 px-3.5 text-right font-[family-name:var(--font-mono)] text-sm border-b border-[var(--border-subtle)]">
                  {a.receipts}
                </td>
                <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                  <Pill variant={a.perf === 'up' ? 'ok' : a.perf === 'down' ? 'late' : 'info'} dot>
                    {a.trend}
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
