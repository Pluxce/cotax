'use client'
import React, { useState } from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { KpiGrid } from '@/components/admin/KpiGrid'
import { RecettesChart } from '@/components/admin/RecettesChart'
import { PSPDonut } from '@/components/admin/PSPDonut'
import { AgentsTable } from '@/components/admin/AgentsTable'
import { RecentPayments } from '@/components/admin/RecentPayments'
import { Button } from '@/components/ui/Button'
import { Download, CheckCircle, WifiOff, RefreshCw, Send } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [showAmounts, setShowAmounts] = useState(true)

  return (
    <>
      <TopBar title="Vue d'ensemble" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1280px] mx-auto w-full">

        {/* Page head */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[30px] font-semibold tracking-[-0.02em] m-0">
              Bonjour, M. le Maire
            </h1>
            <div className="text-sm text-[var(--fg-3)] mt-1">Activité temps réel · Marché Cocovico</div>
          </div>
          <div className="flex gap-2 items-center flex-wrap shrink-0">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer text-[var(--fg-2)] select-none">
              <input
                type="checkbox"
                checked={showAmounts}
                onChange={e => setShowAmounts(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: 'var(--lagune-500)' }}
              />
              Afficher les montants
            </label>
            <Button variant="ghost" className="hidden sm:inline-flex"><Download size={16} />Exporter</Button>
            <Button variant="primary">
              <CheckCircle size={16} />
              <span className="hidden sm:inline">Valider la journée</span>
              <span className="sm:hidden">Valider</span>
            </Button>
          </div>
        </div>

        {/* Alert banners */}
        <Link href="/admin/recouvrement" className="no-underline">
          <div className="flex items-center gap-3 px-[18px] py-[13px] rounded-md text-sm mb-3 text-white flex-wrap cursor-pointer"
            style={{ background: 'var(--lagune-900)' }}>
            <Send size={16} strokeWidth={1.5} className="shrink-0 opacity-80" />
            <span className="flex-1">
              <b>782 contribuables en retard</b> · 15,3 M FCFA d&apos;impayés.{' '}
              <span className="hidden sm:inline font-semibold" style={{ color: 'var(--ocre-300)' }}>Lancer les relances SMS →</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm mb-5 flex-wrap border-l-[3px]"
          style={{ background: 'var(--ocre-100)', color: 'var(--ocre-900)', borderLeftColor: 'var(--ocre-700)' }}>
          <WifiOff size={18} strokeWidth={1.5} />
          <span className="flex-1">
            <b>Mode hors-ligne — 2 agents.</b>
            <span className="hidden sm:inline"> 6 paiements en attente.</span>
          </span>
          <a href="#" className="hidden sm:flex ml-auto text-[13px] font-semibold py-[5px] px-3 rounded-lg items-center gap-1.5 no-underline"
            style={{ background: 'rgba(255,255,255,0.55)', color: 'inherit' }}>
            Synchro <RefreshCw size={14} />
          </a>
        </div>

        {/* KPIs */}
        <KpiGrid showAmounts={showAmounts} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-5">
          <RecettesChart showAmounts={showAmounts} />
          <PSPDonut showAmounts={showAmounts} />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-6">
          <AgentsTable showAmounts={showAmounts} />
          <RecentPayments showAmounts={showAmounts} />
        </div>

        {/* Mobile companion promo */}
        <div
          className="rounded-lg flex justify-center items-start gap-10 flex-wrap px-5 py-7 lg:py-10 lg:px-6"
          style={{
            background: 'var(--ink-950)',
            backgroundImage: "url('/assets/pattern-kita.svg')",
            backgroundSize: 220,
          }}
        >
          <div className="text-white max-w-[280px] lg:pt-8">
            <div className="text-[11px] tracking-[0.08em] uppercase font-semibold mb-2.5" style={{ color: 'var(--ocre-300)' }}>
              Vue mobile
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white m-0 mb-2.5 tracking-[-0.01em]">
              Pilotage en déplacement
            </h3>
            <p className="text-white/80 text-sm leading-relaxed m-0">
              Les KPIs essentiels et l&apos;état de la réconciliation Trésor, en un coup d&apos;œil depuis votre smartphone.
            </p>
            <Button
              variant="ghost"
              className="mt-5"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
            >
              Ouvrir sur mobile
            </Button>
          </div>

          {/* Phone mockup — hidden on small screens */}
          <div className="hidden lg:block w-[220px] bg-[#0A0F15] rounded-[28px] border-[6px] border-[#1E2631] overflow-hidden shrink-0">
            <div className="h-6 bg-[#0A0F15] flex justify-between items-center px-3.5 text-[10px] text-white/50">
              <span>9:41</span><span>●●●</span>
            </div>
            <div className="p-4 relative" style={{ background: 'linear-gradient(135deg, var(--lagune-900), var(--lagune-700))' }}>
              <div className="text-[9px] text-white/60 uppercase tracking-[0.06em] mb-1.5">Recettes du jour</div>
              <div className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white tracking-[-0.02em]">
                2 430 000
              </div>
              <div className="text-[9px] text-white/50 mt-0.5">FCFA · 14 avr. 2026</div>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {[
                { l: 'Payés', v: '284 / 412', c: 'var(--forest-400)' },
                { l: 'En retard', v: '47', c: 'var(--terra-400)' },
                { l: 'Trésor', v: 'À jour ✓', c: 'rgba(255,255,255,0.7)' },
              ].map(item => (
                <div key={item.l} className="flex justify-between text-[11px] py-1 border-b border-white/[0.06]">
                  <span className="text-white/50">{item.l}</span>
                  <span className="font-[family-name:var(--font-mono)] font-semibold" style={{ color: item.c }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
