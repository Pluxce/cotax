import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const RECUS = [
  { date: '14 avril 2026', num: '2026-04-1847', psp: 'Orange Money', amount: 15_000, status: 'ok' },
  { date: '13 avril 2026', num: '2026-04-1723', psp: 'Wave',         amount: 15_000, status: 'ok' },
  { date: '12 avril 2026', num: '2026-04-1612', psp: 'MTN Money',    amount: 15_000, status: 'ok' },
  { date: '11 avril 2026', num: '—',            psp: '—',            amount: 0,      status: 'miss' },
  { date: '10 avril 2026', num: '2026-04-1388', psp: 'Orange Money', amount: 15_000, status: 'ok' },
  { date: '09 avril 2026', num: '2026-04-1247', psp: 'Orange Money', amount: 15_000, status: 'ok' },
  { date: '08 avril 2026', num: '2026-04-1102', psp: 'Wave',         amount: 15_000, status: 'ok' },
]

export default function RecusPage() {
  return (
    <>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/portail" style={{ display: 'flex', alignItems: 'center', color: 'var(--fg-2)' }}>
          <ChevronLeft size={22} strokeWidth={1.5} />
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)' }}>Mes reçus</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Étal B-214 · Adjoua Kouamé</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Solde badge */}
        <div style={{ background: 'linear-gradient(135deg, var(--lagune-900), var(--lagune-600))', borderRadius: 14, padding: '14px 16px', color: '#fff', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/pattern-kita.svg')", backgroundSize: 160, opacity: 0.1, filter: 'brightness(0) invert(1)' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.65, fontWeight: 600, marginBottom: 4 }}>Ce mois</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>90 000</div>
              <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>FCFA collectés</div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.65, fontWeight: 600, marginBottom: 4 }}>Taux</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#6EE7A5' }}>6/7 j</div>
              <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>jours payés</div>
            </div>
          </div>
        </div>

        {/* Receipt list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECUS.map((r, i) => (
            r.status === 'ok' ? (
              <Link
                key={i}
                href={`/v/${r.num.split('-').pop()}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', background: 'var(--paper-0)',
                  borderRadius: 12, border: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--forest-100)', color: 'var(--forest-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{r.date}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>N° {r.num} · {r.psp}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{r.amount.toLocaleString('fr-CI')}</span>
                  <ChevronRight size={14} style={{ color: 'var(--fg-3)' }} />
                </div>
              </Link>
            ) : (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--terra-50)', borderRadius: 12, border: '1px solid var(--terra-100)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--terra-100)', color: 'var(--terra-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>!</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--terra-900)' }}>{r.date}</div>
                  <div style={{ fontSize: 11, color: 'var(--terra-700)' }}>Aucun paiement enregistré</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--terra-700)', background: 'var(--terra-100)', padding: '3px 8px', borderRadius: 999 }}>Manqué</span>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  )
}
