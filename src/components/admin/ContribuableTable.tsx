'use client'
import React, { useState } from 'react'
import { CONTRIBUABLES, formatAmount, type Contribuable } from '@/lib/mock-data'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { MoreHorizontal, X, MessageSquare, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const TABS = ['Tous', 'À jour', 'En retard', 'En attente', 'Brouillons']
const TAB_COUNTS: Record<string, number | undefined> = { 'Tous': 412, 'À jour': 284, 'En retard': 47 }

const STATUS_PILL: Record<string, 'ok' | 'late' | 'pending'> = { ok: 'ok', late: 'late', pending: 'pending' }
const STATUS_LABEL: Record<string, string> = { ok: 'À jour', late: 'Retard', pending: 'En attente' }

export function ContribuableTable() {
  const [activeTab, setActiveTab] = useState('Tous')
  const [selected, setSelected] = useState<Contribuable | null>(null)

  const filtered = activeTab === 'Tous' ? CONTRIBUABLES
    : activeTab === 'À jour' ? CONTRIBUABLES.filter(c => c.status === 'ok')
    : activeTab === 'En retard' ? CONTRIBUABLES.filter(c => c.status === 'late')
    : activeTab === 'En attente' ? CONTRIBUABLES.filter(c => c.status === 'pending')
    : CONTRIBUABLES

  return (
    <div className="flex gap-0 relative">
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--bg-sunken)] p-1 rounded-xl w-fit mb-5 flex-wrap">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="flex items-center gap-1.5 py-[7px] px-3.5 rounded-lg text-[13px] font-semibold border-none cursor-pointer font-[family-name:var(--font-ui)]"
              style={{
                color: activeTab === t ? 'var(--lagune-700)' : 'var(--fg-3)',
                background: activeTab === t ? 'var(--paper-0)' : 'transparent',
                boxShadow: activeTab === t ? 'var(--elev-1)' : 'none',
              }}
            >
              {t}
              {TAB_COUNTS[t] !== undefined && (
                <span className="font-[family-name:var(--font-mono)] text-[11px] opacity-60">{TAB_COUNTS[t]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center pb-3.5 flex-wrap">
          <span className="text-xs text-[var(--fg-3)] font-semibold tracking-[0.04em] uppercase">Filtres :</span>
          {['Marché Cocovico', 'Patente active', 'Période : avril 2026'].map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-[999px] text-[13px] font-medium bg-lagune-100 text-lagune-700">
              {f}
              <X size={12} className="cursor-pointer opacity-60" />
            </span>
          ))}
          <button className="py-[5px] px-2.5 text-xs bg-transparent border border-[var(--border)] rounded-lg cursor-pointer font-[family-name:var(--font-ui)] text-[var(--fg-2)]">
            + Ajouter filtre
          </button>
        </div>

        {/* Table */}
        <div className="bg-[var(--paper-0)] rounded-lg border border-[var(--border-subtle)] shadow-[var(--elev-1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th className="w-7 pl-[18px] py-2.5 px-3.5 text-left text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold border-b border-[var(--border)]">
                    <input type="checkbox" />
                  </th>
                  {['Contribuable', 'Étal · Catégorie', 'Dû ce mois', 'Dernier paiement', 'Statut', ''].map((h, i) => (
                    <th
                      key={i}
                      className="py-2.5 px-3.5 text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold border-b border-[var(--border)]"
                      style={{ textAlign: i === 2 ? 'right' : 'left' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="cursor-pointer"
                    style={{ background: selected?.id === c.id ? 'var(--lagune-50)' : undefined }}
                  >
                    <td className="pl-[18px] py-3 px-3.5 border-b border-[var(--border-subtle)]">
                      <input type="checkbox" onClick={e => e.stopPropagation()} />
                    </td>
                    <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={c.name} size={32} bg="var(--ocre-500)" style={{ color: 'var(--ink-900)' }} />
                        <div>
                          <div className="font-semibold text-sm text-[var(--fg-1)]">{c.name}</div>
                          <div className="text-xs text-[var(--fg-3)] font-[family-name:var(--font-mono)]">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                      <span className="font-semibold">{c.stall}</span>
                      <div className="text-xs text-[var(--fg-3)] mt-0.5">{c.category}</div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-[family-name:var(--font-mono)] tabular-nums font-semibold text-sm border-b border-[var(--border-subtle)]">
                      {formatAmount(c.due)}{' '}
                      <span className="text-[11px] text-[var(--fg-3)] font-normal">FCFA</span>
                    </td>
                    <td className="py-3 px-3.5 text-sm text-[var(--fg-2)] border-b border-[var(--border-subtle)]">
                      il y a {c.lastPayment}
                    </td>
                    <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                      <Pill variant={STATUS_PILL[c.status]} dot>
                        {STATUS_LABEL[c.status]}
                      </Pill>
                    </td>
                    <td className="py-3 px-3.5 border-b border-[var(--border-subtle)]">
                      <MoreHorizontal size={16} className="text-[var(--fg-3)]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-3.5 px-[18px] border-t border-[var(--border)] flex items-center justify-between text-[13px] text-[var(--fg-3)]">
            <span>Affichage 1–{filtered.length} sur {TAB_COUNTS[activeTab] ?? filtered.length}</span>
            <div className="flex gap-1">
              <button className="py-1 px-2.5 text-[13px] bg-transparent border border-[var(--border)] rounded-lg cursor-pointer font-[family-name:var(--font-ui)] text-[var(--fg-2)]">← Préc.</button>
              <button className="py-1 px-2.5 text-[13px] bg-transparent border border-[var(--border)] rounded-lg cursor-pointer font-[family-name:var(--font-ui)] text-[var(--fg-2)]">Suiv. →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel — full width on mobile, 420px on sm+ */}
      {selected && (
        <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[var(--paper-0)] shadow-[var(--elev-3)] border-l border-[var(--border)] z-50 flex flex-col">
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-start gap-3">
            <Avatar name={selected.name} size={48} bg="var(--ocre-500)" style={{ color: 'var(--ink-900)' }} />
            <div className="flex-1">
              <div className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.01em]">
                {selected.name}
              </div>
              <div className="text-xs text-[var(--fg-3)] mt-0.5 font-[family-name:var(--font-mono)]">
                {selected.id} · Étal {selected.stall}
              </div>
              <div className="mt-1.5">
                <Pill variant={STATUS_PILL[selected.status]} dot>
                  {selected.status === 'late' ? 'Retard 3 j' : STATUS_LABEL[selected.status]}
                </Pill>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="bg-none border-none cursor-pointer text-[var(--fg-3)] p-1">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-[18px]">
            <Label>Identité</Label>
            <Field k="Téléphone" v={selected.phone} mono />
            <Field k="Catégorie" v={selected.category} />
            <Field k="Marché" v={`${selected.market} · A`} />
            <Field k="Patente n°" v={`PAT-2026-${selected.id.slice(2)}`} mono />

            <Label className="mt-[18px] mb-1.5">Solde fiscal</Label>
            <div className="bg-[var(--bg-sunken)] rounded-xl px-4 py-3.5 mb-2">
              <div className="text-[11px] text-[var(--fg-3)] font-semibold uppercase tracking-[0.08em]">Dû ce mois</div>
              <div className="font-[family-name:var(--font-display)] text-[28px] font-semibold text-[var(--fg-1)] tabular-nums tracking-[-0.01em] mt-1">
                {formatAmount(selected.due)}{' '}
                <span className="text-xs text-[var(--fg-3)] font-[family-name:var(--font-ui)] tracking-[0.08em] uppercase">FCFA</span>
              </div>
              <div className="text-xs text-[var(--fg-3)] mt-1">Dernier paiement il y a {selected.lastPayment}</div>
            </div>

            {selected.history.length > 0 && (
              <>
                <Label className="mt-[18px] mb-1.5">Historique · 6 derniers</Label>
                {selected.history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-1.5 text-[13px]"
                    style={{ borderBottom: i < selected.history.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[var(--fg-3)] w-[42px]">{h.date}</span>
                    <span className="flex-1 text-[var(--fg-2)]">{h.psp}</span>
                    <span
                      className="font-[family-name:var(--font-mono)] font-semibold"
                      style={{ color: h.amount ? 'var(--fg-1)' : 'var(--terra-700)' }}
                    >
                      {h.amount ? formatAmount(h.amount) : '—'}
                    </span>
                    {h.amount
                      ? <Pill variant="ok" style={{ padding: '1px 6px' }}>✓</Pill>
                      : <Pill variant="late" style={{ padding: '1px 6px' }}>!</Pill>
                    }
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[var(--border)] flex gap-2">
            <Button variant="ghost" style={{ flex: 1 }}>
              <MessageSquare size={15} /> Relance SMS
            </Button>
            <Button variant="primary" style={{ flex: 1 }}>
              <User size={15} /> Voir profil complet
            </Button>
          </div>
        </aside>
      )}
    </div>
  )
}

function Label({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold mb-1.5 ${className ?? ''}`}
      style={style}
    >
      {children}
    </div>
  )
}

function Field({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between py-2 text-[13px] border-b border-[var(--border-subtle)]">
      <span className="text-[var(--fg-3)]">{k}</span>
      <span
        className="text-[var(--fg-1)] font-medium"
        style={{
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        }}
      >
        {v}
      </span>
    </div>
  )
}
