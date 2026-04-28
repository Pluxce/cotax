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
          <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em] m-0">
            Recouvrement &amp; Relances
          </h1>
          <div className="text-sm text-[var(--fg-3)] mt-1">
            Suivi des impayés · Marché Cocovico · Avril 2026
          </div>
        </div>

        {/* SYSCOHADA Art. 62 alert */}
        <div className="flex items-center gap-3.5 px-[18px] py-3.5 rounded-md mb-6 flex-wrap border-l-[3px]"
          style={{ background: 'var(--terra-50, #FFF5F4)', color: 'var(--terra-900)', borderLeftColor: 'var(--terra-500)' }}>
          <AlertTriangle size={20} strokeWidth={1.5} className="shrink-0 text-terra-500" />
          <div className="flex-1">
            <span className="font-bold">SYSCOHADA Art. 62 — Créances à risque.</span>
            {' '}134 dossiers dépassent 30 jours d&apos;impayés et doivent faire l&apos;objet d&apos;une provision pour dépréciation avant clôture du trimestre.
          </div>
          <Button variant="ghost" className="shrink-0 text-[13px]">
            <FileText size={15} /> Générer provision
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
          <div className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] px-5 py-[18px] shadow-[var(--elev-1)]">
            <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold mb-2">Total impayés</div>
            <div className="font-[family-name:var(--font-display)] text-[30px] font-semibold tracking-[-0.02em] text-terra-700">
              15,3 M
              <span className="font-[family-name:var(--font-ui)] text-xs text-[var(--fg-3)] ml-1.5 tracking-[0.08em] uppercase font-medium">FCFA</span>
            </div>
            <div className="text-xs text-[var(--fg-3)] mt-1.5">
              {formatAmount(KPI_RECOUVREMENT.totalImpayes)} FCFA
            </div>
          </div>

          <div className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] px-5 py-[18px] shadow-[var(--elev-1)]">
            <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold mb-2">Contribuables en retard</div>
            <div className="font-[family-name:var(--font-display)] text-[30px] font-semibold tracking-[-0.02em] text-[var(--fg-1)]">
              {KPI_RECOUVREMENT.contribuablesEnRetard}
              <span className="font-[family-name:var(--font-ui)] text-xs text-[var(--fg-3)] ml-1.5 font-medium">dont</span>
              <span className="text-xl text-terra-600 ml-1">{KPI_RECOUVREMENT.enRetardPlus30j}</span>
              <span className="font-[family-name:var(--font-ui)] text-xs text-terra-600 ml-1 font-medium">&gt;30 j</span>
            </div>
            <div className="text-xs text-[var(--fg-3)] mt-1.5">Contribuables enregistrés au marché Cocovico</div>
          </div>

          <div className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] px-5 py-[18px] shadow-[var(--elev-1)]">
            <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold mb-2">SMS relances envoyés</div>
            <div className="font-[family-name:var(--font-display)] text-[30px] font-semibold tracking-[-0.02em] text-[var(--fg-1)]">
              {KPI_RECOUVREMENT.smsEnvoyes.toLocaleString('fr-CI')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 bg-[var(--bg-sunken)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-500 rounded-full"
                  style={{ width: `${KPI_RECOUVREMENT.tauxReponse}%` }}
                />
              </div>
              <span className="text-xs text-forest-700 font-semibold font-[family-name:var(--font-mono)]">{KPI_RECOUVREMENT.tauxReponse} %</span>
              <span className="text-xs text-[var(--fg-3)]">réponse</span>
            </div>
          </div>
        </div>

        {/* Batch action bar */}
        <div className="flex items-center gap-3 px-[18px] py-3.5 rounded-md mb-5 flex-wrap"
          style={{ background: 'var(--lagune-900)' }}>
          <span className="font-[family-name:var(--font-display)] text-base font-semibold text-white flex-1 min-w-[220px]">
            782 contribuables en retard · 15,3 M FCFA d&apos;impayés
          </span>
          <Button variant="primary" style={{ background: 'var(--ocre-500)', color: 'var(--ink-950)', border: 'none', fontWeight: 700 }}>
            <Send size={15} /> Lancer les relances SMS →
          </Button>
        </div>

        {/* Priority dossiers table */}
        <div className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] shadow-[var(--elev-1)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-2.5">
            <div>
              <div className="font-bold text-[15px] text-[var(--fg-1)]">Dossiers prioritaires</div>
              <div className="text-xs text-[var(--fg-3)] mt-0.5">Classés par ancienneté du retard · {DOSSIERS_RETARD.length} dossiers affichés</div>
            </div>
            <Button variant="ghost" className="text-[13px]">
              <MessageSquare size={15} /> Relance groupée
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  {['Contribuable', 'Catégorie', 'Montant dû', 'Retard', 'Statut relance', 'Dernière relance', ''].map((h, i) => (
                    <th
                      key={i}
                      className="py-2.5 px-4 text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold border-b border-[var(--border)] bg-[var(--paper-50)]"
                      style={{ textAlign: i === 2 ? 'right' : 'left' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DOSSIERS_RETARD.map(d => (
                  <tr key={d.id} className="border-b border-[var(--border-subtle)]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={d.name}
                          size={32}
                          bg={d.relanceStatus === 'urgent' ? 'var(--terra-500)' : 'var(--ocre-500)'}
                          style={{ color: '#fff' }}
                        />
                        <div>
                          <div className="font-semibold text-sm text-[var(--fg-1)]">{d.name}</div>
                          <div className="text-xs text-[var(--fg-3)] font-[family-name:var(--font-mono)]">{d.id} · Étal {d.stall}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] text-[var(--fg-2)]">{d.category}</td>
                    <td className="py-3.5 px-4 text-right font-[family-name:var(--font-mono)] font-bold text-sm text-terra-700">
                      {formatAmount(d.montantDu)}
                      <span className="text-[11px] text-[var(--fg-3)] font-normal ml-1">FCFA</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-[5px] font-[family-name:var(--font-mono)] font-bold text-[13px]"
                        style={{ color: d.joursRetard > 30 ? 'var(--terra-700)' : 'var(--ocre-700)' }}
                      >
                        {d.joursRetard} j
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Pill variant={relancePill[d.relanceStatus]} dot>
                        {relanceLabel[d.relanceStatus]}
                      </Pill>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] text-[var(--fg-3)] font-[family-name:var(--font-mono)]">
                      {d.derniereRelance ?? '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1.5">
                        <button title="Appeler" className="p-1.5 rounded-lg border border-[var(--border)] bg-transparent cursor-pointer flex items-center justify-center text-[var(--fg-2)]">
                          <Phone size={14} />
                        </button>
                        <button title="Envoyer SMS" className="p-1.5 rounded-lg border border-[var(--border)] bg-transparent cursor-pointer flex items-center justify-center text-lagune-600">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-3.5 px-[18px] border-t border-[var(--border)] flex items-center justify-between text-[13px] text-[var(--fg-3)] gap-2.5 flex-wrap">
            <span>Affichage 1–{DOSSIERS_RETARD.length} sur 782 dossiers en retard</span>
            <div className="flex gap-1">
              <button className="py-1 px-2.5 text-[13px] bg-transparent border border-[var(--border)] rounded-lg cursor-pointer font-[family-name:var(--font-ui)] text-[var(--fg-2)]">← Préc.</button>
              <button className="py-1 px-2.5 text-[13px] bg-transparent border border-[var(--border)] rounded-lg cursor-pointer font-[family-name:var(--font-ui)] text-[var(--fg-2)]">Suiv. →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
