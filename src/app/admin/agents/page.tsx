'use client'
import React from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { AgentsTable } from '@/components/admin/AgentsTable'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Pill } from '@/components/ui/Pill'
import { AGENTS, formatAmount } from '@/lib/mock-data'

export default function AgentsPage() {
  return (
    <>
      <TopBar title="Agents" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1120px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em] m-0">
            Performance des agents
          </h1>
          <div className="text-sm text-[var(--fg-3)] mt-1">18 agents déployés · Phase pilote Cocovico</div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Agents actifs', v: '18', sub: 'Dont 4 contrôleurs', color: 'var(--lagune-500)' },
            { label: 'Total collecté', v: '1 467 500', sub: "FCFA aujourd'hui", color: 'var(--forest-600)' },
            { label: 'Meilleure perf.', v: 'K. Adou', sub: '485 000 FCFA', color: 'var(--ocre-500)' },
            { label: 'Hors-ligne', v: '2', sub: 'Synchronisation en attente', color: 'var(--terra-500)' },
          ].map(item => (
            <div key={item.label} className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] px-5 py-[18px] shadow-[var(--elev-1)]">
              <div className="w-2 h-2 rounded-full mb-2.5" style={{ background: item.color }} />
              <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold mb-2">{item.label}</div>
              <div className="font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-[-0.02em] text-[var(--fg-1)]">
                {item.v}
              </div>
              <div className="text-xs text-[var(--fg-3)] mt-1.5">{item.sub}</div>
            </div>
          ))}
        </div>

        <AgentsTable showAmounts />

        {/* Agent cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {AGENTS.filter(a => a.role === 'Agent').map(a => (
            <Card key={a.id}>
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  name={a.name}
                  size={42}
                  bg={a.perf === 'up' ? 'var(--lagune-500)' : a.perf === 'down' ? 'var(--terra-500)' : 'var(--ink-400)'}
                />
                <div className="flex-1">
                  <div className="font-semibold text-[15px] text-[var(--fg-1)]">{a.name}</div>
                  <div className="text-xs text-[var(--fg-3)]">{a.zone}</div>
                </div>
                <Pill variant={a.perf === 'up' ? 'ok' : a.perf === 'down' ? 'late' : 'info'} dot>
                  {a.trend}
                </Pill>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bg-sunken)] rounded-[10px] px-3.5 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-3)] font-semibold mb-1">Collecté</div>
                  <div className="font-[family-name:var(--font-mono)] font-semibold text-sm text-[var(--fg-1)]">
                    {a.collected ? formatAmount(a.collected) : '—'}
                  </div>
                </div>
                <div className="bg-[var(--bg-sunken)] rounded-[10px] px-3.5 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-3)] font-semibold mb-1">Reçus</div>
                  <div className="font-[family-name:var(--font-mono)] font-semibold text-sm text-[var(--fg-1)]">{a.receipts}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
