'use client'
import React, { useState, useEffect } from 'react'
import { BAREME_COMPLET, calculerTaxeEntreprenant } from '@/lib/taxes'
import { TYPES_ACTIVITES, CATEGORIES_ACTIVITES, PIECES_COMMUNES } from '@/lib/activites'
import { formatAmount } from '@/lib/mock-data'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import {
  FileText, CreditCard, Receipt, History, ArrowRight, Calculator,
  CheckCircle, Download, ChevronLeft, LogOut, PlusCircle, BookOpen,
  MapPin, Clock, AlertCircle, ChevronDown, Sparkles, Home, Store,
} from 'lucide-react'

interface AiAssietteResult {
  taxType: string
  compte: string
  regime: string
  assiette: string
  montantEstime: number
  periodeCalcul: string
  justification: string
  fiable: boolean
}

interface ActAiResult {
  activiteId: string
  categorie: string
  compte: string
  regime: string
  tarifApplicable: string
  justification: string
  fiable: boolean
}

type Screen = 'home' | 'declaration' | 'historique' | 'profil' | 'nouvelle_activite' | 'bareme' | 'mes_activites'
type DeclaStep = 0 | 1 | 2 | 3 | 'done'

interface ActiviteContribuable {
  id: string
  nom: string
  type: string
  regime: string
  compte: string
  taxeMensuelle: number
  ca?: number
  adresse: string
  quartier: string
  nui: string
  statut: 'actif' | 'en_attente'
  dateEnreg: string
}

const ACTIVITES_CONTRIBUABLE: ActiviteContribuable[] = [
  {
    id: 'ACT-001',
    nom: 'Étal Légumes Cocovico',
    type: 'commerce',
    regime: 'Taxe entreprenant — commerce',
    compte: '70262',
    taxeMensuelle: 30_000,
    ca: 18_000_000,
    adresse: 'Étal B-214, Marché Cocovico',
    quartier: 'Cocovico',
    nui: 'NUI-2026-12401',
    statut: 'actif',
    dateEnreg: 'Janvier 2026',
  },
  {
    id: 'ACT-002',
    nom: 'Salon Bijou',
    type: 'services',
    regime: 'Taxe entreprenant — services',
    compte: '70262',
    taxeMensuelle: 3_750,
    ca: 1_800_000,
    adresse: 'Rue des Jardins, Cocody Riviera 2',
    quartier: 'Cocody Riviera 2',
    nui: 'NUI-2026-12401',
    statut: 'actif',
    dateEnreg: 'Février 2026',
  },
  {
    id: 'ACT-003',
    nom: 'Maquis Le Boulevard',
    type: 'nuit_ent',
    regime: 'Taxe établissements de nuit — forfait',
    compte: '7038',
    taxeMensuelle: 3_000,
    adresse: 'Angré 8ème tranche, Cocody',
    quartier: 'Angré',
    nui: 'NUI-2026-12401',
    statut: 'en_attente',
    dateEnreg: 'Avril 2026',
  },
]

const PSP_LIST = [
  { id: 'orange', name: 'Orange Money', color: '#FF7900', prefix: '07 XX XX XX' },
  { id: 'mtn',    name: 'MTN Money',    color: '#FFCC00', prefix: '05 XX XX XX' },
  { id: 'wave',   name: 'Wave',         color: '#1DC9F5', prefix: '—' },
  { id: 'moov',   name: 'Moov Money',   color: '#00A0E9', prefix: '01 XX XX XX' },
]

const HISTORIQUE = [
  { num: 'RC-2026-18501', date: '14/04/2026', type: 'Taxe entreprenant (commerce)', montant: 30_000,  psp: 'Orange Money', status: 'ok' },
  { num: 'RC-2026-17840', date: '13/04/2026', type: 'Taxe entreprenant (commerce)', montant: 30_000,  psp: 'Wave',         status: 'ok' },
  { num: 'RC-2026-17103', date: '12/04/2026', type: 'Taxe entreprenant (commerce)', montant: 30_000,  psp: 'MTN Money',    status: 'ok' },
  { num: 'RC-2026-16288', date: '11/04/2026', type: 'Taxe entreprenant (commerce)', montant: 0,       psp: '—',            status: 'late' },
  { num: 'RC-2026-15541', date: '10/04/2026', type: 'Taxe entreprenant (commerce)', montant: 30_000,  psp: 'Orange Money', status: 'ok' },
]

// ── Topnav ──
function Topnav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const { isTablet } = useBreakpoint()

  const NAV_ITEMS = [
    { id: 'home'              as Screen, label: 'Accueil' },
    { id: 'mes_activites'     as Screen, label: 'Mes activités' },
    { id: 'nouvelle_activite' as Screen, label: 'Déclarer' },
    { id: 'declaration'       as Screen, label: 'Payer mes taxes' },
    { id: 'historique'        as Screen, label: 'Mes reçus' },
    { id: 'bareme'            as Screen, label: 'Barème' },
  ]

  return (
    <nav style={{
      background: 'var(--lagune-900)',
      padding: isTablet ? '0 16px' : '0 24px',
      minHeight: 58,
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'sticky', top: 0, zIndex: 50,
      flexWrap: 'wrap',
    }}>
      {/* Logo */}
      <button onClick={() => go('home')} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-cocody.png" alt="Cocody" style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(255,255,255,.9)', padding: 2 }} />
        {!isTablet && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: '#fff' }}>CoTax</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', letterSpacing: '.07em', textTransform: 'uppercase' }}>Portail · Cocody</div>
          </div>
        )}
      </button>

      {/* Titre screen courant — mobile seulement */}
      {isTablet && (
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: '#fff', flex: 1, minWidth: 0, padding: '14px 0' }}>
          {NAV_ITEMS.find(n => n.id === screen)?.label ?? 'CoTax Portail'}
        </span>
      )}

      {/* Liens nav — desktop seulement */}
      {!isTablet && (
        <div style={{ display: 'flex', gap: 2, marginLeft: 20, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => go(item.id)} style={{
              color: screen === item.id ? '#fff' : 'rgba(255,255,255,.65)',
              padding: '6px 11px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: 0,
              background: screen === item.id ? 'rgba(255,255,255,.15)' : 'transparent',
              fontFamily: 'var(--font-ui)', transition: 'all .15s', whiteSpace: 'nowrap',
            }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Actions droite */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, padding: isTablet ? '12px 0' : 0 }}>
        {!isTablet && (
          <button onClick={() => go('declaration')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--lagune-500)', color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
          }}>
            <FileText size={14} /> Payer
          </button>
        )}
        <button onClick={() => go('profil')} style={{
          width: 34, height: 34, borderRadius: '50%', background: 'var(--forest-600)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>
          AK
        </button>
      </div>
    </nav>
  )
}

// ── BottomNav — barre fixe en bas, rendue uniquement sur tablette/mobile ──
function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const { isTablet } = useBreakpoint()

  // Ne pas rendre du tout sur desktop → zéro risque de bloquer les clics
  if (!isTablet) return null

  const items: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'home',          label: 'Accueil',    icon: <Home size={22} strokeWidth={1.5} /> },
    { id: 'mes_activites', label: 'Activités',  icon: <Store size={22} strokeWidth={1.5} /> },
    { id: 'declaration',   label: 'Payer',      icon: <CreditCard size={22} strokeWidth={1.5} /> },
    { id: 'historique',    label: 'Reçus',      icon: <Receipt size={22} strokeWidth={1.5} /> },
    { id: 'profil',        label: 'Profil',     icon: <div style={{ width: 24, height: 24, borderRadius: '50%', background: screen === 'profil' ? 'var(--lagune-600)' : 'var(--fg-3)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AK</div> },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--paper-0)', borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '6px 0',
      paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
    }}>
      {items.map(({ id, label, icon }) => {
        const active = screen === id
        return (
          <button key={id} onClick={() => go(id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: active ? 'var(--lagune-600)' : 'var(--fg-3)',
            fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: active ? 600 : 500,
            padding: '4px 12px', borderRadius: 10, minWidth: 54,
            transition: 'color 150ms',
          }}>
            {icon}
            {label}
          </button>
        )
      })}
    </nav>
  )
}

