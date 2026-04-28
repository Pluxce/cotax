'use client'
import React, { useState } from 'react'
import { CONTRIBUABLES, formatAmount, type Contribuable } from '@/lib/mock-data'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { MoreHorizontal, X, MessageSquare, Phone, User, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const TABS = ['Tous', 'À jour', 'En retard', 'En attente', 'Brouillons'] as const
const TAB_COUNTS: Record<string, number | undefined> = {
  Tous: 412, 'À jour': 284, 'En retard': 47, 'En attente': 12, Brouillons: 6,
}

const STATUS_PILL: Record<string, 'ok' | 'late' | 'pending'> = { ok: 'ok', late: 'late', pending: 'pending' }
const STATUS_LABEL: Record<string, string> = { ok: 'À jour', late: 'Retard', pending: 'En attente' }

type Tab = (typeof TABS)[number]

export function ContribuableTable() {
  const [activeTab, setActiveTab] = useState<Tab>('Tous')
  const [selected, setSelected] = useState<Contribuable | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const filtered =
    activeTab === 'Tous' ? CONTRIBUABLES
    : activeTab === 'À jour' ? CONTRIBUABLES.filter(c => c.status === 'ok')
    : activeTab === 'En retard' ? CONTRIBUABLES.filter(c => c.status === 'late')
    : activeTab === 'En attente' ? CONTRIBUABLES.filter(c => c.status === 'pending')
    : CONTRIBUABLES

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    if (checked.size === filtered.length) setChecked(new Set())
    else setChecked(new Set(filtered.map(c => c.id)))
  }
  const allChecked = filtered.length > 0 && checked.size === filtered.length
  const someChecked = checked.size > 0 && !allChecked

  return (
    <div className={`grid gap-5 ${selected ? 'lg:grid-cols-[minmax(0,1fr)_400px]' : 'grid-cols-1'}`}>
      <div className="min-w-0">
        {/* Tabs */}
        <div className="flex gap-1 bg-ink-50 p-1 rounded-xl w-fit mb-4 flex-wrap">
          {TABS.map(t => {
            const isActive = activeTab === t
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={[
                  'inline-flex items-center gap-2 py-[7px] px-3.5 rounded-lg text-[13px] font-semibold transition-colors duration-150',
                  isActive
                    ? 'bg-paper-0 text-lagune-700 shadow-elev-1 ring-1 ring-lagune-100'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-paper-0/60',
                ].join(' ')}
              >
                {t}
                {TAB_COUNTS[t] != null && (
                  <span className={[
                    'font-[family-name:var(--font-mono)] text-[11px] tabular-nums px-1.5 py-px rounded-full',
                    isActive ? 'bg-lagune-100 text-lagune-700' : 'bg-ink-100 text-ink-500',
                  ].join(' ')}>
                    {TAB_COUNTS[t]}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center pb-3.5 flex-wrap">
          <span className="text-[11px] text-ink-500 font-semibold tracking-[0.08em] uppercase">
            Filtres :
          </span>
          {['Marché Cocovico', 'Patente active', 'Période : avril 2026'].map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[12px] font-medium bg-lagune-100 text-lagune-700">
              {f}
              <button className="opacity-60 hover:opacity-100" aria-label={`Retirer ${f}`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button className="py-1 px-2.5 text-[12px] bg-paper-0 border border-ink-200 hover:border-ink-300 rounded-lg text-ink-700 transition-colors duration-150">
            + Ajouter filtre
          </button>
        </div>

        {/* Bulk actions banner */}
        {checked.size > 0 && (
          <div className="status-banner status-banner-info mb-3" style={{ borderLeftColor: 'var(--lagune-500)', background: 'var(--lagune-50)', color: 'var(--lagune-700)' }}>
            <Check size={16} className="shrink-0" />
            <span className="font-medium">
              {checked.size} contribuable{checked.size > 1 ? 's' : ''} sélectionné{checked.size > 1 ? 's' : ''}
            </span>
            <div className="ml-auto flex gap-2 flex-wrap">
              <Button variant="ghost"><MessageSquare size={14} />Relance SMS</Button>
              <Button variant="ghost"><Phone size={14} />Appeler</Button>
              <Button variant="primary"><Check size={14} />Valider</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 720 }}>
              <thead>
                <tr className="bg-paper-50">
                  <th className="w-10 pl-4 py-2.5 px-3 text-left">
                    <CheckBox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} aria-label="Tout sélectionner" />
                  </th>
                  {['Contribuable', 'Étal · Catégorie', 'Dû ce mois', 'Dernier paiement', 'Statut', ''].map((h, i) => (
                    <th
                      key={i}
                      className="py-2.5 px-3 text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold border-b border-ink-100"
                      style={{ textAlign: i === 2 ? 'right' : 'left' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const isChecked = checked.has(c.id)
                  const isSelected = selected?.id === c.id
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={[
                        'cursor-pointer transition-colors duration-150',
                        isSelected
                          ? 'bg-lagune-50'
                          : isChecked
                          ? 'bg-ocre-50'
                          : 'hover:bg-ink-50',
                      ].join(' ')}
                    >
                      <td
                        onClick={e => e.stopPropagation()}
                        className={[
                          'pl-4 py-3 px-3 border-b border-ink-100',
                          isSelected ? 'border-l-[3px] border-l-lagune-500' : '',
                        ].join(' ')}
                      >
                        <CheckBox
                          checked={isChecked}
                          onChange={() => toggleCheck(c.id)}
                          aria-label={`Sélectionner ${c.name}`}
                        />
                      </td>
                      <td className="py-3 px-3 border-b border-ink-100">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.name} size={32} bg="var(--ocre-500)" style={{ color: 'var(--ink-900)' }} />
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-ink-900 truncate">{c.name}</div>
                            <div className="text-[11px] text-ink-500 font-[family-name:var(--font-mono)]">{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 border-b border-ink-100">
                        <span className="font-semibold text-sm text-ink-900">{c.stall}</span>
                        <div className="text-[12px] text-ink-500 mt-0.5">{c.category}</div>
                      </td>
                      <td className="py-3 px-3 text-right border-b border-ink-100 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-mono)] tabular-nums font-semibold text-sm text-ink-900">
                          {formatAmount(c.due)}
                        </span>
                        <span className="text-[11px] text-ink-500 font-[family-name:var(--font-ui)] ml-1">FCFA</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-ink-700 border-b border-ink-100 whitespace-nowrap">
                        il y a {c.lastPayment}
                      </td>
                      <td className="py-3 px-3 border-b border-ink-100">
                        <Pill variant={STATUS_PILL[c.status]} dot>{STATUS_LABEL[c.status]}</Pill>
                      </td>
                      <td className="py-3 px-3 border-b border-ink-100 text-right">
                        <button
                          onClick={e => e.stopPropagation()}
                          className="w-7 h-7 rounded-md text-ink-500 hover:text-ink-900 hover:bg-ink-50 inline-flex items-center justify-center transition-colors duration-150"
                          aria-label="Plus d'actions"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-4 border-t border-ink-100 flex items-center justify-between text-[13px] text-ink-500 flex-wrap gap-2">
            <span>
              Affichage 1–{filtered.length} sur {TAB_COUNTS[activeTab] ?? filtered.length}
            </span>
            <div className="flex gap-1">
              <button className="py-1 px-2.5 text-[13px] bg-paper-0 border border-ink-200 hover:border-ink-300 rounded-md text-ink-700">← Préc.</button>
              <button className="py-1 px-2.5 text-[13px] bg-paper-0 border border-ink-200 hover:border-ink-300 rounded-md text-ink-700">Suiv. →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel — inline column on lg+, drawer on mobile */}
      {selected && (
        <SidePanel selected={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// ── Side panel ──
function SidePanel({ selected, onClose }: { selected: Contribuable; onClose: () => void }) {
  return (
    <>
      {/* Mobile/tablet: full-screen drawer */}
      <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={onClose}>
        <aside
          onClick={e => e.stopPropagation()}
          className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-paper-0 shadow-elev-3 flex flex-col"
        >
          <PanelContent selected={selected} onClose={onClose} />
        </aside>
      </div>

      {/* Desktop: inline column */}
      <aside className="hidden lg:flex flex-col bg-paper-0 rounded-[16px] border border-ink-100 shadow-elev-1 sticky top-[80px] self-start max-h-[calc(100vh-100px)]">
        <PanelContent selected={selected} onClose={onClose} />
      </aside>
    </>
  )
}

function PanelContent({ selected, onClose }: { selected: Contribuable; onClose: () => void }) {
  return (
    <>
      <div className="px-5 py-4 border-b border-ink-100 flex items-start gap-3">
        <Avatar name={selected.name} size={48} bg="var(--ocre-500)" style={{ color: 'var(--ink-900)' }} />
        <div className="flex-1 min-w-0">
          <div className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.01em] truncate">
            {selected.name}
          </div>
          <div className="text-[11px] text-ink-500 mt-0.5 font-[family-name:var(--font-mono)]">
            {selected.id} · Étal {selected.stall}
          </div>
          <div className="mt-2">
            <Pill variant={STATUS_PILL[selected.status]} dot>
              {selected.status === 'late' ? 'Retard 3 j' : STATUS_LABEL[selected.status]}
            </Pill>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="w-8 h-8 inline-flex items-center justify-center rounded-md text-ink-500 hover:text-ink-900 hover:bg-ink-50"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <SectionLabel>Identité</SectionLabel>
        <Field k="Téléphone" v={selected.phone} mono />
        <Field k="Catégorie" v={selected.category} />
        <Field k="Marché" v={`${selected.market} · A`} />
        <Field k="Patente n°" v={`PAT-2026-${selected.id.slice(2)}`} mono />

        <SectionLabel className="mt-5">Solde fiscal</SectionLabel>
        <div className="bg-ink-50 rounded-xl px-4 py-3 mb-2">
          <div className="text-[11px] text-ink-500 font-semibold uppercase tracking-[0.08em]">Dû ce mois</div>
          <div className="font-[family-name:var(--font-display)] text-[26px] leading-none font-semibold text-ink-900 tabular-nums tracking-[-0.01em] mt-2 whitespace-nowrap">
            {formatAmount(selected.due)}
            <span className="text-xs text-ink-500 font-[family-name:var(--font-ui)] tracking-[0.08em] uppercase ml-1.5">
              FCFA
            </span>
          </div>
          <div className="text-[12px] text-ink-500 mt-1.5">
            Dernier paiement il y a {selected.lastPayment}
          </div>
        </div>

        {selected.history.length > 0 && (
          <>
            <SectionLabel className="mt-5">Historique · 6 derniers</SectionLabel>
            <div className="rounded-lg border border-ink-100 overflow-hidden">
              {selected.history.map((h, i) => (
                <div
                  key={i}
                  className={[
                    'flex items-center gap-2.5 py-2 px-3 text-[13px]',
                    i < selected.history.length - 1 ? 'border-b border-ink-100' : '',
                  ].join(' ')}
                >
                  <span className="font-[family-name:var(--font-mono)] text-ink-500 w-[42px] shrink-0">{h.date}</span>
                  <span className="flex-1 text-ink-700 truncate">{h.psp}</span>
                  <span
                    className="font-[family-name:var(--font-mono)] font-semibold tabular-nums"
                    style={{ color: h.amount ? 'var(--ink-900)' : 'var(--terra-700)' }}
                  >
                    {h.amount ? formatAmount(h.amount) : '—'}
                  </span>
                  {h.amount
                    ? <Pill variant="ok"><Check size={10} /></Pill>
                    : <Pill variant="late">!</Pill>
                  }
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action footer — clear icons + labels */}
      <div className="px-5 py-3 border-t border-ink-100 grid grid-cols-2 gap-2">
        <Button variant="ghost" className="w-full">
          <MessageSquare size={15} /> Relance SMS
        </Button>
        <Button variant="ghost" className="w-full">
          <Phone size={15} /> Appeler
        </Button>
        <Button variant="primary" className="col-span-2 w-full">
          <User size={15} /> Voir profil complet
        </Button>
      </div>
    </>
  )
}

// ── Helpers ──
function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold mb-2 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

function Field({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-3 py-2 text-[13px] border-b border-ink-100">
      <span className="text-ink-500 shrink-0">{k}</span>
      <span
        className="text-ink-900 font-medium text-right truncate"
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

interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean
}
function CheckBox({ indeterminate, className, ...rest }: CheckBoxProps) {
  const ref = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      className={[
        'w-4 h-4 rounded-[4px] border border-ink-300 bg-paper-0',
        'accent-lagune-500',
        'cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagune-500 focus-visible:ring-offset-1',
        className ?? '',
      ].join(' ')}
      {...rest}
    />
  )
}
