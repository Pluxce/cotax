'use client'
import React from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download, FileText, TrendingUp, Users, Landmark } from 'lucide-react'

const REPORTS = [
  {
    icon: TrendingUp,
    title: 'État des recettes journalières',
    desc: 'Détail des paiements par agent, par PSP et par catégorie de taxe.',
    date: '14 avril 2026',
    format: 'PDF · Excel',
    color: 'var(--lagune-100)',
    iconColor: 'var(--lagune-700)',
  },
  {
    icon: Users,
    title: 'Performance des agents',
    desc: 'Classement, nombre de reçus émis, taux de collecte, écarts.',
    date: '14 avril 2026',
    format: 'PDF',
    color: 'var(--forest-100)',
    iconColor: 'var(--forest-700)',
  },
  {
    icon: FileText,
    title: 'Liste des impayés',
    desc: '47 commerçants en retard. Détail des montants et durées de retard.',
    date: '14 avril 2026',
    format: 'Excel · SMS',
    color: 'var(--terra-100)',
    iconColor: 'var(--terra-700)',
  },
  {
    icon: Landmark,
    title: 'État consolidé Trésor',
    desc: 'Réconciliation J+7 avec le Trésor Public. Certification SYSCOHADA.',
    date: '14 avril 2026',
    format: 'PDF certifié',
    color: 'var(--tresor-100)',
    iconColor: 'var(--tresor-700)',
  },
]

export default function RapportsPage() {
  return (
    <>
      <TopBar title="Rapports" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1120px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em] m-0">
              Rapports
            </h1>
            <div className="text-sm text-[var(--fg-3)] mt-1">Exports et états · Exercice 2026</div>
          </div>
          <Button variant="ghost"><Download size={16} />Tout exporter</Button>
        </div>

        {/* Reports grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {REPORTS.map(r => (
            <Card key={r.title} className="flex gap-4 items-start">
              <div
                className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: r.color }}
              >
                <r.icon size={22} strokeWidth={1.5} style={{ color: r.iconColor }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[15px] text-[var(--fg-1)] mb-1">{r.title}</div>
                <div className="text-[13px] text-[var(--fg-3)] leading-relaxed mb-3">{r.desc}</div>
                <div className="flex items-center justify-between gap-2.5 flex-wrap">
                  <div>
                    <div className="text-[11px] text-[var(--fg-3)]">{r.date}</div>
                    <div className="text-[11px] text-[var(--fg-3)] font-[family-name:var(--font-mono)] mt-0.5">{r.format}</div>
                  </div>
                  <Button variant="ghost" style={{ fontSize: 13, padding: '6px 12px' }}>
                    <Download size={14} />Télécharger
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Conseil Municipal section */}
        <Card className="mt-6">
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-cocody.png" alt="Cocody" className="w-10 h-10" />
            <div>
              <div className="text-base font-semibold text-[var(--fg-1)]">Présentation Conseil Municipal</div>
              <div className="text-[13px] text-[var(--fg-3)]">Délibération N°2025-172/CC/CM/SG · Exercice 2026</div>
            </div>
            <Button variant="primary" className="ml-auto max-w-full">
              <FileText size={16} />Ouvrir la présentation
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Recettes cumulées', v: '152,5 M FCFA', trend: '+12 %' },
              { label: 'Taux recouvrement', v: '84,7 %', trend: 'Obj. 90 %' },
              { label: 'Contribuables actifs', v: '12 847', trend: '+340 ce mois' },
              { label: 'Agents déployés', v: '18 agents', trend: 'Phase pilote' },
            ].map(item => (
              <div key={item.label} className="bg-[var(--bg-sunken)] rounded-xl px-4 py-3.5">
                <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--fg-3)] font-semibold mb-1.5">
                  {item.label}
                </div>
                <div className="font-[family-name:var(--font-display)] text-[22px] font-semibold tracking-[-0.02em] text-[var(--fg-1)]">
                  {item.v}
                </div>
                <div className="text-[11px] text-[var(--fg-3)] mt-1 font-[family-name:var(--font-mono)]">
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