// ── Screen: Home ──
function ScreenHome({ go }: { go: (s: Screen) => void }) {
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, var(--lagune-900) 0%, var(--lagune-700) 100%)',
        padding: isMobile ? '40px 20px' : isTablet ? '52px 32px' : '64px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/assets/pattern-kita.svg')",
          backgroundSize: 260, opacity: .06,
          filter: 'brightness(0) invert(1)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 26 : isTablet ? 32 : 38,
            fontWeight: 700,
            color: '#fff', letterSpacing: '-.5px', marginBottom: 14, lineHeight: 1.2,
          }}>
            Déclarez, payez et suivez vos taxes municipales en ligne
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,.75)', marginBottom: 28, lineHeight: 1.6 }}>
            Orange Money, MTN, Wave ou virement bancaire. Reçu PDF immédiat. Conforme au barème fiscal 2026 de la Commune de Cocody.
          </p>
          <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
            <button onClick={() => go('nouvelle_activite')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              background: '#fff', color: 'var(--lagune-800)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              width: isMobile ? '100%' : undefined,
              justifyContent: 'center',
            }}>
              <PlusCircle size={16} /> Déclarer une activité
            </button>
            <button onClick={() => go('declaration')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              background: 'rgba(255,255,255,.12)', color: '#fff',
              border: '1px solid rgba(255,255,255,.25)', cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              width: isMobile ? '100%' : undefined,
              justifyContent: 'center',
            }}>
              <CreditCard size={16} /> Payer mes taxes
            </button>
            <button onClick={() => go('historique')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.8)',
              border: '1px solid rgba(255,255,255,.15)', cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              width: isMobile ? '100%' : undefined,
              justifyContent: 'center',
            }}>
              <History size={16} /> Mes reçus
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--lagune-600)', fontWeight: 700, marginBottom: 8 }}>Comment ça marche</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: '-.3px' }}>Simple, rapide, sécurisé</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 20 }}>
          {[
            { ico: <FileText size={28} />, title: 'Déclarez votre activité', txt: "Renseignez votre type d'activité et chiffre d'affaires. Le calcul de votre taxe est automatique selon le barème officiel 2026.", color: 'var(--lagune-600)' },
            { ico: <CreditCard size={28} />, title: 'Payez en mobile money', txt: 'Orange Money, MTN Money, Wave ou Moov. Paiement sécurisé PSP conforme aux normes UEMOA/BCEAO.', color: 'var(--forest-600)' },
            { ico: <Receipt size={28} />, title: 'Téléchargez votre reçu', txt: 'Reçu PDF généré instantanément, envoyé par SMS et disponible en ligne. Vérifiable par QR code.', color: 'var(--ocre-600, #c08030)' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--elev-1)', padding: 22, textAlign: 'center',
              borderTop: `3px solid ${f.color}`,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `color-mix(in srgb, ${f.color} 12%, transparent)`, color: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
              }}>{f.ico}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>{f.txt}</div>
            </div>
          ))}
        </div>

        {/* CTA quick-access */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 16, marginTop: 28 }}>
          {[
            { ico: <PlusCircle size={22} />, title: 'Déclarer une activité', sub: "Enregistrez votre commerce, salon, restaurant… sans vous déplacer.", bg: 'var(--lagune-100)', color: 'var(--lagune-700)', screen: 'nouvelle_activite' as Screen },
            { ico: <Calculator size={22} />, title: 'Payer mes taxes', sub: 'Taxe entreprenant, locaux loués, vendeur ambulant…', bg: 'var(--forest-100)', color: 'var(--forest-700)', screen: 'declaration' as Screen },
            { ico: <History size={22} />, title: 'Mes paiements', sub: 'Historique, reçus PDF, attestations fiscales.', bg: 'var(--ocre-100)', color: 'var(--ocre-700)', screen: 'historique' as Screen },
            { ico: <BookOpen size={22} />, title: 'Barème fiscal 2026', sub: 'Délibération N°2025-172 — tous les tarifs et comptes SYSCOHADA.', bg: 'var(--paper-50)', color: 'var(--fg-2)', screen: 'bareme' as Screen },
          ].map(c => (
            <button key={c.title} onClick={() => go(c.screen)} style={{
              display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer', width: '100%', textAlign: 'left',
              background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--elev-1)', padding: 18, fontFamily: 'var(--font-ui)',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.ico}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 3, fontSize: 14 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{c.sub}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Tax categories barème */}
        <div style={{ marginTop: 48 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--lagune-600)', fontWeight: 700, marginBottom: 8 }}>Barème fiscal 2026</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-.3px' }}>Délibération N°2025-172/CC/CM/SG</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 12 }}>
            {BAREME_COMPLET[0].chapitres.flatMap(ch => ch.sections).map(section => (
              <div key={section.compte} style={{
                background: 'var(--paper-0)', borderRadius: 12, border: '1px solid var(--border-subtle)',
                padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--lagune-100)', color: 'var(--lagune-700)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                }}>{section.compte}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg-1)', marginBottom: 2 }}>{section.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>Compte {section.compte}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
                    {typeof section.lignes[0]?.montant === 'number'
                      ? <><b>{formatAmount(section.lignes[0].montant)} FCFA</b> · {section.lignes[0].unite.split(' par ')[1] ?? section.lignes[0].unite}</>
                      : <b>{section.lignes[0]?.montant}</b>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Screen: Declaration wizard ──
function ScreenDeclaration({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState<DeclaStep>(0)
  const [activiteSelectId, setActiviteSelectId] = useState<string | null>(null)
  const [taxType, setTaxType] = useState('commerce')
  const [ca, setCa] = useState('1 800 000')
  const [pispiTab, setPispiTab] = useState<'qr' | 'alias'>('qr')
  const [pispiAlias, setPispiAlias] = useState('')
  const [pispiTimer, setPispiTimer] = useState(900)
  const [pispiStarted, setPispiStarted] = useState(false)
  const [loading, setLoading] = useState(false)

  // ── AI assistant state ──
  const [aiStep, setAiStep] = useState<'idle' | 'open' | 'loading' | 'result' | 'error'>('idle')
  const [aiDesc, setAiDesc] = useState('')
  const [aiLocal, setAiLocal] = useState('')
  const [aiPatente, setAiPatente] = useState('')
  const [aiCa, setAiCa] = useState('')
  const [aiResult, setAiResult] = useState<AiAssietteResult | null>(null)
  const [aiError, setAiError] = useState('')

  const analyserAssiette = async () => {
    setAiStep('loading')
    setAiError('')
    try {
      const res = await fetch('/api/assiette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: aiDesc,
          reponses: {
            'Local commercial': aiLocal,
            'Assujetti à la patente': aiPatente,
            'CA annuel estimé': aiCa,
          },
        }),
      })
      const data: AiAssietteResult & { error?: string } = await res.json()
      if (data.taxType) {
        setAiResult(data)
        setAiStep('result')
      } else {
        setAiError(data.justification ?? data.error ?? "Résultat inattendu. Remplissez le formulaire manuellement.")
        setAiStep('error')
      }
    } catch {
      setAiError("Erreur de connexion à l'assistant. Remplissez le formulaire manuellement.")
      setAiStep('error')
    }
  }

  const confirmerAssistant = () => {
    if (!aiResult) return
    setTaxType(aiResult.taxType)
    if (aiCa.trim()) setCa(aiCa.trim())
    setAiStep('idle')
  }

  const taux = taxType === 'services' ? 2.5 : taxType === 'loue' ? 1 : 2
  const caNum = parseInt(ca.replace(/\s/g, '')) || 0
  const isForfait = ['ambulant', 'nuit_ent', 'charrette', 'pub_papier'].includes(taxType)
  const forfaitMap: Record<string, number> = { ambulant: 100, nuit_ent: 3_000, charrette: 1_000, pub_papier: 200 }
  const taxe = isForfait ? (forfaitMap[taxType] ?? 100) : Math.round(caNum * taux / 100 / 12)

  useEffect(() => {
    if (step !== 3 || !pispiStarted) return
    if (pispiTimer <= 0) return
    const id = setInterval(() => setPispiTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [step, pispiStarted, pispiTimer])

  const typeLabel: Record<string, string> = {
    commerce:   'Taxe entreprenant — commerce (2 %)',
    services:   'Taxe entreprenant — services (2,5 %)',
    ambulant:   'Vendeur ambulant / étalage marché (100 F/j)',
    loue:       'Taxe locaux loués en garnis (1 %–5 %)',
    nuit_ent:   'Taxe établissements de nuit — forfait (3 000 F/mois)',
    nuit_pat:   'Taxe établissements de nuit — boissons patente (52 500 F/mois)',
    taxi:       'Taxe taxis communaux (20 000 F/trimestre)',
    spectacle:  'Taxe spectacles et galas (10 % recettes)',
    sport:      'Taxe manifestations sportives (5 % recettes)',
    charrette:  'Taxe charrettes à bras (1 000 F/mois)',
    pub_papier: 'Taxe publicité — affiche papier (200 F/m²/mois)',
    pub_enseigne:'Taxe publicité — enseigne peinte (1 000 F/m²/mois)',
  }
  const compteMap: Record<string, string> = {
    commerce: '70262', services: '70262', ambulant: '70262',
    loue: '7027',
    nuit_ent: '7038', nuit_pat: '7038',
    taxi: '7041',
    spectacle: '7036', sport: '7034',
    charrette: '7031',
    pub_papier: '7042', pub_enseigne: '7042',
  }

  const selectActivite = (act: ActiviteContribuable) => {
    setActiviteSelectId(act.id)
    setTaxType(act.type)
    if (act.ca) setCa(String(act.ca))
    setStep(2)
  }

  const goStep3 = () => { setPispiTimer(900); setPispiStarted(true); setStep(3) }
  const submit = () => { setLoading(true); setTimeout(() => { setLoading(false); setStep('done') }, 1600) }
  const formatTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const STEPS = ['Activité', 'Calcul', 'Paiement']

  if (step === 'done') {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--forest-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 0 0 8px var(--forest-100)',
          }}>
            <CheckCircle size={34} style={{ color: 'var(--forest-700)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Paiement confirmé</h2>
          <p style={{ color: 'var(--fg-3)', fontSize: 14, marginBottom: 28 }}>
            PI-SPI · {formatAmount(taxe)} FCFA · {typeLabel[taxType]}
          </p>

          {/* Receipt paper */}
          <div style={{
            background: '#fff', borderRadius: 12, padding: 24,
            border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12,
            maxWidth: 340, margin: '0 auto 28px', textAlign: 'left', boxShadow: 'var(--elev-2)',
          }}>
            <div style={{ textAlign: 'center', paddingBottom: 12, borderBottom: '1px dashed var(--border)', marginBottom: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-cocody.png" style={{ width: 38, height: 38, marginBottom: 4 }} alt="Cocody" />
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--lagune-900)' }}>MAIRIE DE COCODY</div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '.07em' }}>PORTAIL FISCAL · CoTax</div>
            </div>
            {([
              ['N° reçu', 'RC-2026-18501'],
              ['Date', '25/04/2026 14:23'],
              ['NUI', 'NUI-2026-12401'],
              ['Contribuable', 'Adjoua Kouamé'],
              ['Type', typeLabel[taxType]],
              ['Compte', compteMap[taxType] ?? '70262'],
              ['Paiement', 'PI-SPI · BCEAO'],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 11 }}>
                <span style={{ color: 'var(--fg-3)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, textAlign: 'center',
              padding: '12px 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', margin: '10px 0',
            }}>
              {formatAmount(taxe)} FCFA
            </div>
            <div style={{ fontSize: 10, textAlign: 'center', color: 'var(--fg-3)', lineHeight: 1.5 }}>
              Vérifier : cocody.ci/v/18501<br />Conservation obligatoire 5 ans
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}>
              <Download size={14} /> Télécharger PDF
            </button>
            <button onClick={() => go('historique')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}>
              <History size={14} /> Voir mes paiements
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: '-.4px', marginBottom: 4 }}>Payer mes taxes</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-3)' }}>Sélectionnez une activité enregistrée · Délibération N°2025-172/CC/CM/SG</p>
      </div>

      {/* ── Step 0 — Sélection de l'activité ── */}
      {step === 0 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 12 }}>Choisissez l&apos;activité à régulariser</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITES_CONTRIBUABLE.map(act => (
                <button
                  key={act.id}
                  onClick={() => selectActivite(act)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--paper-0)', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-ui)', transition: 'border-color .15s',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>{act.nom}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                        padding: '2px 7px', borderRadius: 999,
                        background: act.statut === 'actif' ? 'var(--forest-100)' : 'var(--ocre-100)',
                        color: act.statut === 'actif' ? 'var(--forest-900)' : 'var(--ocre-900)',
                      }}>{act.statut === 'actif' ? 'Actif' : 'En attente'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{act.regime} · Compte {act.compte}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{act.adresse}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--lagune-700)' }}>{formatAmount(act.taxeMensuelle)}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>FCFA / mois</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', flexShrink: 0 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button
            onClick={() => { setActiviteSelectId(null); setStep(1) }}
            style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px dashed var(--border-strong)', background: 'transparent', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
          >
            + Déclarer une activité non enregistrée
          </button>
        </div>
      )}

      {/* Step indicator (visible seulement pour steps 1–3) */}
      {typeof step === 'number' && step >= 1 && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {STEPS.map((label, i) => {
          const n = i + 1
          const stepNum = typeof step === 'number' ? step : 4
          const isDone = stepNum > n
          const isActive = stepNum === n
          return (
            <React.Fragment key={label}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: isDone ? 'pointer' : 'default' }}
                onClick={() => isDone && setStep(n as DeclaStep)}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  background: isDone ? 'var(--forest-600)' : isActive ? 'var(--lagune-600)' : 'var(--bg-sunken)',
                  color: isDone || isActive ? '#fff' : 'var(--fg-3)',
                  boxShadow: isActive ? '0 0 0 4px var(--lagune-100)' : 'none',
                }}>
                  {isDone ? '✓' : n}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: isActive ? 'var(--lagune-700)' : isDone ? 'var(--fg-2)' : 'var(--fg-3)',
                }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: '0 8px', minWidth: 24,
                  background: isDone ? 'var(--forest-500)' : 'var(--border)',
                }} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      )}

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: isMobile ? 16 : 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Votre activité</h2>

          {/* ── Assistant fiscal IA ── */}
          <div style={{ marginBottom: 20, borderRadius: 12, border: '1px solid var(--lagune-200)', background: 'var(--lagune-50)', overflow: 'hidden' }}>
            {/* Header toggle */}
            <button
              onClick={() => setAiStep(s => s === 'idle' ? 'open' : (s === 'open' ? 'idle' : s))}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-ui)' }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--lagune-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={14} style={{ color: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--lagune-900)' }}>Assistant fiscal IA</div>
                <div style={{ fontSize: 11, color: 'var(--lagune-600)' }}>Décrivez votre activité — je détermine votre régime automatiquement</div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--lagune-600)', transform: aiStep !== 'idle' ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
            </button>

            {/* Questionnaire */}
            {aiStep === 'open' && (
              <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '14px 14px 16px' }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lagune-700)', marginBottom: 4 }}>Décrivez votre activité *</label>
                  <textarea
                    value={aiDesc}
                    onChange={e => setAiDesc(e.target.value)}
                    placeholder="Ex : Je tiens une boutique d'épicerie au marché Cocovico, je vends des conserves et produits alimentaires. Je ne suis pas à la patente."
                    rows={3}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--lagune-300)', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  {[
                    {
                      label: 'Local commercial',
                      val: aiLocal, set: setAiLocal,
                      opts: ['Boutique / atelier fixe', 'Étal en marché', 'Ambulant (pas de local)', 'Domicile / télétravail'],
                    },
                    {
                      label: 'Assujetti à la patente ?',
                      val: aiPatente, set: setAiPatente,
                      opts: ['Oui (SARL / EI formel)', 'Non (petit commerce)', 'Je ne sais pas'],
                    },
                  ].map(({ label, val, set, opts }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lagune-700)', marginBottom: 4 }}>{label}</label>
                      <select
                        value={val}
                        onChange={e => set(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--lagune-300)', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: 12, color: val ? 'var(--fg-1)' : 'var(--fg-3)' }}
                      >
                        <option value="">— Choisir —</option>
                        {opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lagune-700)', marginBottom: 4 }}>CA annuel estimé (FCFA) — facultatif</label>
                  <input
                    value={aiCa}
                    onChange={e => setAiCa(e.target.value)}
                    placeholder="Ex : 1 800 000"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--lagune-300)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={analyserAssiette}
                  disabled={!aiDesc.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: aiDesc.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-ui)', background: aiDesc.trim() ? 'var(--lagune-600)' : 'var(--bg-sunken)', color: aiDesc.trim() ? '#fff' : 'var(--fg-3)' }}
                >
                  <Sparkles size={13} /> Analyser mon profil fiscal
                </button>
              </div>
            )}

            {/* Loading */}
            {aiStep === 'loading' && (
              <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--lagune-300)', borderTopColor: 'var(--lagune-600)', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--lagune-700)', fontFamily: 'var(--font-ui)' }}>Analyse en cours…</span>
              </div>
            )}

            {/* Result */}
            {aiStep === 'result' && aiResult && (
              <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={15} style={{ color: 'var(--forest-600)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--lagune-900)' }}>{aiResult.regime}</span>
                  {!aiResult.fiable && <AlertCircle size={13} style={{ color: 'var(--ocre-600)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lagune-700)', marginBottom: 6 }}>
                  Compte {aiResult.compte} · {aiResult.assiette}
                  {aiResult.montantEstime > 0 && ` · ~${formatAmount(aiResult.montantEstime)} FCFA ${aiResult.periodeCalcul}`}
                </div>
                <p style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.55, marginBottom: 12 }}>{aiResult.justification}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={confirmerAssistant}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: 'var(--forest-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
                  >
                    <CheckCircle size={12} /> Appliquer ce régime
                  </button>
                  <button
                    onClick={() => setAiStep('open')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid var(--lagune-300)', color: 'var(--lagune-700)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
                  >
                    Modifier la description
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {aiStep === 'error' && (
              <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '12px 14px' }}>
                <div style={{ fontSize: 12, color: 'var(--terra-700)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{aiError}</span>
                </div>
                <button onClick={() => setAiStep('open')} style={{ marginTop: 8, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lagune-600)', fontFamily: 'var(--font-ui)', fontWeight: 600, padding: 0 }}>
                  ↩ Réessayer
                </button>
              </div>
            )}
          </div>

          {/* divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 500, flexShrink: 0 }}>ou remplissez directement</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {[
            { label: 'Type de contribuable *', node: (
              <select value={taxType} onChange={e => setTaxType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }}>
                <optgroup label="Compte 70262 — Taxe entreprenant">
                  <option value="commerce">Commerce / négoce — 2 % du CA annuel</option>
                  <option value="services">Prestations de services / artisanat — 2,5 % du CA annuel</option>
                  <option value="ambulant">Vendeur ambulant / étalage marché (CA &lt; 1 200 000 F) — 100 F/jour</option>
                </optgroup>
                <optgroup label="Compte 7027 — Locaux loués en garnis">
                  <option value="loue">Hôtel, résidence meublée, chambre meublée — 1 %–5 % valeur locative/mois</option>
                </optgroup>
                <optgroup label="Compte 7038 — Établissements de nuit">
                  <option value="nuit_ent">Bar / buvette (exploitant entreprenant) — 3 000 F/mois</option>
                  <option value="nuit_pat">Bar / club — boissons (assujetti patente) — 52 500 F/mois</option>
                </optgroup>
                <optgroup label="Compte 7041 — Taxis communaux">
                  <option value="taxi">Taxi communal (wôrô-wôrô) — 20 000 F/trimestre</option>
                </optgroup>
                <optgroup label="Comptes 7034 / 7035 / 7036 — Sport & spectacles">
                  <option value="spectacle">Spectacles, galas, concerts — 10 % des recettes brutes</option>
                  <option value="sport">Manifestation sportive payante — 5 % des recettes brutes</option>
                </optgroup>
                <optgroup label="Compte 7031 — Charrettes">
                  <option value="charrette">Charrette à bras — 1 000 F/mois</option>
                </optgroup>
                <optgroup label="Compte 7042 — Publicité">
                  <option value="pub_papier">Affiche papier — 200 F/m²/mois</option>
                  <option value="pub_enseigne">Enseigne peinte / protégée vitre — 1 000 F/m²/mois</option>
                </optgroup>
              </select>
            )},
            { label: 'NUI / RCCM *', node: (
              <input defaultValue="NUI-2026-12401" placeholder="Ex : NUI-2026-XXXXX" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }} />
            )},
          ].map(({ label, node }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>{label}</label>
              {node}
            </div>
          ))}
          {!isForfait && taxType !== 'spectacle' && taxType !== 'sport' && taxType !== 'taxi' && taxType !== 'loue' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>Chiffre d&apos;affaires annuel déclaré (FCFA) *</label>
              <input value={ca} onChange={e => setCa(e.target.value)} placeholder="Ex : 1 800 000" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg-1)' }} />
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>Commune de rattachement</label>
            <select style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }}>
              <option>Commune de Cocody</option>
            </select>
          </div>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setStep(2)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              Calculer la taxe <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: isMobile ? 16 : 24 }}>
          {activiteSelectId && (() => {
            const act = ACTIVITES_CONTRIBUABLE.find(a => a.id === activiteSelectId)
            if (!act) return null
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--lagune-50)', border: '1px solid var(--lagune-100)', marginBottom: 18 }}>
                <CheckCircle size={14} style={{ color: 'var(--lagune-600)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--lagune-900)' }}>{act.nom}</span>
                  <span style={{ fontSize: 12, color: 'var(--lagune-600)', marginLeft: 8 }}>{act.regime}</span>
                </div>
                <button onClick={() => { setActiviteSelectId(null); setStep(0) }} style={{ fontSize: 11, color: 'var(--lagune-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>Changer</button>
              </div>
            )
          })()}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Calcul automatique</h2>
          <div style={{ background: 'var(--lagune-50)', border: '1px solid var(--lagune-200)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--lagune-600)', fontWeight: 700, marginBottom: 8 }}>Taxe mensuelle calculée</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, color: 'var(--lagune-800)', letterSpacing: '-.5px', fontVariantNumeric: 'tabular-nums' }}>
              {formatAmount(taxe)}
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--lagune-600)', marginLeft: 8, letterSpacing: '.07em', textTransform: 'uppercase' }}>FCFA</span>
            </div>
            {!isForfait && taxType !== 'spectacle' && taxType !== 'sport' && taxType !== 'taxi' && taxType !== 'loue' ? (
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>CA annuel : {formatAmount(caNum)} FCFA × {taux} % ÷ 12 mois</div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>{typeLabel[taxType]}</div>
            )}
          </div>
          <div style={{ background: 'var(--bg-sunken)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }}>
            {[['Type', typeLabel[taxType]], ['Compte budgétaire', compteMap[taxType] ?? '70262'], ['Période', 'Avril 2026']].map(([k, v], idx, arr) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: idx < arr.length - 1 ? 6 : 0 }}>
                <span style={{ color: 'var(--fg-3)' }}>{k}</span>
                <span style={{ fontWeight: 600, fontFamily: k === 'Compte budgétaire' ? 'var(--font-mono)' : 'var(--font-ui)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              <ChevronLeft size={14} /> Modifier
            </button>
            <button onClick={goStep3} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              Payer maintenant <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3 — PI-SPI ── */}
      {step === 3 && (() => {
        const WALLETS = [
          { name: 'Wave',         logo: 'https://play-lh.googleusercontent.com/NgAdQMq9Mu2NTJredx6COxScVB3tp153h_bVKQTXUt9Aou0Lz1PfffaQt5jFN9jlBfo' },
          { name: 'Orange Money', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrFECDLyctXif_Z8j4phD8f3Pe5tiEq_AWZg&s' },
          { name: 'MTN MoMo',    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRREHzuiDDG6LBrf_qEjhbqEkvsCzYF5Tg5dI9CsoDgDwUj4z_IWVZ--_uhRUU0dTQgs-0&usqp=CAU' },
          { name: 'Moov Money',  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_oO0OKHN4zOlbVzs6iXrmSuZVV-UrqvmGUg&s' },
          { name: 'Djamo',       logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQEWIf9Awxo34w/company-logo_200_200/company-logo_200_200/0/1630548736125/djamoapp_logo?e=2147483647&v=beta&t=4IjMaezLbWFPXlAr3X370jC9ynU_ctyefgg2-lk5EGw' },
          { name: 'Carte',       logo: 'https://cdn-icons-png.flaticon.com/512/6963/6963703.png' },
        ]
        const canConfirm = pispiTab === 'qr' || pispiAlias.trim().length > 0
        return (
          <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>

            {/* Bandeau supérieur gradient */}
            <div style={{ background: 'linear-gradient(135deg, var(--lagune-900) 0%, var(--lagune-700) 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/pispi-logo.png" alt="PI-SPI" width={40} height={40} style={{ borderRadius: 10, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-ui)', fontWeight: 600, marginBottom: 2 }}>Paiement sécurisé</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-.2px' }}>PI-SPI · BCEAO</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-ui)', marginBottom: 2 }}>Montant dû</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>
                  {formatAmount(taxe)} <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>FCFA</span>
                </div>
              </div>
            </div>

            <div style={{ padding: isMobile ? '16px' : '20px 24px' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', background: 'var(--bg-sunken)', borderRadius: 10, padding: 3, marginBottom: 20 }}>
                {(['qr', 'alias'] as const).map(t => (
                  <button key={t} onClick={() => setPispiTab(t)} style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                    background: pispiTab === t ? 'var(--paper-0)' : 'transparent',
                    color: pispiTab === t ? 'var(--fg-1)' : 'var(--fg-3)',
                    transition: 'all var(--dur-fast) var(--ease-standard)',
                  }}>
                    {t === 'qr' ? 'Scanner le QR code' : 'Saisir un alias'}
                  </button>
                ))}
              </div>

              {/* QR tab */}
              {pispiTab === 'qr' && (
                <div style={{ textAlign: 'center' }}>
                  {/* QR + logo centré */}
                  <div style={{ display: 'inline-block', position: 'relative', padding: 8, background: 'var(--paper-0)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 14 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=188x188&data=PISPI%3ACOTAX%3ACOCODY%3A${taxe}%3A${compteMap[taxType] ?? '70262'}%3ARC-2026-18501&qzone=1&color=082B57`}
                      alt="QR code PI-SPI" width={188} height={188}
                      style={{ display: 'block', borderRadius: 6 }}
                    />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 8, padding: 3 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/pispi-logo.png" alt="PI-SPI" width={36} height={36} style={{ display: 'block', borderRadius: 6 }} />
                    </div>
                  </div>

                  {/* Réf + timer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, fontSize: 12 }}>
                    <span style={{ color: 'var(--fg-3)' }}>Réf <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-1)', fontWeight: 600 }}>RC-2026-18501</span></span>
                    <span style={{ width: 1, height: 10, background: 'var(--border-strong)', display: 'inline-block' }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: pispiTimer < 60 ? 'var(--terra-600)' : 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      <Clock size={11} style={{ flexShrink: 0 }} />{formatTimer(pispiTimer)}
                    </span>
                  </div>

                  {/* Wallets acceptés — logos */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {WALLETS.map(w => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={w.name} src={w.logo} alt={w.name} title={w.name} width={30} height={30}
                        style={{ borderRadius: 8, border: '1px solid var(--border)', objectFit: 'cover', background: 'var(--paper-0)' }}
                      />
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>+ banques UEMOA</span>
                  </div>
                </div>
              )}

              {/* Alias tab */}
              {pispiTab === 'alias' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 6 }}>Votre alias de paiement</label>
                  <input
                    value={pispiAlias}
                    onChange={e => setPispiAlias(e.target.value)}
                    placeholder="+225 07 XX XX XX XX"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--fg-1)', marginBottom: 8 }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 16 }}>Numéro de téléphone, identifiant wallet ou alias bancaire UEMOA</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4, alignItems: 'center' }}>
                    {WALLETS.map(w => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={w.name} src={w.logo} alt={w.name} title={w.name} width={28} height={28}
                        style={{ borderRadius: 7, border: '1px solid var(--border)', objectFit: 'cover', background: 'var(--paper-0)' }}
                      />
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>+ banques UEMOA</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setStep(2)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
                  <ChevronLeft size={14} /> Retour
                </button>
                <button
                  onClick={submit}
                  disabled={loading || !canConfirm}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
                    borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none',
                    fontFamily: 'var(--font-ui)', letterSpacing: '.01em',
                    background: !canConfirm ? 'var(--bg-sunken)' : 'var(--secondary)',
                    color: !canConfirm ? 'var(--fg-3)' : 'var(--secondary-on)',
                    cursor: loading ? 'wait' : !canConfirm ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading
                    ? <><div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', animation: 'spin .7s linear infinite' }} />Traitement…</>
                    : pispiTab === 'qr'
                      ? <><CheckCircle size={14} />Paiement scanné — confirmer</>
                      : <>Envoyer la demande<ArrowRight size={14} /></>
                  }
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ── Screen: Historique ──
function ScreenHistorique({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  const totalPaye = HISTORIQUE.filter(r => r.status === 'ok').reduce((s, r) => s + r.montant, 0)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: '-.4px', marginBottom: 4 }}>Mes paiements</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-3)' }}>Historique complet · Avril 2026</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total payé (avril)', value: formatAmount(totalPaye), unit: 'FCFA', color: 'var(--forest-600)' },
          { label: 'Reçus émis', value: String(HISTORIQUE.filter(r => r.status === 'ok').length), unit: 'reçus', color: 'var(--lagune-600)' },
          { label: 'Jours en retard', value: '1', unit: 'à régulariser', color: 'var(--terra-600)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', padding: '16px 20px', boxShadow: 'var(--elev-1)' }}>
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: c.color, letterSpacing: '-.02em' }}>
              {c.value}<span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginLeft: 6, fontWeight: 500 }}>{c.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: 'var(--elev-1)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 600 : 'auto' }}>
          <thead>
            <tr>
              {['N° reçu', 'Date', 'Type de taxe', 'Montant', 'PSP', 'Statut', ''].map((h, i) => (
                <th key={i} style={{ textAlign: i === 3 ? 'right' : 'left', padding: '9px 14px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, borderBottom: '1px solid var(--border)', background: 'var(--paper-50)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORIQUE.map(r => (
              <tr key={r.num}>
                <td style={{ padding: '11px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', borderBottom: '1px solid var(--border-subtle)' }}>{r.num}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-2)', borderBottom: '1px solid var(--border-subtle)' }}>{r.date}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-1)', borderBottom: '1px solid var(--border-subtle)' }}>{r.type}</td>
                <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, borderBottom: '1px solid var(--border-subtle)', color: r.status === 'ok' ? 'var(--fg-1)' : 'var(--terra-700)' }}>
                  {r.montant ? `${formatAmount(r.montant)} FCFA` : '—'}
                </td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-2)', borderBottom: '1px solid var(--border-subtle)' }}>{r.psp}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', background: r.status === 'ok' ? 'var(--forest-100)' : 'var(--terra-100)', color: r.status === 'ok' ? 'var(--forest-900)' : 'var(--terra-900)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: r.status === 'ok' ? 'var(--forest-600)' : 'var(--terra-500)', flexShrink: 0 }} />
                    {r.status === 'ok' ? 'Payé' : 'Impayé'}
                  </span>
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                  {r.status === 'ok' && (
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', fontFamily: 'var(--font-ui)' }}>
                      <Download size={12} /> PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button onClick={() => go('declaration')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
          <FileText size={14} /> Nouvelle déclaration
        </button>
      </div>
    </div>
  )
}

// ── Screen: Profil ──
function ScreenProfil({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  const totalMensuel = ACTIVITES_CONTRIBUABLE.filter(a => a.statut === 'actif').reduce((s, a) => s + a.taxeMensuelle, 0)
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: '-.4px', marginBottom: 4 }}>Mon profil</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-3)' }}>Contribuable enregistré à la Mairie de Cocody</p>
      </div>

      <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ocre-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>AK</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>Adjoua Kouamé</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>{ACTIVITES_CONTRIBUABLE.length} activités enregistrées · Cocody</div>
          </div>
        </div>

        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, marginBottom: 12 }}>Identité fiscale</div>
        {[
          ['NUI', 'NUI-2026-12401'],
          ['Commune', 'Cocody'],
          ['Téléphone', '+225 07 12 34 56 78'],
          ['Inscription', 'Janvier 2026'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 14, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--fg-3)' }}>{k}</span>
            <span style={{ fontWeight: 500, color: 'var(--fg-1)', fontFamily: ['NUI', 'Téléphone'].includes(k) ? 'var(--font-mono)' : 'var(--font-ui)' }}>{v}</span>
          </div>
        ))}

        {/* Activités résumé */}
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, marginTop: 20, marginBottom: 12 }}>
          Activités &amp; régimes fiscaux
        </div>
        {ACTIVITES_CONTRIBUABLE.map(act => (
          <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{act.nom}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{act.regime} · Cpt {act.compte}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--lagune-700)' }}>{formatAmount(act.taxeMensuelle)} F/mois</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, background: act.statut === 'actif' ? 'var(--forest-100)' : 'var(--ocre-100)', color: act.statut === 'actif' ? 'var(--forest-900)' : 'var(--ocre-900)' }}>
                {act.statut === 'actif' ? 'Actif' : 'Attente'}
              </span>
            </div>
          </div>
        ))}
        <button onClick={() => go('mes_activites')} style={{ marginTop: 12, fontSize: 12, color: 'var(--lagune-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, padding: 0 }}>
          Voir le détail complet →
        </button>

        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, marginTop: 20, marginBottom: 12 }}>Solde fiscal — Avril 2026</div>
        <div style={{ background: 'var(--forest-50)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--forest-200)' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--forest-700)', marginBottom: 2 }}>Total mensuel toutes activités</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--forest-900)' }}>{formatAmount(totalMensuel)} FCFA</div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'var(--forest-600)', color: '#fff' }}>À jour ✓</span>
        </div>
      </div>

      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--terra-700)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
        <LogOut size={14} /> Se déconnecter
      </button>
    </div>
  )
}

