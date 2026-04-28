import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Smartphone, ShieldCheck } from 'lucide-react'

const ROLES = [
  {
    href: '/admin/dashboard',
    label: 'Mairie & Administration',
    sub: 'Tableau de bord, agents, trésor, rapports',
    Icon: LayoutDashboard,
    bg: 'var(--lagune-500)',
    roles: ['Maire', 'Adjoint', 'Régisseur', 'Directeur de la Recette'],
  },
  {
    href: '/portail',
    label: 'Portail Commerçant',
    sub: 'Mes taxes, mes reçus, paiement mobile',
    Icon: Smartphone,
    bg: 'var(--forest-600)',
    roles: ['Commerçant', 'Assujetti'],
  },
  {
    href: '/v/1847',
    label: 'Vérification de reçu',
    sub: 'Contrôle public d\'authenticité d\'un reçu',
    Icon: ShieldCheck,
    bg: 'var(--tresor-500)',
    roles: ['Public', 'Contrôleur'],
  },
]

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink-950)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/assets/pattern-kita.svg')",
        backgroundSize: 240, opacity: 0.05,
        filter: 'brightness(0) invert(1)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(600px, 90vw)', height: 'min(400px, 60vw)', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(16,96,176,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-cocody.png" alt="Cocody" style={{ width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,0.92)', padding: 4 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>CoTax Cocody</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>Plateforme de digitalisation fiscale</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', overflow: 'hidden', borderRadius: 4, width: 36, height: 24 }}>
          <div style={{ flex: 1, background: '#FF8200' }} />
          <div style={{ flex: 1, background: '#fff' }} />
          <div style={{ flex: 1, background: '#009A44' }} />
        </div>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>République de Côte d&apos;Ivoire</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 900, width: '100%', position: 'relative', zIndex: 1 }}>
        {ROLES.map(r => (
          <Link key={r.href} href={r.href} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 20, padding: '28px 28px 24px',
            textDecoration: 'none', display: 'flex', flexDirection: 'column',
            minWidth: 0,
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <r.Icon size={24} strokeWidth={1.5} style={{ color: '#fff' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em', overflowWrap: 'anywhere' }}>
              {r.label}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: 20 }}>
              {r.sub}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
              {r.roles.map(role => (
                <span key={role} style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {role}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48, fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        Commune de Cocody · Exercice 2026 · Délibération N°2025-172/CC/CM/SG
      </div>
    </div>
  )
}
