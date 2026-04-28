'use client'
import React from 'react'
import { TopBar } from '@/components/admin/TopBar'
import { Card, CardHead } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { TRESOR_DATA, formatAmount } from '@/lib/mock-data'
import { CheckCircle, Landmark, AlertTriangle } from 'lucide-react'

const ECRITURES = [
  { date: '14/04/2026', ref: 'ECR-2026-0414', libelle: 'Taxe journalière Cocovico – 284 paiements', debit: 4_260_000, compte: '70262' },
  { date: '13/04/2026', ref: 'ECR-2026-0413', libelle: 'Taxe journalière Cocovico – 271 paiements', debit: 4_065_000, compte: '70262' },
  { date: '12/04/2026', ref: 'ECR-2026-0412', libelle: 'Taxe journalière Cocovico – 298 paiements', debit: 4_470_000, compte: '70262' },
  { date: '11/04/2026', ref: 'ECR-2026-0411', libelle: 'Pénalités retards – 8 commerçants', debit: 72_000, compte: '7028' },
]

export default function TresorPage() {
  return (
    <>
      <TopBar title="Trésor Public" />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-7 lg:py-6 max-w-[1120px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-[32px] font-semibold tracking-[-0.02em] m-0">
              Trésor Public
            </h1>
            <div className="text-sm text-[var(--fg-3)] mt-1">
              Intégration directe · Conformité SYSCOHADA · UEMOA / BCEAO
            </div>
          </div>
          <Pill variant="ok" dot>Réconcilié</Pill>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Certification card */}
          <div className="rounded-lg p-7 text-white border border-white/10" style={{
            background: 'linear-gradient(135deg, var(--tresor-700), var(--lagune-800))',
          }}>
            <div className="flex items-center gap-3 mb-4">
              <Landmark size={32} strokeWidth={1.5} className="opacity-80" />
              <div>
                <div className="text-sm font-semibold">Trésor Public de Côte d'Ivoire</div>
                <div className="text-xs opacity-60 font-[family-name:var(--font-mono)]">{TRESOR_DATA.certifieRef}</div>
              </div>
            </div>
            <div className="font-[family-name:var(--font-display)] text-[40px] font-semibold tracking-[-0.02em] mb-2">
              {formatAmount(TRESOR_DATA.montant)}
              <span className="font-[family-name:var(--font-ui)] text-sm font-medium opacity-65 ml-2 tracking-[0.06em] uppercase">FCFA</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] opacity-75">
              <CheckCircle size={16} />
              Certifié le {TRESOR_DATA.certifiedAt}
            </div>
          </div>

          {/* Reconciliation status */}
          <Card>
            <CardHead title="État de réconciliation" sub="Dernière mise à jour : hier 22h00" />
            <div className="flex flex-col gap-3">
              {[
                { label: 'Paiements PSP traités', v: '284', status: 'ok' as const },
                { label: 'Correspondances Trésor', v: '284 / 284', status: 'ok' as const },
                { label: 'Écarts détectés', v: '0', status: 'ok' as const },
                { label: 'Prochaine réconciliation', v: 'Demain J+7', status: 'info' as const },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[var(--border-subtle)]">
                  <span className="text-sm text-[var(--fg-2)]">{item.label}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-[family-name:var(--font-mono)] font-semibold text-sm">{item.v}</span>
                    <Pill variant={item.status} dot />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Taux de recouvrement */}
        <Card className="mb-5">
          <CardHead title="Taux de recouvrement" sub="Exercice 2026" />
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div>
              <div className="font-[family-name:var(--font-display)] text-[40px] sm:text-[48px] font-semibold tracking-[-0.02em] text-terra-700">
                {TRESOR_DATA.tauxRecouvrement} %
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <AlertTriangle size={14} className="text-terra-500" />
                <span className="text-[13px] text-[var(--fg-3)]">
                  Objectif : {TRESOR_DATA.objectif} % — écart de {(TRESOR_DATA.objectif - TRESOR_DATA.tauxRecouvrement).toFixed(1)} points
                </span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${TRESOR_DATA.tauxRecouvrement}%`,
                    background: 'linear-gradient(to right, var(--lagune-500), var(--forest-500))',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[11px] text-[var(--fg-3)]">
                <span>0 %</span>
                <span className="text-terra-700 font-semibold">{TRESOR_DATA.tauxRecouvrement} %</span>
                <span className="text-forest-600 font-semibold">Objectif {TRESOR_DATA.objectif} %</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Écritures SYSCOHADA */}
        <Card noPadding>
          <div className="px-[22px] pt-5">
            <div className="text-base font-semibold font-[family-name:var(--font-ui)]">Écritures comptables SYSCOHADA</div>
            <div className="text-[13px] text-[var(--fg-3)] mt-0.5">Journal des recettes · 4 derniers jours</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-3" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  {['Date', 'Référence', 'Libellé', 'Compte', 'Débit (FCFA)'].map((h, i) => (
                    <th
                      key={h}
                      className="py-2.5 px-3.5 text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold border-b border-[var(--border)]"
                      style={{ textAlign: i === 4 ? 'right' : 'left' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ECRITURES.map(e => (
                  <tr key={e.ref}>
                    <td className="py-3 px-3.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--fg-2)] border-b border-[var(--border-subtle)]">
                      {e.date}
                    </td>
                    <td className="py-3 px-3.5 font-[family-name:var(--font-mono)] text-[13px] text-lagune-700 border-b border-[var(--border-subtle)]">
                      {e.ref}
                    </td>
                    <td className="py-3 px-3.5 text-sm text-[var(--fg-1)] border-b border-[var(--border-subtle)]">
                      {e.libelle}
                    </td>
                    <td className="py-3 px-3.5 font-[family-name:var(--font-mono)] text-[13px] text-ocre-700 border-b border-[var(--border-subtle)]">
                      {e.compte}
                    </td>
                    <td className="py-3 px-3.5 text-right font-[family-name:var(--font-mono)] tabular-nums font-semibold text-sm border-b border-[var(--border-subtle)]">
                      {formatAmount(e.debit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