// ── Screen: Nouvelle activité ──
type ActStep = 1 | 2 | 3 | 'done'

function ScreenNouvelleActivite({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  const [step, setStep] = useState<ActStep>(1)
  const [categorie, setCategorie] = useState('')
  const [activiteId, setActiviteId] = useState('')
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [nui, setNui] = useState('')
  const [tel, setTel] = useState('')
  const [quartier, setQuartier] = useState('Cocody Riviera 1')
  const [quartierAuto, setQuartierAuto] = useState(false)
  const [gpsLat, setGpsLat] = useState('')
  const [gpsLng, setGpsLng] = useState('')
  const [gpsMode, setGpsMode] = useState<'auto' | 'manual' | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [loading, setLoading] = useState(false)

  const QUARTIERS = ['Cocody Riviera 1', 'Cocody Riviera 2', 'Cocody Riviera 3', 'Cocovico', 'Angré', 'II Plateaux', 'Danga', 'Blockhaus', 'Autres quartiers Cocody']

  const detectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Géolocalisation non supportée par ce navigateur.')
      setGpsMode('manual')
      return
    }
    setGpsLoading(true)
    setGpsError('')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        setGpsLat(lat)
        setGpsLng(lng)
        setGpsMode('auto')
        setGpsLoading(false)
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'fr' } }
          )
          if (r.ok) {
            const data = await r.json()
            if (!adresse && data.display_name) {
              setAdresse(data.display_name.split(',').slice(0, 3).join(', ').trim())
            }
            const suburb = (data.address?.suburb ?? data.address?.neighbourhood ?? '').toLowerCase()
            const matched = QUARTIERS.find(q => {
              const key = q.toLowerCase().replace('cocody ', '')
              return suburb.includes(key) || key.split(' ').every((w: string) => suburb.includes(w))
            })
            if (matched) { setQuartier(matched); setQuartierAuto(true) }
          }
        } catch { /* geocoding optionnel */ }
      },
      () => {
        setGpsError("Localisation refusée ou indisponible. Saisissez les coordonnées manuellement.")
        setGpsMode('manual')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // ── AI identification activité ──
  const [actAiStep, setActAiStep] = useState<'open' | 'loading' | 'result' | 'error' | 'closed'>('open')
  const [actAiDesc, setActAiDesc] = useState('')
  const [actAiSecteur, setActAiSecteur] = useState('')
  const [actAiResult, setActAiResult] = useState<ActAiResult | null>(null)
  const [actAiError, setActAiError] = useState('')

  const analyserActivite = async () => {
    setActAiStep('loading')
    setActAiError('')
    try {
      const res = await fetch('/api/activite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: actAiDesc,
          reponses: { 'Secteur / type de commerce': actAiSecteur },
        }),
      })
      const data: ActAiResult & { error?: string } = await res.json()
      if (data.activiteId) {
        setActAiResult(data)
        setActAiStep('result')
      } else {
        setActAiError(data.justification ?? data.error ?? "Résultat inattendu. Choisissez manuellement.")
        setActAiStep('error')
      }
    } catch {
      setActAiError("Erreur de connexion à l'assistant. Choisissez manuellement.")
      setActAiStep('error')
    }
  }

  const confirmerActivite = () => {
    if (!actAiResult) return
    setCategorie(actAiResult.categorie)
    setActiviteId(actAiResult.activiteId)
    setActAiStep('closed')
  }

  const activitesFiltrees = categorie
    ? TYPES_ACTIVITES.filter(a => a.categorie === categorie)
    : TYPES_ACTIVITES
  const activiteChoisie = TYPES_ACTIVITES.find(a => a.id === activiteId)

  const submit = () => { setLoading(true); setTimeout(() => { setLoading(false); setStep('done') }, 1800) }
  const STEPS = isMobile
    ? ['Activité', 'Infos', 'Docs']
    : ['Type d\'activité', 'Informations', 'Documents']

  if (step === 'done') {
    return (
      <div style={{ maxWidth: 580, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--lagune-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 0 0 8px var(--lagune-100)',
          }}>
            <CheckCircle size={34} style={{ color: 'var(--lagune-700)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Déclaration enregistrée</h2>
          <p style={{ color: 'var(--fg-3)', fontSize: 14, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Votre demande de déclaration d&apos;activité a été transmise à la Mairie de Cocody. Un agent se déplacera pour constater votre activité dans les <b>{activiteChoisie?.delaiTraitement ?? '5 jours ouvrés'}</b>.
          </p>

          <div style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', padding: '20px 24px', maxWidth: 400, margin: '0 auto 28px', textAlign: 'left' }}>
            <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, marginBottom: 14 }}>Récapitulatif</div>
            {[
              ['N° dossier', 'DA-2026-04289'],
              ['Activité', activiteChoisie?.label ?? '—'],
              ['Contribuable', nom || 'Adjoua Kouamé'],
              ['Adresse', adresse || '—'],
              ...(gpsLat && gpsLng ? [['GPS', `${gpsLat}, ${gpsLng}`] as [string, string]] : []),
              ['Étape suivante', 'Visite agent constat'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', fontSize: 13, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--fg-3)', flexShrink: 0 }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--fg-1)', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
            background: 'var(--ocre-100)', border: '1px solid var(--ocre-200)', borderRadius: 12,
            maxWidth: 400, margin: '0 auto 28px', textAlign: 'left',
          }}>
            <Clock size={18} style={{ color: 'var(--ocre-700)', flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: 'var(--ocre-900)', lineHeight: 1.5 }}>
              <b>Prochaine étape :</b> un agent de la brigade de constat passera vérifier votre établissement.
              Veillez à être présent avec les pièces requises.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => go('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              Retour à l&apos;accueil
            </button>
            <button onClick={() => go('historique')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              <History size={14} /> Suivi de mes dossiers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: '-.4px', marginBottom: 4 }}>Déclarer une activité</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-3)' }}>Enregistrez votre activité sans vous déplacer · Un agent passera constater dans les délais indiqués</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {STEPS.map((label, i) => {
          const n = i + 1
          const stepNum = typeof step === 'number' ? step : 4
          const isDone = stepNum > n
          const isActive = stepNum === n
          return (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: isDone ? 'pointer' : 'default' }} onClick={() => isDone && setStep(n as ActStep)}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, background: isDone ? 'var(--forest-600)' : isActive ? 'var(--lagune-600)' : 'var(--bg-sunken)', color: isDone || isActive ? '#fff' : 'var(--fg-3)', boxShadow: isActive ? '0 0 0 4px var(--lagune-100)' : 'none' }}>
                  {isDone ? '✓' : n}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? 'var(--lagune-700)' : isDone ? 'var(--fg-2)' : 'var(--fg-3)' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, margin: '0 8px', minWidth: 24, background: isDone ? 'var(--forest-500)' : 'var(--border)' }} />}
            </React.Fragment>
          )
        })}
      </div>

      {/* ── Step 1: Type d'activité ── */}
      {step === 1 && (
        <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: isMobile ? 16 : 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Décrivez votre activité</h2>

          {/* ── Assistant IA — identification activité ── */}
          {actAiStep !== 'closed' && (
            <div style={{ marginBottom: 20, borderRadius: 12, border: '1px solid var(--lagune-200)', background: 'var(--lagune-50)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--lagune-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={14} style={{ color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--lagune-900)' }}>Identification automatique</div>
                  <div style={{ fontSize: 11, color: 'var(--lagune-600)' }}>Décrivez votre activité — l&apos;IA détermine votre catégorie et type d&apos;enregistrement</div>
                </div>
              </div>

              {/* Formulaire description */}
              {actAiStep === 'open' && (
                <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '14px 14px 16px' }}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lagune-700)', marginBottom: 4 }}>Décrivez votre activité *</label>
                    <textarea
                      value={actAiDesc}
                      onChange={e => setActAiDesc(e.target.value)}
                      placeholder="Ex : Je tiens un salon de coiffure mixte au quartier Riviera 2, avec 2 employés. Je vends aussi des produits capillaires. Je ne suis pas à la patente."
                      rows={3}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--lagune-300)', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-1)', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--lagune-700)', marginBottom: 4 }}>Secteur principal (facultatif)</label>
                    <select
                      value={actAiSecteur}
                      onChange={e => setActAiSecteur(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--lagune-300)', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: 12, color: actAiSecteur ? 'var(--fg-1)' : 'var(--fg-3)' }}
                    >
                      <option value="">— Préciser le secteur (optionnel) —</option>
                      {['Commerce & distribution', 'Artisanat & services à la personne', 'Restauration & alimentation', 'Transport', 'Santé & bien-être', 'Hôtellerie & hébergement', 'Événementiel & spectacle', 'Publicité & communication', 'Marché / ambulant', 'Autre'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={analyserActivite}
                    disabled={!actAiDesc.trim()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: actAiDesc.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-ui)', background: actAiDesc.trim() ? 'var(--lagune-600)' : 'var(--bg-sunken)', color: actAiDesc.trim() ? '#fff' : 'var(--fg-3)' }}
                  >
                    <Sparkles size={13} /> Identifier mon activité
                  </button>
                </div>
              )}

              {/* Chargement */}
              {actAiStep === 'loading' && (
                <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--lagune-300)', borderTopColor: 'var(--lagune-600)', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--lagune-700)', fontFamily: 'var(--font-ui)' }}>Identification en cours…</span>
                </div>
              )}

              {/* Résultat */}
              {actAiStep === 'result' && actAiResult && (
                <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CheckCircle size={15} style={{ color: 'var(--forest-600)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--lagune-900)' }}>
                      {TYPES_ACTIVITES.find(a => a.id === actAiResult.activiteId)?.label ?? actAiResult.regime}
                    </span>
                    {!actAiResult.fiable && <AlertCircle size={13} style={{ color: 'var(--ocre-600)', flexShrink: 0 }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--lagune-700)', background: 'var(--lagune-100)', padding: '2px 8px', borderRadius: 6 }}>{actAiResult.compte}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-3)', background: 'var(--bg-sunken)', padding: '2px 8px', borderRadius: 6 }}>{actAiResult.categorie}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-3)', background: 'var(--bg-sunken)', padding: '2px 8px', borderRadius: 6 }}>{actAiResult.tarifApplicable}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.55, marginBottom: 12 }}>{actAiResult.justification}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={confirmerActivite}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: 'var(--forest-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
                    >
                      <CheckCircle size={12} /> Confirmer cette activité
                    </button>
                    <button
                      onClick={() => setActAiStep('open')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid var(--lagune-300)', color: 'var(--lagune-700)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
                    >
                      Modifier la description
                    </button>
                  </div>
                </div>
              )}

              {/* Erreur */}
              {actAiStep === 'error' && (
                <div style={{ borderTop: '1px solid var(--lagune-200)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, color: 'var(--terra-700)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{actAiError}</span>
                  </div>
                  <button onClick={() => setActAiStep('open')} style={{ marginTop: 8, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lagune-600)', fontFamily: 'var(--font-ui)', fontWeight: 600, padding: 0 }}>
                    ↩ Réessayer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sélection manuelle — toujours accessible */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => setActAiStep(s => s === 'closed' ? 'open' : 'closed')}
              style={{ fontSize: 12, color: 'var(--lagune-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ChevronDown size={12} style={{ transform: actAiStep === 'closed' ? 'none' : 'rotate(180deg)', transition: 'transform .2s' }} />
              {actAiStep === 'closed' ? 'Utiliser l\'assistant IA' : 'Choisir manuellement dans la liste'}
            </button>
          </div>

          {actAiStep === 'closed' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>Catégorie</label>
                <select value={categorie} onChange={e => { setCategorie(e.target.value); setActiviteId('') }} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }}>
                  <option value="">— Toutes les catégories —</option>
                  {CATEGORIES_ACTIVITES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>Type d&apos;activité *</label>
                <select value={activiteId} onChange={e => setActiviteId(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${activiteId ? 'var(--lagune-500)' : 'var(--border)'}`, background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }}>
                  <option value="">— Sélectionnez une activité —</option>
                  {activitesFiltrees.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Fiche activité */}
          {activiteChoisie && (
            <div style={{ background: 'var(--lagune-50)', border: '1px solid var(--lagune-200)', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--lagune-900)', marginBottom: 12 }}>{activiteChoisie.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[
                  ['Régime fiscal', activiteChoisie.regimeFiscal],
                  ['Compte SYSCOHADA', activiteChoisie.compte],
                  ['Tarif applicable', activiteChoisie.tarifApplicable],
                  ['Délai traitement', activiteChoisie.delaiTraitement],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--lagune-600)', fontWeight: 600, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--lagune-900)', fontFamily: k === 'Compte SYSCOHADA' ? 'var(--font-mono)' : 'var(--font-ui)' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--lagune-600)', fontWeight: 600, marginBottom: 6 }}>Pièces requises</div>
                {activiteChoisie.pieceRequises.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--lagune-800)', marginBottom: 3 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--lagune-500)', flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
              {activiteChoisie.note && (
                <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--ocre-50, #FFFBF0)', border: '1px solid var(--ocre-200)', borderRadius: 8, fontSize: 11, color: 'var(--ocre-900)', lineHeight: 1.5 }}>
                  {activiteChoisie.note}
                </div>
              )}
            </div>
          )}

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => activiteId && setStep(2)} disabled={!activiteId} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: activiteId ? 'var(--lagune-600)' : 'var(--bg-sunken)', color: activiteId ? '#fff' : 'var(--fg-3)', border: 'none', cursor: activiteId ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-ui)' }}>
              Continuer <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Informations ── */}
      {step === 2 && (
        <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: isMobile ? 16 : 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Informations sur votre établissement</h2>
          <p style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 20 }}>{activiteChoisie?.label}</p>

          {[
            { label: "Nom de l'établissement *", val: nom, set: setNom, placeholder: 'Ex : Salon Bijou, Épicerie du Carrefour…' },
            { label: 'Adresse complète *', val: adresse, set: setAdresse, placeholder: 'Ex : Rue des Jardins, Cocody Riviera 2' },
            { label: 'NUI / RCCM (si existant)', val: nui, set: setNui, placeholder: 'Ex : NUI-2026-XXXXX' },
            { label: 'Téléphone principal *', val: tel, set: setTel, placeholder: '+225 07 XX XX XX XX' },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>{label}</label>
              <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }} />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 5 }}>
              Quartier / commune
              {quartierAuto && (
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: 'var(--forest-700)', background: 'var(--forest-50)', border: '1px solid var(--forest-200)', borderRadius: 4, padding: '1px 6px' }}>
                  détecté via GPS
                </span>
              )}
            </label>
            <select
              value={quartier}
              onChange={e => { setQuartier(e.target.value); setQuartierAuto(false) }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${quartierAuto ? 'var(--forest-400)' : 'var(--border)'}`, background: 'var(--paper-0)', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--fg-1)' }}
            >
              {QUARTIERS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>

          {/* GPS */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 8 }}>
              Coordonnées GPS de l&apos;établissement
              <span style={{ fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>— permet à l&apos;agent de vous localiser</span>
            </label>

            {/* Mode selector */}
            {gpsMode === null && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={detectGps}
                  disabled={gpsLoading}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: gpsLoading ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', background: 'var(--lagune-600)', color: '#fff', border: 'none', opacity: gpsLoading ? .7 : 1 }}
                >
                  <MapPin size={15} />
                  {gpsLoading ? 'Localisation…' : 'Utiliser ma position actuelle'}
                </button>
                <button
                  onClick={() => setGpsMode('manual')}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', background: 'transparent', color: 'var(--fg-2)', border: '1px solid var(--border)' }}
                >
                  Saisir manuellement
                </button>
              </div>
            )}

            {/* Auto mode — success */}
            {gpsMode === 'auto' && gpsLat && (
              <div style={{ background: 'var(--forest-50, #F0FAF4)', border: '1px solid var(--forest-300)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} style={{ color: 'var(--forest-600)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--forest-900)' }}>
                      {gpsLat}, {gpsLng}
                    </span>
                  </div>
                  <button onClick={() => { setGpsMode(null); setGpsLat(''); setGpsLng('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--forest-700)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                    Modifier
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--forest-700)', marginTop: 4 }}>Position détectée automatiquement</div>
              </div>
            )}

            {/* Manual mode */}
            {gpsMode === 'manual' && (
              <div>
                {gpsError && (
                  <div style={{ fontSize: 12, color: 'var(--terra-700)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={13} style={{ flexShrink: 0 }} /> {gpsError}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--fg-3)', marginBottom: 4 }}>Latitude</label>
                    <input value={gpsLat} onChange={e => setGpsLat(e.target.value)} placeholder="Ex : 5.359952" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--fg-3)', marginBottom: 4 }}>Longitude</label>
                    <input value={gpsLng} onChange={e => setGpsLng(e.target.value)} placeholder="Ex : -3.990876" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper-0)', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)' }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>
                  Vous pouvez copier les coordonnées depuis Google Maps en faisant un clic long sur votre emplacement.
                </div>
                {!gpsError && (
                  <button onClick={detectGps} disabled={gpsLoading} style={{ marginTop: 8, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lagune-600)', fontFamily: 'var(--font-ui)', fontWeight: 600, padding: 0 }}>
                    ↻ Réessayer la localisation automatique
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              <ChevronLeft size={14} /> Retour
            </button>
            <button onClick={() => setStep(3)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              Pièces à joindre <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Documents ── */}
      {step === 3 && (
        <div style={{ background: 'var(--paper-0)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: isMobile ? 16 : 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Pièces à joindre</h2>
          <p style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 20 }}>Joignez vos documents pour accélérer le traitement de votre dossier</p>

          {/* Pièces communes */}
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', fontWeight: 600, marginBottom: 10 }}>Pièces communes (tous dossiers)</div>
          {PIECES_COMMUNES.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8, background: 'var(--paper-50)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--lagune-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={16} style={{ color: 'var(--lagune-600)' }} />
              </div>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-1)' }}>{p}</div>
              <button style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
                + Joindre
              </button>
            </div>
          ))}

          {/* Pièces spécifiques à l'activité */}
          {activiteChoisie && activiteChoisie.pieceRequises.length > 0 && (
            <>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', fontWeight: 600, margin: '20px 0 10px' }}>Spécifique — {activiteChoisie.label}</div>
              {activiteChoisie.pieceRequises.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8, background: 'var(--paper-50)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--ocre-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={16} style={{ color: 'var(--ocre-600)' }} />
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-1)' }}>{p}</div>
                  <button style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
                    + Joindre
                  </button>
                </div>
              ))}
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'var(--ocre-50, #FFFBF0)', border: '1px solid var(--ocre-200)', borderRadius: 10, marginTop: 16, marginBottom: 20 }}>
            <AlertCircle size={16} style={{ color: 'var(--ocre-600)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: 'var(--ocre-900)', lineHeight: 1.5 }}>
              Vous pouvez soumettre votre dossier sans les pièces. L&apos;agent vous demandera les originaux lors de sa visite de constat. Les documents numériques accélèrent le traitement.
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              <ChevronLeft size={14} /> Retour
            </button>
            <button onClick={submit} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)', opacity: loading ? .7 : 1 }}>
              {loading ? 'Envoi en cours…' : <><MapPin size={14} /> Soumettre ma déclaration</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Screen: Mes activités ──
function ScreenMesActivites({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  const [expanded, setExpanded] = useState<string | null>(null)
  const totalMensuel = ACTIVITES_CONTRIBUABLE.filter(a => a.statut === 'actif').reduce((s, a) => s + a.taxeMensuelle, 0)

  const typeLabel: Record<string, string> = {
    commerce: 'Commerce / négoce — 2 % du CA',
    services: 'Prestations de services / artisanat — 2,5 % du CA',
    ambulant: 'Vendeur ambulant — 100 F/jour',
    loue: 'Locaux loués en garnis — 1 %–5 % valeur locative',
    nuit_ent: 'Établissement de nuit (entreprenant) — 3 000 F/mois',
    nuit_pat: 'Établissement de nuit (patente) — 52 500 F/mois',
    taxi: 'Taxi communal — 20 000 F/trimestre',
    spectacle: 'Spectacle / gala — 10 % des recettes',
    sport: 'Manifestation sportive — 5 % des recettes',
    charrette: 'Charrette — 1 000 F/mois',
    pub_papier: 'Publicité papier — 200 F/m²/mois',
    pub_enseigne: 'Enseigne peinte — 1 000 F/m²/mois',
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: '-.4px', marginBottom: 4 }}>Mes activités</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-3)' }}>{ACTIVITES_CONTRIBUABLE.length} activité(s) enregistrée(s) · NUI-2026-12401</p>
        </div>
        <button onClick={() => go('nouvelle_activite')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', flexShrink: 0 }}>
          + Nouvelle activité
        </button>
      </div>

      {/* Résumé fiscal */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total mensuel dû', value: formatAmount(totalMensuel), unit: 'FCFA', color: 'var(--lagune-600)' },
          { label: 'Activités actives', value: String(ACTIVITES_CONTRIBUABLE.filter(a => a.statut === 'actif').length), unit: 'sur ' + ACTIVITES_CONTRIBUABLE.length, color: 'var(--forest-600)' },
          { label: 'Statut global', value: 'À jour', unit: 'Avril 2026', color: 'var(--forest-600)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--paper-0)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: '14px 18px' }}>
            <div style={{ fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}<span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginLeft: 5, fontWeight: 500 }}>{c.unit}</span></div>
          </div>
        ))}
      </div>

      {/* Liste des activités */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACTIVITES_CONTRIBUABLE.map(act => (
          <div key={act.id} style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            {/* En-tête cliquable */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === act.id ? null : act.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)' }}>{act.nom}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 999, flexShrink: 0,
                    background: act.statut === 'actif' ? 'var(--forest-100)' : 'var(--ocre-100)',
                    color: act.statut === 'actif' ? 'var(--forest-900)' : 'var(--ocre-900)',
                  }}>{act.statut === 'actif' ? 'Actif' : 'En attente'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{act.regime} · Compte <span style={{ fontFamily: 'var(--font-mono)' }}>{act.compte}</span></div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--lagune-700)' }}>{formatAmount(act.taxeMensuelle)}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>FCFA / mois</div>
              </div>
              <ChevronDown size={16} style={{ color: 'var(--fg-3)', transform: expanded === act.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
            </div>

            {/* Détails dépliés */}
            {expanded === act.id && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--bg-sunken)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
                  {[
                    ['Identifiant', act.id],
                    ['NUI / RCCM', act.nui],
                    ['Régime fiscal', act.regime],
                    ['Compte budgétaire', act.compte],
                    ['Assiette', typeLabel[act.type] ?? act.type],
                    ...(act.ca ? [['CA annuel déclaré', `${formatAmount(act.ca)} FCFA`]] : []),
                    ['Taxe mensuelle', `${formatAmount(act.taxeMensuelle)} FCFA`],
                    ['Adresse', act.adresse],
                    ['Quartier', act.quartier],
                    ['Enregistrement', act.dateEnreg],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 2 }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', fontFamily: ['NUI / RCCM', 'Compte budgétaire', 'Identifiant'].includes(k) ? 'var(--font-mono)' : 'var(--font-ui)' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button
                    onClick={() => go('declaration')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'var(--secondary)', color: 'var(--secondary-on)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}
                  >
                    Payer la taxe du mois
                  </button>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
                    <Download size={12} /> Attestation
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Screen: Barème fiscal ──
function ScreenBareme({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  // Tous les chapitres ouverts par défaut — contenu complet visible au chargement
  const allKeys = BAREME_COMPLET.flatMap(s => s.chapitres.map(ch => `${s.id}-${ch.chapitre}`))
  const [openChapitres, setOpenChapitres] = useState<Set<string>>(() => new Set(allKeys))
  const toggleChapitre = (key: string) =>
    setOpenChapitres(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'var(--lagune-100)', color: 'var(--lagune-700)', fontSize: 12, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          Document officiel
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 30, fontWeight: 700, letterSpacing: '-.5px', marginBottom: 8 }}>
          Barème fiscal municipal 2026
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.6, maxWidth: 620 }}>
          Délibération N°2025-172/CC/CM/SG du Conseil Municipal de Cocody · Exercice budgétaire 2026 · Conforme au SYSCOHADA révisé et au Code Général des Impôts de Côte d&apos;Ivoire.
        </p>
      </div>

      {/* Mairie header block */}
      <div style={{
        background: 'linear-gradient(135deg, var(--lagune-900) 0%, var(--lagune-700) 100%)',
        borderRadius: 16, padding: isMobile ? '20px 16px' : '28px 32px', marginBottom: 32,
        display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24, position: 'relative', overflow: 'hidden',
        flexWrap: 'wrap',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/pattern-kita.svg')", backgroundSize: 200, opacity: .05, filter: 'brightness(0) invert(1)', pointerEvents: 'none' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-cocody.png" alt="Cocody" style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,.9)', padding: 4, flexShrink: 0 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>MAIRIE DE COCODY</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', marginBottom: 6 }}>République de Côte d&apos;Ivoire · District d&apos;Abidjan</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              'Délibération N°2025-172/CC/CM/SG',
              'Exercice 2026',
              'Conforme SYSCOHADA révisé',
              'CGI — Art. 103 à 180',
            ].map(t => (
              <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Legal intro */}
      <div style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', padding: '20px 24px', marginBottom: 24, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
        <p style={{ marginBottom: 10 }}>
          <b>Article 1.</b> Le présent barème fixe les taux et montants des taxes communales perçues par la Mairie de Cocody pour l&apos;exercice budgétaire 2026, en application des articles 103 à 180 du Code Général des Impôts de Côte d&apos;Ivoire et des directives UEMOA relatives aux finances locales.
        </p>
        <p style={{ marginBottom: 10 }}>
          <b>Article 2.</b> Toute personne physique ou morale exerçant une activité économique sur le territoire de la Commune de Cocody est assujettie aux taxes définies ci-après, selon la nature de son activité et son régime fiscal.
        </p>
        <p>
          <b>Article 3.</b> Les recettes fiscales sont imputées sur les comptes de classe 7 du plan SYSCOHADA révisé. Les contribuables reçoivent un reçu numérique horodaté, vérifiable sur le portail CoTax (cocody.ci/v/[numéro]).
        </p>
      </div>

      {/* Tax categories */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 16 }}>
          Barème complet — {BAREME_COMPLET.reduce((n, s) => n + s.chapitres.reduce((m, ch) => m + ch.sections.length, 0), 0)} rubriques
        </div>

        {BAREME_COMPLET.map(section => (
          <div key={section.id} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--lagune-600)', fontWeight: 700, marginBottom: 10, paddingLeft: 4,
            }}>
              {section.label}
            </div>

            {section.chapitres.map(chapitre => (
              <div key={chapitre.chapitre} style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', marginBottom: 10, overflow: 'hidden' }}>
                <button
                  onClick={() => toggleChapitre(`${section.id}-${chapitre.chapitre}`)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-ui)' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--lagune-100)', color: 'var(--lagune-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
                    {chapitre.chapitre}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)', marginBottom: 2 }}>{chapitre.titre}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                      {chapitre.sections.length} rubrique{chapitre.sections.length > 1 ? 's' : ''} · {chapitre.sections.reduce((n, s) => n + s.lignes.length, 0)} lignes tarifaires
                    </div>
                  </div>
                  <ChevronDown size={16} style={{ color: 'var(--fg-3)', transform: openChapitres.has(`${section.id}-${chapitre.chapitre}`) ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
                </button>

                {openChapitres.has(`${section.id}-${chapitre.chapitre}`) && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
                    {chapitre.sections.map((sec, si) => (
                      <div key={`${sec.compte}-${si}`} style={{ marginBottom: si < chapitre.sections.length - 1 ? 24 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: sec.description ? 6 : 10 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--lagune-700)', background: 'var(--lagune-50)', padding: '2px 8px', borderRadius: 6 }}>{sec.compte}</span>
                          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>{sec.label}</span>
                        </div>
                        {sec.description && (
                          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, lineHeight: 1.6 }}>{sec.description}</p>
                        )}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              {['Désignation', 'Unité', 'Montant'].map((h, i) => (
                                <th key={i} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '7px 10px', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, background: 'var(--bg-sunken)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.lignes.map((l, li) => (
                              <tr key={li} style={{ background: li % 2 === 0 ? 'transparent' : 'var(--paper-50)' }}>
                                <td style={{ padding: '8px 10px', fontSize: 12, color: 'var(--fg-1)', borderBottom: '1px solid var(--border-subtle)' }}>{l.label}</td>
                                <td style={{ padding: '8px 10px', fontSize: 11, color: 'var(--fg-3)', borderBottom: '1px solid var(--border-subtle)', maxWidth: 260 }}>{l.unite}</td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--lagune-700)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                                  {typeof l.montant === 'number' ? `${formatAmount(l.montant)} F` : l.montant}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Activity types table */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 16 }}>Répertoire des activités économiques</div>
        <p style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 16, lineHeight: 1.6 }}>
          {TYPES_ACTIVITES.length} types d&apos;activités répertoriés · classés par secteur · applicable exercice 2026
        </p>
        <div style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Activité', 'Catégorie', 'Régime fiscal', 'Compte', 'Délai constat'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '9px 14px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, background: 'var(--paper-50)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPES_ACTIVITES.map((a, i) => (
                <tr key={a.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--paper-50)' }}>
                  <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>{a.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{a.id}</div>
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--fg-2)', borderBottom: '1px solid var(--border-subtle)' }}>{a.categorie}</td>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--fg-2)', borderBottom: '1px solid var(--border-subtle)' }}>{a.regimeFiscal}</td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--lagune-700)', borderBottom: '1px solid var(--border-subtle)' }}>{a.compte}</td>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--fg-2)', borderBottom: '1px solid var(--border-subtle)' }}>{a.delaiTraitement}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* SYSCOHADA accounts summary */}
      <div style={{ background: 'var(--paper-0)', borderRadius: 14, border: '1px solid var(--border-subtle)', padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Comptes budgétaires SYSCOHADA</div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 400, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Compte', 'Libellé', 'Taxes associées'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 600, background: 'var(--bg-sunken)', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BAREME_COMPLET.flatMap(s => s.chapitres.flatMap(ch => ch.sections)).map((sec, i) => (
              <tr key={`${sec.compte}-${i}`} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--paper-50)' }}>
                <td style={{ padding: '9px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--lagune-700)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>{sec.compte}</td>
                <td style={{ padding: '9px 12px', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', borderBottom: '1px solid var(--border-subtle)' }}>{sec.label}</td>
                <td style={{ padding: '9px 12px', fontSize: 11, color: 'var(--fg-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {sec.description ?? `${sec.lignes.length} ligne${sec.lignes.length > 1 ? 's' : ''} tarifaire${sec.lignes.length > 1 ? 's' : ''}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Footer legal */}
      <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.7, padding: '20px 24px', background: 'var(--bg-sunken)', borderRadius: 10, marginBottom: 24 }}>
        <b style={{ color: 'var(--fg-2)' }}>Dispositions finales.</b> Tout contribuable peut contester le montant de sa taxation devant le service des impôts communaux de la Mairie de Cocody, situé au Boulevard de France (II Plateaux), dans un délai de 30 jours suivant la réception du titre de perception. Les pénalités de retard sont fixées à 10 % du montant dû par tranche de 30 jours d&apos;impayés, conformément à l&apos;article 62 du SYSCOHADA révisé.
        <br /><br />
        <b style={{ color: 'var(--fg-2)' }}>Textes de référence :</b> Code Général des Impôts CI (art. 103–180) · SYSCOHADA révisé (OHADA 2017) · Délibération N°2025-172/CC/CM/SG · Directives UEMOA/BCEAO finances locales.
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-2)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
          <Download size={14} /> Télécharger PDF
        </button>
        <button onClick={() => go('nouvelle_activite')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--lagune-600)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
          <PlusCircle size={14} /> Déclarer mon activité
        </button>
      </div>
    </div>
  )
}

// ── Root ──
export default function PortailPage() {
  const [screen, setScreen] = useState<Screen>('home')
  const { isTablet } = useBreakpoint()

  return (
    <>
      <Topnav screen={screen} go={setScreen} />
      {/* Padding bottom en JS : 72px quand le bottom nav est visible */}
      <div style={{ paddingBottom: isTablet ? 72 : 0, overflowX: 'hidden', width: '100%' }}>
        {screen === 'home'              && <ScreenHome             go={setScreen} />}
        {screen === 'mes_activites'     && <ScreenMesActivites     go={setScreen} />}
        {screen === 'declaration'       && <ScreenDeclaration      go={setScreen} />}
        {screen === 'historique'        && <ScreenHistorique       go={setScreen} />}
        {screen === 'profil'            && <ScreenProfil           go={setScreen} />}
        {screen === 'nouvelle_activite' && <ScreenNouvelleActivite go={setScreen} />}
        {screen === 'bareme'            && <ScreenBareme           go={setScreen} />}
      </div>
      {/* BottomNav se rend null lui-même sur desktop — zéro risque d'interception */}
      <BottomNav screen={screen} go={setScreen} />
    </>
  )
}
