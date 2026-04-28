'use client'

import { IcoDots } from '@/components/ui/Icons'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'

interface Agent {
  name: string
  role: string
  market: string
  collected: string
  count: number
  perf: 'up' | 'down' | 'flat'
  trend: string
}

interface AgentsTableProps {
  showAmounts?: boolean
}

const agents: Agent[] = [
  { name: 'Kouadio Adou', role: 'Agent', market: 'Cocovico A', collected: '485 000', count: 42, perf: 'up', trend: '+18%' },
  { name: 'Aïcha Bamba', role: 'Agent', market: 'Cocovico B', collected: '412 500', count: 38, perf: 'up', trend: '+9%' },
  { name: 'Yao Koffi', role: 'Agent', market: 'Cocovico C', collected: '356 000', count: 29, perf: 'flat', trend: '0%' },
  { name: 'Marie Diallo', role: 'Contr.', market: 'Brigade', collected: '—', count: 12, perf: 'flat', trend: '12 vérif.' },
  { name: 'Sékou Traoré', role: 'Agent', market: 'Cocovico D', collected: '214 000', count: 19, perf: 'down', trend: '-14%' },
]

export function AgentsTable({ showAmounts = true }: AgentsTableProps) {
  return (
    <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-[22px] pt-5 pb-0 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-ink-900 font-[family-name:var(--font-ui)] mb-0.5">
            Performance des agents
          </h2>
          <div className="text-[13px] text-ink-500">
            Aujourd'hui · par montant collecté
          </div>
        </div>
        <button className="px-[10px] py-[5px] rounded-[10px] border-0 bg-transparent text-ink-700 hover:bg-ink-50 inline-flex items-center gap-1 cursor-pointer transition-colors duration-150">
          <IcoDots size={14} />
        </button>
      </div>

      <table className="w-full border-collapse mt-3">
        <thead>
          <tr>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Agent
            </th>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Zone
            </th>
            <th className="text-right p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Collecté
            </th>
            <th className="text-right p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Reçus
            </th>
            <th className="text-left p-[10px_14px] text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-200">
              Tendance
            </th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.name} className="hover:bg-ink-50 transition-colors duration-150">
              <td className="p-[12px_14px] text-sm text-ink-900 border-b border-ink-100">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    name={a.name}
                    bg={a.role === 'Contr.' ? 'var(--forest-600)' : 'var(--lagune-500)'}
                    style={{ width: 30, height: 30, fontSize: 11 }}
                  />
                  <div>
                    <div className="font-semibold text-ink-900">{a.name}</div>
                    <div className="text-[12px] text-ink-500">{a.role}</div>
                  </div>
                </div>
              </td>
              <td className="p-[12px_14px] text-sm text-ink-700 border-b border-ink-100">
                {a.market}
              </td>
              <td className="p-[12px_14px] text-sm text-ink-900 border-b border-ink-100 text-right font-[family-name:var(--font-mono)] font-semibold tabular-nums">
                {showAmounts ? a.collected : '• • •'} <span className="text-[11px] text-ink-500 font-medium">FCFA</span>
              </td>
              <td className="p-[12px_14px] text-sm text-ink-900 border-b border-ink-100 text-right font-[family-name:var(--font-mono)]">
                {a.count}
              </td>
              <td className="p-[12px_14px] text-sm border-b border-ink-100">
                <Pill variant={a.perf === 'up' ? 'ok' : a.perf === 'down' ? 'late' : 'info'}>
                  {a.trend}
                </Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
