'use client'
import React from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { DOSSIERS_RETARD, KPI_RECOUVREMENT, formatAmount } from '@/lib/mock-data'
import { AlertTriangle, MessageSquare, Send, Phone, FileText } from 'lucide-react'

const relanceLabel: Record<string, string> = {
  urgent: 'Urgent',
  avertissement: 'Avertissement',
  en_cours: 'En cours',
  resolue: 'Résolue',
}
const relancePill: Record<string, 'late' | 'pending' | 'info' | 'ok'> = {
  urgent: 'late',
  avertissement: 'pending',
  en_cours: 'info',
  resolue: 'ok',
}

export default function RecouvrementPage() {
  return (
    <>
      <TopBar title="Recouvrement" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1120px] mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em]">
            Recouvrement &amp; Relances
          </h1>
          <div className="text-sm text-ink-500 mt-1">
            Suivi des impayés · Marché Cocovico · Avril 2026
          </div>
        </div>

        {/* SYSCOHADA Art. 62 alert */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-[12px] mb-6 border-l-[3px] border-terra-500 bg-terra-50">
          <AlertTriangle size={20} strokeWidth={1.5} className="shrink-0 text-terra-600 mt-0.5" />
          <div className="flex-1 min-w-0 text-[14px] text-terra-900 leading-snug">
            <span className="font-semibold">SYSCOHADA Art. 62 — Créances à risque.</span>{' '}
            134 dossiers dépassent 30 jours d&rsquo;impayés et doivent faire l&rsquo;objet d&rsquo;une provision pour dépréciation avant clôture du trimestre.
          </div>
          <Button variant="ghost" className="shrink-0 hidden sm:inline-flex">
            <FileText size={15} /> Générer provision
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Total impayés */}
          <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 p-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold mb-2">
              Total impayés
            </div>
            <div className="font-[family-name:var(--font-display)] text-[clamp(24px,2.4vw,32px)] leading-none font-semibold tracking-[-0.02em] text-terra-700 tabular-nums whitespace-nowrap">
              15,3 M
              <span className="font-[family-name:var(--font-ui)] text-[11px] text-ink-500 ml-1.5 tracking-[0.08em] uppercase font-medium">
                FCFA
              </span>
            </div>
            <div className="text-[12px] text-ink-500 mt-2 font-[family-name:var(--font-mono)] tabular-nums">
              {formatAmount(KPI_RECOUVREMENT.totalImpayes)} FCFA
            </div>
          </div>

          {/* Contribuables en retard */}
          <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 p-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold mb-2">
              Contribuables en retard
            </div>
            <div className="font-[family-name:var(--font-display)] text-[clamp(24px,2.4vw,32px)] leading-none font-semibold tracking-[-0.02em] text-ink-900 tabular-nums whitespace-nowrap">
              {KPI_RECOUVREMENT.contribuablesEnRetard}
              <span className="font-[family-name:var(--font-ui)] text-[11px] text-ink-500 ml-2 font-medium">dont</span>
              <span className="text-[20px] text-terra-600 ml-1">{KPI_RECOUVREMENT.enRetardPlus30j}</span>
              <span className="font-[family-name:var(--font-ui)] text-[11px] text-terra-600 ml-1 font-medium">&gt; 30 j</span>
            </div>
            <div className="text-[12px] text-ink-500 mt-2 truncate">
              Contribuables enregistrés au marché Cocovico
            </div>
          </div>

          {/* SMS relances */}
          <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 p-5">
            <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold mb-2">
              SMS relances envoyés
            </div>
            <div className="font-[family-name:var(--font-display)] text-[clamp(24px,2.4vw,32px)] leading-none font-semibold tracking-[-0.02em] text-ink-900 tabular-nums whitespace-nowrap">
              {KPI_RECOUVREMENT.smsEnvoyes.toLocaleString('fr-FR')}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-500 rounded-full transition-[width] duration-300"
                  style={{ width: `${KPI_RECOUVREMENT.tauxReponse}%` }}
                />
              </div>
              <span className="text-[11px] text-forest-700 font-semibold font-[family-name:var(--font-mono)] tabular-nums whitespace-nowrap">
                {KPI_RECOUVREMENT.tauxReponse} %
              </span>
              <span className="text-[11px] text-ink-500 whitespace-nowrap">réponse</span>
            </div>
          </div>
        </div>

        {/* Batch action bar — lagune gradient + kita pattern */}
        <div className="relative overflow-hidden flex items-center gap-4 px-5 py-4 rounded-[16px] mb-5 flex-wrap bg-gradient-to-br from-lagune-900 to-lagune-700 shadow-elev-2">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "url('/assets/pattern-kita.svg')",
              backgroundSize: '200px',
              filter: 'brightness(0) invert(1)',
            }}
          />
          <div className="relative z-10 flex-1 min-w-[220px]">
            <div className="font-[family-name:var(--font-display)] text-[18px] font-semibold text-white leading-tight">
              782 contribuables en retard
            </div>
            <div className="text-[13px] text-white/70 mt-0.5 font-[family-name:var(--font-mono)] tabular-nums">
              15,3 M FCFA d&rsquo;impayés
            </div>
          </div>
          <button className="relative z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-ocre-500 hover:bg-ocre-600 text-ink-950 font-bold text-sm font-[family-name:var(--font-ui)] transition-colors duration-150 shadow-elev-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lagune-900">
            <Send size={15} /> Lancer les relances SMS
          </button>
        </div>

        {/* Priority dossiers table */}
        <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100 flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="font-semibold text-[15px] text-ink-900">Dossiers prioritaires</div>
              <div className="text-[12px] text-ink-500 mt-0.5">
                Classés par ancienneté du retard · {DOSSIERS_RETARD.length} dossiers affichés
              </div>
            </div>
            <Button variant="ghost" className="shrink-0">
              <MessageSquare size={15} /> Relance groupée
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 720 }}>
              <thead>
                <tr className="bg-paper-50">
                  {['Contribuable', 'Catégorie', 'Montant dû', 'Retard', 'Statut relance', 'Dernière relance', ''].map((h, i) => (
                    <th
                      key={i}
                      className="py-2.5 px-4 text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-100"
                      style={{ textAlign: i === 2 || i === 3 ? 'right' : 'left' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DOSSIERS_RETARD.map((d) => (
                  <tr key={d.id} className="hover:bg-ink-50 transition-colors duration-150">
                    <td className="py-3.5 px-4 border-b border-ink-100">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={d.name}
                          size={32}
                          bg={d.relanceStatus === 'urgent' ? 'var(--terra-500)' : 'var(--ocre-500)'}
                          style={{ color: '#fff' }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-ink-900 truncate">{d.name}</div>
                          <div className="text-[11px] text-ink-500 font-[family-name:var(--font-mono)] tabular-nums">
                            {d.id} · Étal {d.stall}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] text-ink-700 border-b border-ink-100">
                      {d.category}
                    </td>
                    <td className="py-3.5 px-4 text-right border-b border-ink-100 whitespace-nowrap">
                      <span className="font-[family-name:var(--font-mono)] tabular-nums font-semibold text-sm text-terra-700">
                        {formatAmount(d.montantDu)}
                      </span>
                      <span className="text-[11px] text-ink-500 ml-1">FCFA</span>
                    </td>
                    <td className="py-3.5 px-4 text-right border-b border-ink-100 whitespace-nowrap">
                      <span
                        className={[
                          'inline-flex items-center font-[family-name:var(--font-mono)] tabular-nums font-semibold text-[13px]',
                          d.joursRetard > 30 ? 'text-terra-700' : 'text-ocre-700',
                        ].join(' ')}
                      >
                        {d.joursRetard} j
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-b border-ink-100">
                      <Pill variant={relancePill[d.relanceStatus]} dot>
                        {relanceLabel[d.relanceStatus]}
                      </Pill>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] text-ink-500 font-[family-name:var(--font-mono)] tabular-nums border-b border-ink-100 whitespace-nowrap">
                      {d.derniereRelance ?? '—'}
                    </td>
                    <td className="py-3.5 px-4 border-b border-ink-100">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          title="Appeler"
                          aria-label={`Appeler ${d.name}`}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-ink-200 bg-paper-0 text-ink-700 hover:text-ink-900 hover:bg-ink-50 hover:border-ink-300 transition-colors duration-150"
                        >
                          <Phone size={14} />
                        </button>
                        <button
                          title="Envoyer SMS"
                          aria-label={`Envoyer un SMS à ${d.name}`}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-lagune-200 bg-lagune-50 text-lagune-700 hover:bg-lagune-100 hover:border-lagune-300 transition-colors duration-150"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-5 border-t border-ink-100 flex items-center justify-between text-[13px] text-ink-500 gap-3 flex-wrap">
            <span>
              Affichage 1–{DOSSIERS_RETARD.length} sur 782 dossiers en retard
            </span>
            <div className="flex gap-1">
              <button className="py-1 px-2.5 text-[13px] bg-paper-0 border border-ink-200 hover:border-ink-300 rounded-md text-ink-700 transition-colors duration-150">
                ← Préc.
              </button>
              <button className="py-1 px-2.5 text-[13px] bg-paper-0 border border-ink-200 hover:border-ink-300 rounded-md text-ink-700 transition-colors duration-150">
                Suiv. →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
