import React from 'react'
import Link from 'next/link'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import { RECEIPT_PUBLIC, formatAmount } from '@/lib/mock-data'

export default async function VerifPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const receipt = RECEIPT_PUBLIC[id]

  if (!receipt) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Reçu introuvable</h1>
          <p style={{ color: 'var(--fg-3)', marginBottom: 24 }}>Le reçu n° {id} n&apos;existe pas ou n&apos;a pas encore été enregistré au Trésor.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--lagune-700)', fontWeight: 600 }}>
            <ChevronLeft size={16} /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Back link */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-3)', fontSize: 13, marginBottom: 24, textDecoration: 'none' }}>
          <ChevronLeft size={16} /> Vérification publique
        </Link>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600 }}>Vérification publique</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', margin: '4px 0 0' }}>Reçu n° {receipt.num}</h1>
        </div>

        {/* Authentic badge */}
        <div style={{ background: 'var(--forest-100)', border: '1px solid var(--forest-200)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--forest-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--forest-900)' }}>Reçu authentique</div>
            <div style={{ fontSize: 11, color: 'var(--forest-900)', opacity: 0.8, marginTop: 2 }}>Émis par la Mairie de Cocody · enregistré au Trésor</div>
          </div>
        </div>

        {/* Details */}
        <div style={{ background: 'var(--paper-0)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-1)', marginBottom: 16 }}>
          {[
            ['Date', receipt.date],
            ['Contribuable', receipt.contribuable],
            ['Étal', receipt.stall],
            ['Agent', receipt.agent],
            ['PSP', receipt.psp],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--fg-3)' }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 4px', borderTop: '1px dashed var(--ink-300)', marginTop: 4 }}>
            <span style={{ color: 'var(--fg-3)' }}>Tampon Trésor</span>
            <span style={{ color: 'var(--tresor-500)', fontWeight: 600 }}>{receipt.tresorRef}</span>
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {formatAmount(receipt.amount)}
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-3)', marginLeft: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>FCFA</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Taxe journalière · avril 2026</div>
        </div>

        {/* Trésor seal */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--tresor-100)', borderRadius: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/tampon-tresor.svg" alt="Trésor" style={{ width: 44, height: 44 }} />
          <div style={{ fontSize: 12, color: 'var(--tresor-700)', lineHeight: 1.5 }}>
            <b>Trésor Public de Côte d&apos;Ivoire</b><br />
            Enregistrement validé le {receipt.tresorDate}
          </div>
        </div>

        {/* QR URL hint */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)' }}>
          cocody.ci/v/{id}
        </div>
      </div>
    </div>
  )
}
