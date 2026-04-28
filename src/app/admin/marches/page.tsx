'use client'
import React from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { MapPin } from 'lucide-react'

const MARCHES = [
  { name: 'Marché Cocovico', ville: 'Cocody', etals: 412, actifs: 284, status: 'ok' as const, phase: 'Pilote actif' },
  { name: 'Marché Angré',    ville: 'Cocody', etals: 287, actifs: 0,   status: 'pending' as const, phase: 'Déploiement juin 2026' },
  { name: 'Marché Riviera',  ville: 'Cocody', etals: 320, actifs: 0,   status: 'pending' as const, phase: 'Prévu T3 2026' },
]

export default function MarchesPage() {
  return (
    <>
      <TopBar title="Marchés" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1120px] mx-auto w-full">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em] m-0">
            Marchés
          </h1>
          <div className="text-sm text-[var(--fg-3)] mt-1">Commune de Cocody — déploiement progressif</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARCHES.map(m => (
            <Card key={m.name}>
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: m.status === 'ok' ? 'var(--lagune-100)' : 'var(--ink-100)' }}
                >
                  <MapPin
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: m.status === 'ok' ? 'var(--lagune-700)' : 'var(--fg-3)' }}
                  />
                </div>
                <Pill variant={m.status === 'ok' ? 'ok' : 'pending'} dot>
                  {m.phase}
                </Pill>
              </div>
              <div className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.01em] mb-1">
                {m.name}
              </div>
              <div className="text-[13px] text-[var(--fg-3)] mb-4">{m.ville}</div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[var(--bg-sunken)] rounded-[10px] px-3.5 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-3)] font-semibold">Étals totaux</div>
                  <div className="font-[family-name:var(--font-mono)] font-semibold text-[18px] mt-1">{m.etals}</div>
                </div>
                <div className="bg-[var(--bg-sunken)] rounded-[10px] px-3.5 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-3)] font-semibold">Actifs</div>
                  <div
                    className="font-[family-name:var(--font-mono)] font-semibold text-[18px] mt-1"
                    style={{ color: m.actifs > 0 ? 'var(--forest-600)' : 'var(--fg-3)' }}
                  >
                    {m.actifs > 0 ? m.actifs : '—'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
