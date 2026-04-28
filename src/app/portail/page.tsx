'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
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
    { id: 'home' as Screen, label: 'Accueil' },
    { id: 'mes_activites' as Screen, label: 'Mes activités' },
    { id: 'nouvelle_activite' as Screen, label: 'Déclarer' },
    { id: 'declaration' as Screen, label: 'Payer mes taxes' },
    { id: 'historique' as Screen, label: 'Mes reçus' },
    { id: 'bareme' as Screen, label: 'Barème' },
  ]

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center gap-3 min-h-[58px] bg-lagune-900 px-4 md:px-6 ">
      {/* Logo */}
      <button
        onClick={() => go('home')}
        className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 shrink-0 hover:opacity-90 transition-opacity"
      >
        <div className="w-[30px] h-[30px] rounded-md bg-white/90 p-0.5 flex items-center justify-center">
          <img src="/assets/logo-cocody.png" alt="Cocody" className="w-full h-full object-contain" />
        </div>
        {!isTablet && (
          <div className="text-left">
            <div className="font-display text-[17px] font-semibold text-white leading-tight">CoTax</div>
            <div className="text-[10px] text-white/45 tracking-widest uppercase font-medium">Portail · Cocody</div>
          </div>
        )}
      </button>

      {/* Titre screen courant — mobile seulement */}
      {isTablet && (
        <span className="font-display font-semibold text-base text-white flex-1 min-w-0 py-3.5">
          {NAV_ITEMS.find((n) => n.id === screen)?.label ?? 'CoTax Portail'}
        </span>
      )}

      {/* Liens nav — desktop seulement */}
      {!isTablet && (
        <div className="flex gap-0.5 ml-5 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`px-3 py-1.5 rounded-2xl text-[13px] font-medium cursor-pointer border-none transition-all font-ui whitespace-nowrap ${
                screen === item.id ? 'text-white bg-white/15' : 'text-white/65 bg-transparent hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Actions droite */}
      <div className="ml-auto flex items-center gap-2 shrink-0 py-3 md:py-0">
        {!isTablet && (
          <Button
            onClick={() => go('declaration')}
            variant="primary"
            className="!px-3.5 !py-1.5 !text-[13px] bg-lagune-500 hover:bg-lagune-600"
          >
            <FileText size={14} /> Payer
          </Button>
        )}
        <button
          onClick={() => go('profil')}
          className="w-[34px] h-[34px] rounded-full bg-forest-600 text-white flex items-center justify-center border-none cursor-pointer font-bold text-xs shrink-0 hover:bg-forest-700 transition-colors "
        >
          AK
        </button>
      </div>
    </nav>
  )
}

// ── BottomNav — barre fixe en bas, rendue uniquement sur tablette/mobile ──
function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const { isTablet } = useBreakpoint()

  if (!isTablet) return null

  const items: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'home',          label: 'Accueil',    icon: <Home size={22} strokeWidth={1.5} /> },
    { id: 'mes_activites', label: 'Activités',  icon: <Store size={22} strokeWidth={1.5} /> },
    { id: 'declaration',   label: 'Payer',      icon: <CreditCard size={22} strokeWidth={1.5} /> },
    { id: 'historique',    label: 'Reçus',      icon: <Receipt size={22} strokeWidth={1.5} /> },
    { id: 'profil',        label: 'Profil',     icon: <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${screen === 'profil' ? 'bg-lagune-600' : 'bg-ink-500'} text-white`}>AK</div> },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-paper-0 border-t border-ink-200 flex justify-around items-center py-1.5 pb-[max(6px,env(safe-area-inset-bottom))] ">
      {items.map(({ id, label, icon }) => {
        const active = screen === id
        return (
          <button key={id} onClick={() => go(id)} className={`flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-3 py-1 rounded-2xl min-w-[54px] transition-colors font-ui text-[10px] ${active ? 'text-lagune-600 font-semibold' : 'text-ink-500 font-medium'}`}>
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
      <div className="bg-gradient-to-br from-lagune-900 to-lagune-700 px-5 py-10 md:py-16 md:px-10 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("/assets/pattern-kita.svg")', backgroundSize: '220px' }} />
        <div className="max-w-[780px] mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-white mb-4 leading-tight">
            Declarez, payez et suivi vos taxes municipales en ligne
          </h1>
          <p className="text-base md:text-lg text-white/60 mb-8 max-w-[600px]">
            Orange Money, MTN, Wave ou virement bancaire. Reçu PDF immédiat. Conforme au barème fiscal 2026 de la Commune de Cocody.
          </p>
          <div className="flex flex-wrap gap-4 mt-16">
            <button
              onClick={() => go('nouvelle_activite')}
              className="px-8 py-4 text-base font-semibold bg-white text-lagune-900 hover:bg-gray-100 border-none inline-flex items-center gap-2 rounded-2xl"
            >
              <PlusCircle size={18} /> Declarer une activite
            </button>
            <button
              onClick={() => go('declaration')}
              className="px-8 py-4 text-base font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 inline-flex items-center gap-2 rounded-2xl"
            >
              <CreditCard size={18} /> Payer mes taxes
            </button>
            <button
              onClick={() => go('historique')}
              className="px-8 py-4 text-base font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 inline-flex items-center gap-2 rounded-2xl"
            >
              <History size={18} /> Mes recrus
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-[900px] mx-auto px-4 py-10 md:py-16 md:px-6">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-lagune-600 mb-2">Comment ca marche</div>
          <h2 className="text-2xl font-display font-semibold text-ink-900">Simple, rapide, securise</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { ico: <FileText size={28} />, title: 'Declarez votre activite', txt: "Renseignez votre type d'activite et chiffre d'affaires. Le calcul de votre taxe est automatique selon le bareme officiel 2026.", color: '#0e55a6' },
            { ico: <CreditCard size={28} />, title: 'Payez en mobile money', txt: 'Orange Money, MTN Money, Wave ou Moov. Paiement securise PSP conforme aux normes UEMOA/BCEAO.', color: '#008030' },
            { ico: <Receipt size={28} />, title: 'Telechargez votre recu', txt: 'Recu PDF genere instantly, envoye par SMS et disponible en ligne. Verifiable par QR code.', color: '#c98823' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-ink-100  flex flex-col items-center text-center border-t-4" style={{ borderTopColor: f.color }}>
              <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${f.color}1a`, color: f.color }}>{f.ico}</div>
              <h3 className="text-lg font-display font-semibold text-ink-900 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{f.txt}</p>
            </div>
          ))}
        </div>

        {/* CTA quick-access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {[
            { ico: <PlusCircle size={22} />, title: 'Déclarer une activité', sub: "Enregistrez votre commerce, salon, restaurant… sans vous déplacer.", bg: 'bg-lagune-50', color: 'text-lagune-700', screen: 'nouvelle_activite' as Screen },
            { ico: <Calculator size={22} />, title: 'Payer mes taxes', sub: 'Taxe entreprenant, locaux loués, vendeur ambulant…', bg: 'bg-forest-50', color: 'text-forest-700', screen: 'declaration' as Screen },
            { ico: <History size={22} />, title: 'Mes paiements', sub: 'Historique, reçus PDF, attestations fiscales.', bg: 'bg-ocre-50', color: 'text-ocre-700', screen: 'historique' as Screen },
            { ico: <BookOpen size={22} />, title: 'Barème fiscal 2026', sub: 'Délibération N°2025-172 — tous les tarifs et comptes SYSCOHADA.', bg: 'bg-ink-50', color: 'text-ink-700', screen: 'bareme' as Screen },
          ].map(c => (
            <button key={c.title} onClick={() => go(c.screen)} className="bg-white rounded-2xl border border-ink-100  p-4 flex gap-4 items-center text-left hover:border-lagune-200 transition-colors group">
              <div className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center shrink-0 ${c.bg} ${c.color}`}>{c.ico}</div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-ink-900 group-hover:text-lagune-700 transition-colors">{c.title}</div>
                <div className="text-[12px] text-ink-500 mt-0.5">{c.sub}</div>
              </div>
              <ArrowRight size={16} className="text-ink-400 shrink-0" />
            </button>
          ))}
        </div>

        {/* Tax categories barème */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-lagune-600 mb-2 font-bold">Barème fiscal 2026</div>
            <h2 className="text-2xl font-display font-semibold text-ink-900 text-[22px]">Délibération N°2025-172/CC/CM/SG</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BAREME_COMPLET[0].chapitres.flatMap(ch => ch.sections).map(section => (
              <div key={section.compte} className="bg-white rounded-2xl border border-ink-100  p-4 flex gap-4 items-start bg-paper-0">
                <div className="w-10 h-10 rounded-2xl bg-lagune-100 text-lagune-700 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                  {section.compte}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px] text-ink-900 leading-tight mb-1">{section.label}</div>
                  <div className="text-[11px] text-ink-500 font-mono">Compte {section.compte}</div>
                  <div className="text-[12px] text-ink-600 mt-1.5 font-medium">
                    {typeof section.lignes[0]?.montant === 'number'
                      ? <><span className="t-amount">{formatAmount(section.lignes[0].montant)} FCFA</span> · {section.lignes[0].unite.split(' par ')[1] ?? section.lignes[0].unite}</>
                      : <span className="font-semibold">{section.lignes[0]?.montant}</span>
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
      <div className="max-w-[560px] mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="w-[72px] h-[72px] rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-5 shadow-[0_0_0_8px_var(--forest-50)]">
            <CheckCircle size={34} className="text-forest-700" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-ink-900 mb-2">Paiement confirmé</h2>
          <p className="text-xs text-ink-500 mb-8">
            PI-SPI · <span className="t-amount font-bold text-ink-900">{formatAmount(taxe)} FCFA</span> · {typeLabel[taxType]}
          </p>

          {/* Receipt paper */}
          <div className="bg-white rounded-2xl p-6 border border-ink-200 font-mono text-[12px] max-w-[340px] mx-auto mb-8 text-left  relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-lagune-600" />
            <div className="text-center pb-3 border-b border-dashed border-ink-200 mb-3 pt-2">
              <img src="/assets/logo-cocody.png" className="w-[38px] h-[38px] mx-auto mb-1" alt="Cocody" />
              <div className="font-ui text-[12px] font-bold text-lagune-900 uppercase">Mairie de Cocody</div>
              <div className="text-[10px] text-ink-400 tracking-widest uppercase">Portail fiscal · CoTax</div>
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
              <div key={k} className="flex justify-between py-0.5 text-[11px]">
                <span className="text-ink-500">{k}</span>
                <span className="font-semibold text-ink-900">{v}</span>
              </div>
            ))}
            <div className="t-h1 text-center py-3 border-y border-dashed border-ink-200 my-2.5 !font-mono font-bold">
              {formatAmount(taxe)} FCFA
            </div>
            <div className="text-[10px] text-center text-ink-400 leading-normal">
              Vérifier : cocody.ci/v/18501<br />Conservation obligatoire 5 ans
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            <Button variant="ghost">
              <Download size={14} /> Télécharger PDF
            </Button>
            <Button onClick={() => go('historique')} variant="primary">
              <History size={14} /> Voir mes paiements
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-display font-semibold mb-1">Payer mes taxes</h1>
        <p className="text-xs text-ink-500">Sélectionnez une activité enregistrée · Délibération N°2025-172</p>
      </div>

      {/* ── Step 0 — Sélection de l'activité ── */}
      {step === 0 && (
        <div>
          <div className="mb-4">
            <div className="text-xs text-ink-500 font-semibold text-ink-700 mb-3">Choisissez l&apos;activité à régulariser</div>
            <div className="flex flex-col gap-2.5">
              {ACTIVITES_CONTRIBUABLE.map(act => (
                <button
                  key={act.id}
                  onClick={() => selectActivite(act)}
                  className="bg-white rounded-2xl border border-ink-100  flex items-center justify-between p-4 cursor-pointer text-left hover:border-lagune-300 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[14px] text-ink-900 group-hover:text-lagune-700 transition-colors">{act.nom}</span>
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-pill ${act.statut === 'actif' ? 'bg-forest-100 text-forest-900' : 'bg-ocre-100 text-ocre-900'}`}>
                        {act.statut === 'actif' ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                    <div className="text-[12px] text-ink-500 font-medium">{act.regime} · Compte {act.compte}</div>
                    <div className="text-[11px] text-ink-400 mt-0.5">{act.adresse}</div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="t-amount text-lg font-bold text-lagune-700">{formatAmount(act.taxeMensuelle)}</div>
                    <div className="text-[10px] text-ink-400 font-medium uppercase tracking-wider">FCFA / mois</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink-200" />
            <span className="text-sm font-medium text-ink-400">ou</span>
            <div className="flex-1 h-px bg-ink-200" />
          </div>

          <button
            onClick={() => { setActiviteSelectId(null); setStep(1) }}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-ink-300 bg-transparent text-[13px] font-bold text-ink-600 hover:border-lagune-400 hover:text-lagune-600 transition-all cursor-pointer font-ui"
          >
            + Déclarer une activité non enregistrée
          </button>
        </div>
      )}

      {/* Step indicator (visible seulement pour steps 1–3) */}
      {typeof step === 'number' && step >= 1 && (
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((label, i) => {
          const n = i + 1
          const stepNum = typeof step === 'number' ? step : 4
          const isDone = stepNum > n
          const isActive = stepNum === n
          return (
            <React.Fragment key={label}>
              <div
                className={`flex items-center gap-2.5 shrink-0 ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isDone && setStep(n as DeclaStep)}
              >
                <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                  isDone ? 'bg-forest-600 text-white' : 
                  isActive ? 'bg-lagune-600 text-white ring-4 ring-lagune-100' : 
                  'bg-ink-100 text-ink-400'
                }`}>
                  {isDone ? '✓' : n}
                </div>
                <span className={`text-[12px] font-bold ${
                  isActive ? 'text-lagune-700' : 
                  isDone ? 'text-ink-700' : 
                  'text-ink-400'
                }`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${
                  isDone ? 'bg-forest-500' : 'bg-ink-200'
                }`} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      )}

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-ink-100  p-5 md:p-6">
          <h2 className="text-sm font-semibold mb-4">Votre activité</h2>

          {/* ── Assistant fiscal IA ── */}
          <div className="mb-6 rounded-2xl border border-lagune-200 bg-lagune-50 overflow-hidden ">
            <button
              onClick={() => setAiStep(s => s === 'idle' ? 'open' : (s === 'open' ? 'idle' : s))}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-lagune-100/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-2xl bg-lagune-600 flex items-center justify-center shrink-0 ">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[13px] text-lagune-950">Assistant fiscal IA</div>
                <div className="text-[11px] text-lagune-700 font-medium">Détermination automatique du régime</div>
              </div>
              <ChevronDown size={14} className={`text-lagune-600 transition-transform duration-300 ${aiStep !== 'idle' ? 'rotate-180' : ''}`} />
            </button>

            {aiStep === 'open' && (
              <div className="p-4 pt-0 border-t border-lagune-200">
                <div className="mt-4 mb-3">
                  <label className="text-sm font-medium text-lagune-700 mb-1.5 block">Décrivez votre activité *</label>
                  <textarea
                    value={aiDesc}
                    onChange={e => setAiDesc(e.target.value)}
                    placeholder="Ex : Je tiens une boutique d'épicerie au marché Cocovico..."
                    rows={3}
                    className="app-input !bg-white !border-lagune-200 focus:!border-lagune-500 !text-[13px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {[
                    { label: 'Local commercial', val: aiLocal, set: setAiLocal, opts: ['Boutique / atelier fixe', 'Étal en marché', 'Ambulant (pas de local)', 'Domicile / télétravail'] },
                    { label: 'Assujetti à la patente ?', val: aiPatente, set: setAiPatente, opts: ['Oui (SARL / EI formel)', 'Non (petit commerce)', 'Je ne sais pas'] },
                  ].map(({ label, val, set, opts }) => (
                    <div key={label}>
                      <label className="text-sm font-medium text-lagune-700 mb-1.5 block">{label}</label>
                      <select
                        value={val}
                        onChange={e => set(e.target.value)}
                        className="app-input !bg-white !border-lagune-200 !text-[12px] !py-2"
                      >
                        <option value="">— Choisir —</option>
                        {opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-lagune-700 mb-1.5 block">CA annuel estimé (FCFA)</label>
                  <input
                    value={aiCa}
                    onChange={e => setAiCa(e.target.value)}
                    placeholder="Ex : 1 800 000"
                    className="app-input !bg-white !border-lagune-200 !font-mono !text-[13px]"
                  />
                </div>
                <Button
                  onClick={analyserAssiette}
                  disabled={!aiDesc.trim()}
                  className="w-full !py-2.5 !text-[13px]"
                >
                  <Sparkles size={14} /> Analyser mon profil fiscal
                </Button>
              </div>
            )}

            {aiStep === 'loading' && (
              <div className="p-4 border-t border-lagune-200 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-lagune-300 border-t-lagune-600 animate-spin" />
                <span className="text-[13px] text-lagune-700 font-medium font-ui">Analyse intelligente en cours…</span>
              </div>
            )}

            {aiStep === 'result' && aiResult && (
              <div className="p-4 border-t border-lagune-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={15} className="text-forest-600" />
                  <span className="font-bold text-[13px] text-lagune-950">{aiResult.regime}</span>
                </div>
                <div className="font-mono text-[11px] text-lagune-700 mb-3 bg-lagune-100/50 p-2 rounded-2xl inline-block">
                  Compte {aiResult.compte} · {aiResult.assiette}
                  {aiResult.montantEstime > 0 && ` · ~${formatAmount(aiResult.montantEstime)} F ${aiResult.periodeCalcul}`}
                </div>
                <p className="text-[12px] text-ink-700 leading-relaxed mb-4">{aiResult.justification}</p>
                <div className="flex gap-2">
                  <Button onClick={confirmerAssistant} className="!py-2 !text-[12px] !px-4 bg-forest-600 hover:bg-forest-700">
                    Appliquer ce régime
                  </Button>
                  <Button onClick={() => setAiStep('open')} variant="ghost" className="!py-2 !text-[12px] !px-4 !border-lagune-200 !text-lagune-700 hover:!bg-lagune-100">
                    Modifier
                  </Button>
                </div>
              </div>
            )}

            {aiStep === 'error' && (
              <div className="p-4 border-t border-lagune-200">
                <div className="text-[12px] text-terra-700 flex items-start gap-2 bg-terra-50 p-3 rounded-2xl border border-terra-100">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
                <button onClick={() => setAiStep('open')} className="mt-2.5 text-[12px] font-bold text-lagune-600 hover:underline">
                  ↩ Réessayer
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-ink-100" />
            <span className="text-sm font-medium text-ink-400">ou remplissez directement</span>
            <div className="flex-1 h-px bg-ink-100" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-600 mb-1.5 block">Type de contribuable *</label>
              <select value={taxType} onChange={e => setTaxType(e.target.value)} className="app-input text-[14px]">
                <optgroup label="Compte 70262 — Taxe entreprenant">
                  <option value="commerce">Commerce / négoce — 2 % du CA annuel</option>
                  <option value="services">Prestations de services / artisanat — 2,5 % du CA annuel</option>
                  <option value="ambulant">Vendeur ambulant / étalage marché — 100 F/jour</option>
                </optgroup>
                <optgroup label="Compte 7027 — Locaux loués">
                  <option value="loue">Hôtel, résidence, chambre meublée — 1 %–5 %</option>
                </optgroup>
                <optgroup label="Compte 7038 — Établissements de nuit">
                  <option value="nuit_ent">Bar / buvette (entreprenant) — 3 000 F/mois</option>
                  <option value="nuit_pat">Bar / club (boissons) — 52 500 F/mois</option>
                </optgroup>
                <optgroup label="Autres taxes">
                  <option value="taxi">Taxi communal (wôrô-wôrô) — 20 000 F/trimestre</option>
                  <option value="spectacle">Spectacles, galas, concerts — 10 %</option>
                  <option value="sport">Manifestation sportive — 5 %</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-ink-600 mb-1.5 block">NUI / RCCM *</label>
              <input defaultValue="NUI-2026-12401" placeholder="Ex : NUI-2026-XXXXX" className="app-input font-mono" />
            </div>

            {!isForfait && taxType !== 'spectacle' && taxType !== 'sport' && taxType !== 'taxi' && taxType !== 'loue' && (
              <div>
                <label className="text-sm font-medium text-ink-600 mb-1.5 block">Chiffre d&apos;affaires annuel (FCFA) *</label>
                <input value={ca} onChange={e => setCa(e.target.value)} placeholder="Ex : 1 800 000" className="app-input font-mono" />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-ink-600 mb-1.5 block">Commune de rattachement</label>
              <select className="app-input">
                <option>Commune de Cocody</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-100 flex justify-end">
            <Button onClick={() => setStep(2)}>
              Calculer la taxe <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-ink-100  p-5 md:p-6">
          {activiteSelectId && (() => {
            const act = ACTIVITES_CONTRIBUABLE.find(a => a.id === activiteSelectId)
            if (!act) return null
            return (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-lagune-50 border border-lagune-100 mb-5">
                <CheckCircle size={14} className="text-lagune-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[13px] text-lagune-900 leading-tight block">{act.nom}</span>
                  <span className="text-[12px] text-lagune-600">{act.regime}</span>
                </div>
                <button onClick={() => { setActiviteSelectId(null); setStep(0) }} className="text-[11px] font-bold text-lagune-600 hover:underline">Changer</button>
              </div>
            )
          })()}
          
          <h2 className="text-sm font-semibold mb-6">Calcul automatique</h2>
          
<div className="bg-lagune-900 rounded-2xl p-8 mb-6 text-center  relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/assets/pattern-kita.svg')] bg-[size:200px] opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">Taxe mensuelle calculee</div>
              <div className="text-4xl md:text-5xl font-display font-semibold text-white mb-2">
                {formatAmount(taxe)}
                <span className="text-base text-white/50 ml-3 uppercase font-medium">FCFA</span>
              </div>
              {!isForfait && taxType !== 'spectacle' && taxType !== 'sport' && taxType !== 'taxi' && taxType !== 'loue' ? (
                <div className="text-sm text-white/70">CA {formatAmount(caNum)} F × {taux}% ÷ 12 mois</div>
              ) : (
                <div className="text-sm text-white/70">{typeLabel[taxType]}</div>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {[
              ['Type', typeLabel[taxType]], 
              ['Compte budgétaire', compteMap[taxType] ?? '70262'], 
              ['Période', 'Avril 2026']
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1">
                <span className="text-xs text-ink-500 text-ink-500 font-medium">{k}</span>
                <span className={`text-[13px] font-bold text-ink-900 ${k === 'Compte budgétaire' ? 'font-mono' : ''}`}>{v}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-ink-100 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ChevronLeft size={14} /> Modifier
            </Button>
            <Button variant="primary" onClick={goStep3}>
              Payer maintenant <ArrowRight size={14} />
            </Button>
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
        ]
        const canConfirm = pispiTab === 'qr' || pispiAlias.trim().length > 0
        return (
          <div className="bg-white rounded-2xl border border-ink-100  overflow-hidden !">
            <div className="bg-lagune-900 p-6 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/assets/pattern-kita.svg')] bg-[size:180px] opacity-5 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <img src="/assets/pispi-logo.png" alt="PI-SPI" className="w-11 h-11 rounded-2xl  border border-white/10 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white/50 mb-0.5">Paiement sécurisé</div>
                  <div className="text-sm font-semibold !text-white !font-display leading-tight">PI-SPI · BCEAO</div>
                </div>
              </div>
              <div className="text-right relative z-10">
                <div className="text-sm font-medium text-white/50 mb-0.5">Total dû</div>
                <div className="t-h1 !text-white !font-mono tracking-tight">
                  {formatAmount(taxe)} <span className="text-xs font-medium text-white/60 ml-0.5">F</span>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="flex bg-ink-50 rounded-2xl p-1 mb-6">
                {(['qr', 'alias'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setPispiTab(t)} 
                    className={`flex-1 py-2.5 rounded-2xl text-[13px] font-bold transition-all cursor-pointer border-none font-ui ${
                      pispiTab === t ? 'bg-white text-ink-900 ' : 'text-ink-500 hover:text-ink-700'
                    }`}
                  >
                    {t === 'qr' ? 'QR Code' : 'Numéro / Alias'}
                  </button>
                ))}
              </div>

              {pispiTab === 'qr' && (
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border border-ink-100 rounded-2xl mb-5 ">
                    <div className="relative">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PISPI%3ACOTAX%3A${taxe}&qzone=1&color=082B57`}
                        alt="QR code PI-SPI" className="w-[180px] h-[180px] block rounded-2xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-1 rounded-2xl  border border-ink-50">
                          <img src="/assets/pispi-logo.png" alt="PI-SPI" className="w-8 h-8 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-[12px] font-medium text-ink-500">Réf <span className="font-mono text-ink-900 font-bold">RC-2026-18</span></span>
                    <div className="w-px h-3 bg-ink-200" />
                    <span className={`flex items-center gap-1.5 text-[12px] font-bold font-mono ${pispiTimer < 60 ? 'text-terra-600 animate-pulse' : 'text-ink-900'}`}>
                      <Clock size={12} className="shrink-0" />{formatTimer(pispiTimer)}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5 flex-wrap">
                    {WALLETS.map(w => (
                      <img key={w.name} src={w.logo} alt={w.name} className="w-8 h-8 rounded-2xl border border-ink-100 object-cover bg-white" />
                    ))}
                    <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider ml-1">+ BANQUES</span>
                  </div>
                </div>
              )}

              {pispiTab === 'alias' && (
                <div>
                  <label className="text-sm font-medium text-ink-600 mb-2 block">Numéro ou alias de paiement</label>
                  <input
                    value={pispiAlias}
                    onChange={e => setPispiAlias(e.target.value)}
                    placeholder="+225 07 XX XX XX XX"
                    className="app-input !text-lg !py-3.5 !font-mono text-center tracking-wider !bg-ink-50"
                  />
                  <div className="text-sm font-medium text-ink-400 mt-2 mb-6 text-center lowercase italic tracking-normal">wallet, téléphone ou identifiant bancaire</div>
                  
                  <div className="flex items-center justify-center gap-2.5 flex-wrap">
                    {WALLETS.map(w => (
                      <img key={w.name} src={w.logo} alt={w.name} className="w-8 h-8 rounded-2xl border border-ink-100" />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-ink-100 flex justify-between items-center">
                <Button variant="ghost" onClick={() => setStep(2)} className="!border-none !px-2">
                  <ChevronLeft size={14} /> Retour
                </Button>
                <Button
                  onClick={submit}
                  disabled={loading || !canConfirm}
                  variant={!canConfirm ? 'ghost' : 'secondary'}
                  className={`!px-8 !py-3.5 !rounded-2xl ${loading ? 'opacity-80' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Traitement…</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {pispiTab === 'qr' ? 'Confirmer le scan' : 'Payer maintenant'}
                      <ArrowRight size={16} />
                    </div>
                  )}
                </Button>
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
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-display font-semibold mb-1">Mes paiements</h1>
        <p className="text-xs text-ink-500">Historique complet · Avril 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total payé (avril)', value: formatAmount(totalPaye), unit: 'FCFA', color: 'text-forest-600' },
          { label: 'Reçus émis', value: String(HISTORIQUE.filter(r => r.status === 'ok').length), unit: 'reçus', color: 'text-lagune-600' },
          { label: 'Jours en retard', value: '1', unit: 'à régulariser', color: 'text-terra-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-ink-100  p-5">
            <div className="text-sm font-medium text-ink-500 mb-2 font-bold uppercase tracking-wider">{c.label}</div>
            <div className={`t-h1 !text-2xl ${c.color}`}>
              {c.value}<span className="text-xs text-ink-500 text-ink-400 ml-2 font-medium">{c.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-ink-100  !p-0 overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-paper-50 border-b border-ink-100">
                {['N° reçu', 'Date', 'Type de taxe', 'Montant', 'PSP', 'Statut', ''].map((h, i) => (
                  <th key={i} className={`px-4 py-3.5 text-sm font-medium text-ink-500 font-bold uppercase tracking-wider text-left ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {HISTORIQUE.map(r => (
                <tr key={r.num} className="hover:bg-paper-50/50 transition-colors">
                  <td className="px-4 py-4 font-mono text-[13px] text-ink-900">{r.num}</td>
                  <td className="px-4 py-4 text-[13px] text-ink-600">{r.date}</td>
                  <td className="px-4 py-4 text-[13px] text-ink-900 font-medium">{r.type}</td>
                  <td className={`px-4 py-4 text-right font-mono font-bold text-[14px] ${r.status === 'ok' ? 'text-ink-900' : 'text-terra-700'}`}>
                    {r.montant ? `${formatAmount(r.montant)} F` : '—'}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-ink-600">{r.psp}</td>
                  <td className="px-4 py-4">
                    <Pill variant={r.status === 'ok' ? 'success' : 'danger'} size="sm">
                      {r.status === 'ok' ? 'Payé' : 'Impayé'}
                    </Pill>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {r.status === 'ok' && (
                      <Button variant="ghost" className="!px-2.5 !py-1.5 !text-[12px]">
                        <Download size={14} /> PDF
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => go('declaration')}>
          <FileText size={16} /> Nouvelle déclaration
        </Button>
      </div>
    </div>
  )
}

// ── Screen: Profil ──
function ScreenProfil({ go }: { go: (s: Screen) => void }) {
  const { isMobile } = useBreakpoint()
  const totalMensuel = ACTIVITES_CONTRIBUABLE.filter(a => a.statut === 'actif').reduce((s, a) => s + a.taxeMensuelle, 0)
  return (
    <div className="max-w-[640px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-display font-semibold mb-1">Mon profil</h1>
        <p className="text-xs text-ink-500">Contribuable enregistré à la Mairie de Cocody</p>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100  p-6 md:p-8 mb-6">
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-ink-100">
          <div className="w-16 h-16 rounded-full bg-ocre-500 text-white flex items-center justify-center font-bold text-2xl ">AK</div>
          <div>
            <div className="text-2xl font-display font-semibold text-ink-900">Adjoua Kouamé</div>
            <div className="text-xs text-ink-500 text-ink-500 mt-1">{ACTIVITES_CONTRIBUABLE.length} activités enregistrées · Cocody</div>
          </div>
        </div>

        <div className="text-sm font-medium text-ink-400 mb-4 font-bold uppercase tracking-wider">Identité fiscale</div>
        <div className="space-y-1 mb-8">
          {[
            ['NUI', 'NUI-2026-12401'],
            ['Commune', 'Cocody'],
            ['Téléphone', '+225 07 12 34 56 78'],
            ['Inscription', 'Janvier 2026'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 border-b border-ink-50 last:border-0">
              <span className="text-[14px] text-ink-500 font-medium">{k}</span>
              <span className={`text-[14px] font-bold text-ink-900 ${['NUI', 'Téléphone'].includes(k) ? 'font-mono' : ''}`}>{v}</span>
            </div>
          ))}
        </div>

        {/* Activités résumé */}
        <div className="text-sm font-medium text-ink-400 mb-4 font-bold uppercase tracking-wider">
          Activités &amp; régimes fiscaux
        </div>
        <div className="space-y-3 mb-4">
          {ACTIVITES_CONTRIBUABLE.map(act => (
            <div key={act.id} className="flex justify-between items-center p-3 rounded-2xl bg-paper-50 border border-ink-100 group">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-ink-900 leading-tight">{act.nom}</div>
                <div className="text-[11px] text-ink-500 mt-0.5">{act.regime}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="t-amount font-bold text-lagune-700">{formatAmount(act.taxeMensuelle)} F</span>
                <Pill variant={act.statut === 'actif' ? 'success' : 'warning'} size="sm">
                  {act.statut === 'actif' ? 'Actif' : 'Attente'}
                </Pill>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => go('mes_activites')} className="text-xs text-ink-500 !text-lagune-600 font-bold hover:underline mb-8 block">
          Voir le détail complet des activités →
        </button>

        <div className="text-sm font-medium text-ink-400 mb-4 font-bold uppercase tracking-wider">Solde fiscal — Avril 2026</div>
        <div className="bg-forest-50 rounded-2xl p-5 flex justify-between items-center border border-forest-200">
          <div>
            <div className="text-[12px] text-forest-700 font-bold mb-1">Total mensuel toutes activités</div>
            <div className="t-h2 !text-xl !font-mono text-forest-900">{formatAmount(totalMensuel)} FCFA</div>
          </div>
          <Pill variant="success" className="!px-5 !py-2 !text-[13px] font-bold ">À jour ✓</Pill>
        </div>
      </div>

      <Button variant="ghost" className="!text-terra-600 hover:!bg-terra-50 hover:!text-terra-700">
        <LogOut size={16} /> Se déconnecter
      </Button>
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
      <div className="max-w-[580px] mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="w-[72px] h-[72px] rounded-full bg-lagune-100 flex items-center justify-center mx-auto mb-6 shadow-[0_0_0_8px_var(--lagune-50)]">
            <CheckCircle size={34} className="text-lagune-700" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-ink-900 mb-2">Déclaration enregistrée</h2>
          <p className="text-xs text-ink-500 mb-8 max-w-[420px] mx-auto leading-relaxed">
            Votre demande a été transmise à la Mairie. Un agent se déplacera pour constater votre activité dans les <b>{activiteChoisie?.delaiTraitement ?? '5 jours ouvrés'}</b>.
          </p>

          <div className="bg-white rounded-2xl border border-ink-100  p-6 max-w-[400px] mx-auto mb-8 text-left divide-y divide-ink-100">
            <div className="text-sm font-medium text-ink-500 font-bold uppercase tracking-wider mb-4">Récapitulatif</div>
            {[
              ['N° dossier', 'DA-2026-04289'],
              ['Activité', activiteChoisie?.label ?? '—'],
              ['Contribuable', nom || 'Adjoua Kouamé'],
              ['Adresse', adresse || '—'],
              ...(gpsLat && gpsLng ? [['GPS', `${gpsLat}, ${gpsLng}`] as [string, string]] : []),
              ['Étape suivante', 'Visite agent constat'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 first:pt-0">
                <span className="text-[13px] text-ink-500 shrink-0">{k}</span>
                <span className="text-[13px] font-bold text-ink-900 text-right">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-ocre-50 border border-ocre-200 rounded-2xl max-w-[400px] mx-auto mb-8 text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 ">
              <Clock size={20} className="text-ocre-600" />
            </div>
            <div className="text-[13px] text-ocre-900 leading-snug">
              <b className="block mb-0.5">Visite de constat</b>
              Un agent de la brigade de constat passera vérifier votre établissement. Veillez à être présent.
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => go('home')} variant="ghost">
              Retour à l&apos;accueil
            </Button>
            <Button onClick={() => go('historique')} variant="primary">
              <History size={14} /> Suivi de mes dossiers
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-display font-semibold mb-1">Déclarer une activité</h1>
        <p className="text-xs text-ink-500">Enregistrez votre activité sans vous déplacer · Délibération N°2025-172</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((label, i) => {
          const n = i + 1
          const stepNum = typeof step === 'number' ? step : 4
          const isDone = stepNum > n
          const isActive = stepNum === n
          return (
            <React.Fragment key={label}>
              <div
                className={`flex items-center gap-2.5 shrink-0 ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isDone && setStep(n as ActStep)}
              >
                <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                  isDone ? 'bg-forest-600 text-white' : 
                  isActive ? 'bg-lagune-600 text-white ring-4 ring-lagune-100' : 
                  'bg-ink-100 text-ink-400'
                }`}>
                  {isDone ? '✓' : n}
                </div>
                <span className={`text-[12px] font-bold whitespace-nowrap ${
                  isActive ? 'text-lagune-700' : 
                  isDone ? 'text-ink-700' : 
                  'text-ink-400'
                }`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${
                  isDone ? 'bg-forest-500' : 'bg-ink-200'
                }`} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* ── Step 1: Type d'activité ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-ink-100  p-5 md:p-6">
          <h2 className="text-sm font-semibold mb-5 font-display">Décrivez votre activité</h2>

          {/* ── Assistant IA — identification activité ── */}
          {actAiStep !== 'closed' && (
            <div className="mb-6 rounded-2xl border border-lagune-200 bg-lagune-50 overflow-hidden ">
              <div className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-2xl bg-lagune-600 flex items-center justify-center shrink-0 ">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[13px] text-lagune-950">Identification automatique</div>
                  <div className="text-[11px] text-lagune-700 font-medium">L&apos;IA détermine votre catégorie d&apos;activité</div>
                </div>
              </div>

              {actAiStep === 'open' && (
                <div className="p-4 pt-0 border-t border-lagune-200">
                  <div className="mt-4 mb-4">
                    <label className="text-sm font-medium text-lagune-700 mb-1.5 block">Description de l&apos;activité *</label>
                    <textarea
                      value={actAiDesc}
                      onChange={e => setActAiDesc(e.target.value)}
                      placeholder="Ex : Je tiens un salon de coiffure mixte au quartier Riviera 2..."
                      rows={3}
                      className="app-input !bg-white !border-lagune-200 focus:!border-lagune-500 !text-[13px]"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="text-sm font-medium text-lagune-700 mb-1.5 block">Secteur principal (facultatif)</label>
                    <select
                      value={actAiSecteur}
                      onChange={e => setActAiSecteur(e.target.value)}
                      className="app-input !bg-white !border-lagune-200 !text-[13px]"
                    >
                      <option value="">— Choisir —</option>
                      {['Commerce & distribution', 'Artisanat & services', 'Restauration', 'Transport', 'Marché / ambulant', 'Autre'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={analyserActivite}
                    disabled={!actAiDesc.trim()}
                    className="w-full !py-2.5 !text-[13px]"
                  >
                    <Sparkles size={14} /> Identifier mon activité
                  </Button>
                </div>
              )}

              {actAiStep === 'loading' && (
                <div className="p-5 border-t border-lagune-200 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-lagune-300 border-t-lagune-600 animate-spin" />
                  <span className="text-[13px] text-lagune-700 font-medium font-ui">Identification en cours…</span>
                </div>
              )}

              {actAiStep === 'result' && actAiResult && (
                <div className="p-4 border-t border-lagune-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={15} className="text-forest-600" />
                    <span className="font-bold text-[14px] text-lagune-950">
                      {TYPES_ACTIVITES.find(a => a.id === actAiResult.activiteId)?.label ?? actAiResult.regime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm font-medium bg-lagune-100 text-lagune-700 px-2 py-0.5 rounded font-mono font-bold">{actAiResult.compte}</span>
                    <span className="text-sm font-medium bg-paper-100 text-ink-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{actAiResult.categorie}</span>
                  </div>
                  <p className="text-[12px] text-ink-700 leading-relaxed mb-4">{actAiResult.justification}</p>
                  <div className="flex gap-2">
                    <Button onClick={confirmerActivite} className="!py-2 !text-[12px] !px-4 bg-forest-600 hover:bg-forest-700">
                      Confirmer cette activité
                    </Button>
                    <Button onClick={() => setActAiStep('open')} variant="ghost" className="!py-2 !text-[12px] !px-4 !border-lagune-200 !text-lagune-700 hover:!bg-lagune-100">
                      Modifier
                    </Button>
                  </div>
                </div>
              )}

              {actAiStep === 'error' && (
                <div className="p-4 border-t border-lagune-200">
                  <div className="text-[12px] text-terra-700 bg-terra-50 p-3 rounded-2xl border border-terra-100 flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{actAiError}</span>
                  </div>
                  <button onClick={() => setActAiStep('open')} className="mt-2.5 text-[12px] font-bold text-lagune-600 hover:underline">
                    ↩ Réessayer
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => setActAiStep(s => s === 'closed' ? 'open' : 'closed')}
              className="flex items-center gap-2 text-[12px] font-bold text-lagune-600 hover:underline transition-all"
            >
              <ChevronDown size={14} className={`transition-transform ${actAiStep === 'closed' ? '' : 'rotate-180'}`} />
              {actAiStep === 'closed' ? "Utiliser l'assistant intelligent" : "Choisir manuellement dans la liste"}
            </button>
          </div>

          {actAiStep === 'closed' && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-ink-600 mb-1.5 block">Catégorie</label>
                <select value={categorie} onChange={e => { setCategorie(e.target.value); setActiviteId('') }} className="app-input text-[14px]">
                  <option value="">— Toutes les catégories —</option>
                  {CATEGORIES_ACTIVITES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-ink-600 mb-1.5 block">Type d&apos;activité *</label>
                <select value={activiteId} onChange={e => setActiviteId(e.target.value)} className={`app-input text-[14px] ${activiteId ? 'border-lagune-400 ring-2 ring-lagune-50' : ''}`}>
                  <option value="">— Sélectionnez une activité —</option>
                  {activitesFiltrees.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Fiche activité — Carte détaillée si sélectionnée */}
          {activiteChoisie && (
            <div className="mt-6 bg-lagune-50 border border-lagune-200 rounded-2xl p-5 md:p-6 ">
              <div className="text-sm font-semibold !text-base text-lagune-950 mb-5 pb-4 border-b border-lagune-200/50">{activiteChoisie.label}</div>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                {[
                  ['Régime fiscal', activiteChoisie.regimeFiscal],
                  ['Compte SYSCOHADA', activiteChoisie.compte],
                  ['Tarif applicable', activiteChoisie.tarifApplicable],
                  ['Délai traitement', activiteChoisie.delaiTraitement],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs font-semibold uppercase tracking-widest text-lagune-600 mb-1 font-bold uppercase tracking-wider">{k}</div>
                    <div className={`text-[13px] font-bold text-lagune-900 ${k === 'Compte SYSCOHADA' ? 'font-mono' : ''}`}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-lagune-600 mb-3 font-bold uppercase tracking-wider">Pièces requises lors du constat</div>
                <div className="space-y-2">
                  {activiteChoisie.pieceRequises.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[12px] text-lagune-800 font-medium">
                      <CheckCircle size={14} className="text-lagune-400 shrink-0 mt-0.5" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              {activiteChoisie.note && (
                <div className="mt-5 p-3.5 bg-white/60 border border-lagune-200 rounded-2xl text-[11px] text-lagune-700 leading-relaxed italic">
                  Note : {activiteChoisie.note}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-ink-100 flex justify-end">
            <Button onClick={() => activiteId && setStep(2)} disabled={!activiteId}>
              Continuer <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Informations ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-ink-100  p-5 md:p-6">
          <div className="mb-6 pb-5 border-b border-ink-100">
            <h2 className="text-lg font-display font-semibold mb-1">Détails de l&apos;établissement</h2>
            <p className="text-xs text-ink-500 !text-lagune-700 font-medium">{activiteChoisie?.label}</p>
          </div>

          <div className="space-y-5">
            {[
              { label: "Nom commercial *", val: nom, set: setNom, placeholder: 'Ex : Salon Bijou, Épicerie Riviera…' },
              { label: 'Adresse complète *', val: adresse, set: setAdresse, placeholder: 'Ex : Riviera 2, Rue G5' },
              { label: 'NUI / RCCM (facultatif)', val: nui, set: setNui, placeholder: 'Ex : NUI-2026-XXXXX' },
              { label: 'Téléphone *', val: tel, set: setTel, placeholder: '+225 07 XX XX XX XX' },
            ].map(({ label, val, set, placeholder }) => (
              <div key={label}>
                <label className="text-sm font-medium text-ink-600 mb-1.5 block">{label}</label>
                <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder} className="app-input text-[14px]" />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-ink-600 mb-1.5 block">
                Quartier / commune
                {quartierAuto && <span className="ml-3 text-sm font-medium !text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">Localisé</span>}
              </label>
              <select
                value={quartier}
                onChange={e => { setQuartier(e.target.value); setQuartierAuto(false) }}
                className={`app-input text-[14px] ${quartierAuto ? 'border-forest-400' : ''}`}
              >
                {QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            {/* Géolocalisation */}
            <div>
              <label className="text-sm font-medium text-ink-600 mb-2 block">Position GPS pour l&apos;agent de constat</label>
              
              {gpsMode === null ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button onClick={detectGps} disabled={gpsLoading} className="!w-full !py-2.5">
                    {gpsLoading ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Détection…</> : <><MapPin size={16} /> Ma position actuelle</>}
                  </Button>
                  <Button variant="ghost" onClick={() => setGpsMode('manual')} className="!w-full !py-2.5 !text-ink-600">
                    Saisir manuellement
                  </Button>
                </div>
              ) : gpsMode === 'auto' && gpsLat ? (
                <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-600"><MapPin size={14} /></div>
                    <div>
                      <div className="font-mono text-[13px] font-bold text-forest-900 leading-none">{gpsLat}, {gpsLng}</div>
                      <div className="text-sm font-medium !text-forest-600 mt-1 uppercase font-bold tracking-wider">Position enregistrée</div>
                    </div>
                  </div>
                  <button onClick={() => { setGpsMode(null); setGpsLat(''); setGpsLng('') }} className="text-sm font-medium !text-ink-400 hover:!text-ink-900 font-bold uppercase underline border-none bg-transparent cursor-pointer">Changer</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {gpsError && <div className="text-[12px] text-terra-700 flex gap-2"><AlertCircle size={14} className="shrink-0" /> {gpsError}</div>}
                  <div className="grid grid-cols-2 gap-3">
                    <input value={gpsLat} onChange={e => setGpsLat(e.target.value)} placeholder="Latitude" className="app-input font-mono !text-[13px]" />
                    <input value={gpsLng} onChange={e => setGpsLng(e.target.value)} placeholder="Longitude" className="app-input font-mono !text-[13px]" />
                  </div>
                  <Button variant="ghost" onClick={detectGps} className="!w-full !text-[12px] !py-1.5 !text-lagune-600">Retenter la localisation automatique</Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-ink-100 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ChevronLeft size={14} /> Retour
            </Button>
            <Button onClick={() => setStep(3)}>
              Pièces à joindre <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Documents ── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-ink-100  p-5 md:p-6">
          <div className="mb-6 pb-5 border-b border-ink-100">
            <h2 className="text-lg font-display font-semibold mb-1">Pièces justificatives</h2>
            <p className="text-xs text-ink-500">Documents à présenter lors du passage de l&apos;agent</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium text-ink-400 mb-3 font-bold uppercase tracking-wider">Documents obligatoires</div>
              <div className="space-y-2.5">
                {PIECES_COMMUNES.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-paper-50 border border-ink-100 rounded-2xl group hover:border-lagune-300 transition-colors">
                    <div className="w-9 h-9 rounded-2xl bg-lagune-100 text-lagune-600 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 text-[13px] text-ink-900 font-medium">{p}</div>
                    <Button variant="ghost" className="!px-3 !py-1.5 !text-[12px] !bg-white !text-lagune-700  border-ink-100">+ Joindre</Button>
                  </div>
                ))}
              </div>
            </div>

            {activiteChoisie && activiteChoisie.pieceRequises.length > 0 && (
              <div>
                <div className="text-sm font-medium text-ink-400 mb-3 font-bold uppercase tracking-wider">Spécifique — {activiteChoisie.label}</div>
                <div className="space-y-2.5">
                  {activiteChoisie.pieceRequises.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-paper-50 border border-ink-100 rounded-2xl group hover:border-ocre-300 transition-colors">
                      <div className="w-9 h-9 rounded-2xl bg-ocre-100 text-ocre-600 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 text-[13px] text-ink-900 font-medium">{p}</div>
                      <Button variant="ghost" className="!px-3 !py-1.5 !text-[12px] !bg-white !text-ocre-700  border-ink-100">+ Joindre</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-ocre-50 border border-ocre-100 rounded-2xl flex items-start gap-3">
            <AlertCircle size={16} className="text-ocre-600 shrink-0 mt-0.5" />
            <div className="text-[12px] text-ocre-900 leading-relaxed">
              <b>Dépôt optionnel :</b> Vous pouvez valider sans joindre les fichiers maintenant. L&apos;agent de constat vérifiera les originaux physiques sur place.
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-ink-100 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ChevronLeft size={14} /> Retour
            </Button>
            <Button onClick={submit} disabled={loading} className="!px-8">
              {loading ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi…</> : <><MapPin size={14} /> Soumettre ma déclaration</>}
            </Button>
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
    commerce: 'Commerce — 2 % du CA',
    services: 'Services / artisanat — 2,5 % du CA',
    ambulant: 'Vendeur ambulant — 100 F/jour',
    loue: 'Locaux loués — 1 %–5 % valeur locative',
    nuit_ent: 'Bar/Buvette — 3 000 F/mois',
    nuit_pat: 'Bar/Club (boissons) — 52 500 F/mois',
    taxi: 'Taxi communal — 20 000 F/trimestre',
    spectacle: 'Spectacle — 10 % recettes',
    sport: 'Manifestation sportive — 5 % recettes',
    charrette: 'Charrette — 1 000 F/mois',
    pub_papier: 'Affiche papier — 200 F/m²/mois',
    pub_enseigne: 'Enseigne peinte — 1 000 F/m²/mois',
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-xl font-display font-semibold mb-1">Mes activités</h1>
          <p className="text-xs text-ink-500">{ACTIVITES_CONTRIBUABLE.length} établissement(s) répertorié(s)</p>
        </div>
        <Button onClick={() => go('nouvelle_activite')} className="!text-[13px] !px-4">
          + Nouvelle activité
        </Button>
      </div>

      {/* Résumé fiscal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total mensuel', value: formatAmount(totalMensuel), unit: 'F', color: 'text-lagune-600' },
          { label: 'Enregistrées', value: String(ACTIVITES_CONTRIBUABLE.length), unit: 'act.', color: 'text-ink-900' },
          { label: 'Statut global', value: 'À jour', unit: 'Avril', color: 'text-forest-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-ink-100  p-4">
            <div className="text-sm font-medium text-ink-500 font-bold uppercase tracking-wider mb-2">{c.label}</div>
            <div className={`t-h2 !text-lg ${c.color}`}>{c.value}<span className="text-xs text-ink-500 text-ink-400 ml-1 font-medium">{c.unit}</span></div>
          </div>
        ))}
      </div>

      {/* Liste des activités */}
      <div className="space-y-3">
        {ACTIVITES_CONTRIBUABLE.map(act => (
          <div key={act.id} className="bg-white rounded-2xl border border-ink-100  !p-0 overflow-hidden  hover: transition-shadow">
            <div
              className="flex items-center gap-4 p-5 cursor-pointer bg-paper-0"
              onClick={() => setExpanded(expanded === act.id ? null : act.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-bold text-[15px] text-ink-900 leading-none">{act.nom}</span>
                  <Pill variant={act.statut === 'actif' ? 'success' : 'warning'} size="sm">
                    {act.statut === 'actif' ? 'Actif' : 'En attente'}
                  </Pill>
                </div>
                <div className="text-[12px] text-ink-500 font-medium">{act.regime} · Compte <span className="font-mono">{act.compte}</span></div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <div className="t-amount text-[17px] font-bold text-lagune-700">{formatAmount(act.taxeMensuelle)} F</div>
                <div className="text-[10px] text-ink-400 font-bold uppercase tracking-wider">par mois</div>
              </div>
              <ChevronDown size={18} className={`text-ink-300 transition-transform ${expanded === act.id ? 'rotate-180' : ''}`} />
            </div>

            {expanded === act.id && (
              <div className="bg-paper-50 border-t border-ink-100 p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    ['Identifiant', act.id],
                    ['NUI / RCCM', act.nui],
                    ['Régime fiscal', act.regime],
                    ['Compte budgétaire', act.compte],
                    ['Assiette', typeLabel[act.type] ?? act.type],
                    ...(act.ca ? [['CA annuel', `${formatAmount(act.ca)} FCFA`]] : []),
                    ['Taxe mensuelle', `${formatAmount(act.taxeMensuelle)} FCFA`],
                    ['Quartier', act.quartier],
                    ['Adresse', act.adresse],
                    ['Date enregistrement', act.dateEnreg],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-ink-100 last:border-0">
                      <span className="text-[12px] text-ink-500 font-medium uppercase tracking-wider">{k}</span>
                      <span className={`text-[13px] font-bold text-ink-900 text-right ${['Identifiant', 'NUI / RCCM', 'Compte budgétaire'].includes(k) ? 'font-mono' : ''}`}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={() => go('declaration')} className="!text-[12px] !px-4">
                    Payer ma taxe
                  </Button>
                  <Button variant="ghost" className="!text-[12px] !px-4 border-ink-200">
                    <Download size={14} /> Attestation fiscale
                  </Button>
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
    <div className="max-w-[900px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-lagune-100 text-lagune-700 text-[11px] font-bold uppercase tracking-wider mb-4">
          <BookOpen size={12} /> Document officiel 2026
        </div>
        <h1 className="text-xl font-display font-semibold mb-2 leading-tight">
          Barème fiscal municipal
        </h1>
        <p className="text-sm text-ink-500 max-w-[640px]">
          Délibération N°2025-172/CC/CM/SG du Conseil Municipal de Cocody. Tarifs applicables aux activités économiques sur le territoire communal.
        </p>
      </div>

      {/* Mairie header block */}
      <div className="bg-lagune-900 rounded-[24px] p-6 md:p-8 mb-10 relative overflow-hidden  group">
        <div className="absolute inset-0 bg-[url('/assets/pattern-kita.svg')] bg-[size:240px] opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-[72px] h-[72px] rounded-2xl bg-white/95 p-1 flex items-center justify-center shrink-0 ">
            <img src="/assets/logo-cocody.png" alt="Cocody" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <div className="font-display text-[22px] font-bold text-white mb-1 tracking-tight">Commune de Cocody</div>
            <div className="text-[13px] text-white/70 mb-4 font-medium">République de Côte d&apos;Ivoire · District d&apos;Abidjan</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                'Délibération 2025-172',
                'Exercice 2026',
                'Conforme SYSCOHADA',
                'CGI Art. 103–180',
              ].map(t => (
                <span key={t} className="text-[10px] font-bold font-mono text-white/50 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal intro */}
      <div className="bg-white rounded-2xl border border-ink-100  p-6 mb-10 leading-relaxed text-[13px] text-ink-700 space-y-4 !bg-paper-0  border-ink-100">
        <p>
          <b className="text-ink-900">Article 1.</b> Le présent barème fixe les taux et montants des taxes communales perçues par la Mairie de Cocody pour l&apos;exercice budgétaire 2026, en application du Code Général des Impôts et des directives UEMOA.
        </p>
        <p>
          <b className="text-ink-900">Article 2.</b> Toute personne physique ou morale exerçant une activité économique sur le territoire de la Commune est assujettie aux taxes définies ci-après, selon son régime fiscal.
        </p>
        <div className="pt-2 flex items-center gap-2 text-lagune-600 font-bold">
          <CheckCircle size={14} /> Reçu numérique immédiat et vérifiable pour tout paiement
        </div>
      </div>

      {/* Tax categories */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold text-ink-900 !text-[20px]">
            Détail du barème
          </h2>
          <span className="text-sm font-medium bg-ink-100 text-ink-600 px-2.5 py-1 rounded-pill font-bold">
            {BAREME_COMPLET.reduce((n, s) => n + s.chapitres.reduce((m, ch) => m + ch.sections.length, 0), 0)} RUBRIQUES
          </span>
        </div>

        {BAREME_COMPLET.map(section => (
          <div key={section.id} className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-lagune-600 font-bold uppercase tracking-widest mb-3 ml-1">
              {section.label}
            </div>

            <div className="space-y-3">
              {section.chapitres.map(chapitre => {
                const isOpen = openChapitres.has(`${section.id}-${chapitre.chapitre}`)
                return (
                  <div key={chapitre.chapitre} className="bg-white rounded-2xl border border-ink-100  !p-0 overflow-hidden  hover: transition-all border-ink-100 bg-paper-0">
                    <button
                      onClick={() => toggleChapitre(`${section.id}-${chapitre.chapitre}`)}
                      className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-paper-50 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-lagune-50 text-lagune-700 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold border border-lagune-100">
                        {chapitre.chapitre}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[15px] text-ink-900 leading-snug mb-1">{chapitre.titre}</div>
                        <div className="text-[11px] text-ink-400 font-medium uppercase tracking-wider">
                          {chapitre.sections.length} rubriques · {chapitre.sections.reduce((n, s) => n + s.lignes.length, 0)} tarifs
                        </div>
                      </div>
                      <ChevronDown size={18} className={`text-ink-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="border-t border-ink-100 p-4 md:p-6 bg-paper-50/30">
                        {chapitre.sections.map((sec, si) => (
                          <div key={`${sec.compte}-${si}`} className="mb-8 last:mb-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-[11px] font-bold bg-lagune-100 text-lagune-700 px-2 py-0.5 rounded">{sec.compte}</span>
                              <span className="font-bold text-[14px] text-ink-950 leading-tight">{sec.label}</span>
                            </div>
                            {sec.description && (
                              <p className="text-[12px] text-ink-500 mb-4 leading-relaxed">{sec.description}</p>
                            )}
                            <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden ">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-paper-50/80">
                                    <th className="px-3.5 py-2.5 text-sm font-medium text-ink-400 font-bold uppercase text-left">Désignation</th>
                                    <th className="px-3.5 py-2.5 text-sm font-medium text-ink-400 font-bold uppercase text-left">Unité</th>
                                    <th className="px-3.5 py-2.5 text-sm font-medium text-ink-400 font-bold uppercase text-right">Montant</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-ink-50">
                                  {sec.lignes.map((l, li) => (
                                    <tr key={li} className="hover:bg-lagune-50/20">
                                      <td className="px-3.5 py-3 text-[13px] text-ink-900 font-medium">{l.label}</td>
                                      <td className="px-3.5 py-3 text-[12px] text-ink-500 italic max-w-[240px]">{l.unite}</td>
                                      <td className="px-3.5 py-3 text-right font-mono font-bold text-[14px] text-lagune-700 whitespace-nowrap">
                                        {typeof l.montant === 'number' ? <span className="t-amount">{formatAmount(l.montant)} F</span> : l.montant}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Activity types table */}
      <div className="mb-12">
        <h2 className="text-2xl font-display font-semibold text-ink-900 !text-[20px] mb-4">Répertoire des activités</h2>
        <p className="text-xs text-ink-500 text-ink-500 mb-6">
          Classification officielle pour la détermination du régime fiscal.
        </p>
        <div className="bg-white rounded-2xl border border-ink-100  !p-0 overflow-hidden  border-ink-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-paper-50 border-b border-ink-100">
                  {['Activité', 'Catégorie', 'Régime fiscal', 'Compte', 'Délai constat'].map((h, i) => (
                    <th key={i} className="px-4 py-3.5 text-sm font-medium text-ink-500 font-bold uppercase text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {TYPES_ACTIVITES.map((a, i) => (
                  <tr key={a.id} className="hover:bg-paper-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-[13px] font-bold text-ink-900">{a.label}</div>
                      <div className="text-[10px] text-ink-400 font-mono mt-0.5">{a.id}</div>
                    </td>
                    <td className="px-4 py-4 text-[12px] text-ink-600">{a.categorie}</td>
                    <td className="px-4 py-4 text-[12px] text-ink-600 font-medium">{a.regimeFiscal}</td>
                    <td className="px-4 py-4 font-mono text-[13px] font-bold text-lagune-600">{a.compte}</td>
                    <td className="px-4 py-4">
                      <Pill variant="warning" size="sm">{a.delaiTraitement}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SYSCOHADA summary */}
      <div className="bg-white rounded-2xl border border-ink-100  p-6 md:p-8 mb-10 bg-paper-0 border-ink-100 ">
        <h3 className="font-display font-bold text-[17px] mb-6 text-ink-950">Comptes budgétaires SYSCOHADA</h3>
        <div className="space-y-2">
          {BAREME_COMPLET.flatMap(s => s.chapitres.flatMap(ch => ch.sections)).map((sec, i) => (
            <div key={`${sec.compte}-${i}`} className="flex items-center gap-4 py-3 border-b border-ink-50 last:border-0 hover:bg-lagune-50/20 px-2 rounded-2xl transition-colors">
              <span className="w-16 font-mono text-[13px] font-bold text-lagune-600">{sec.compte}</span>
              <span className="flex-1 text-[13px] font-bold text-ink-900">{sec.label}</span>
              <span className="text-[11px] text-ink-400 uppercase tracking-widest font-bold">
                {sec.lignes.length} TARIFS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer legal text */}
      <div className="bg-ink-900 rounded-2xl p-6 md:p-8 text-white/60 text-[12px] leading-relaxed mb-8 ">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle size={20} className="text-lagune-400" />
          <span className="font-display text-[15px] font-bold text-white uppercase tracking-wider">Dispositions légales</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              <b className="text-white/90">Contestations :</b> Tout contribuable peut contester le montant de sa taxation devant le service des impôts de la Mairie dans un délai de 30 jours.
            </p>
            <p>
              <b className="text-white/90">Pénalités :</b> Les retards de paiement entraînent une majoration de 10 % par mois, conformément au SYSCOHADA révisé.
            </p>
          </div>
          <div className="md:border-l md:border-white/10 md:pl-8">
            <p className="mb-2 uppercase font-bold text-[10px] tracking-widest text-white/40">Textes de référence</p>
            <ul className="space-y-1 text-white/80">
              <li>· Code Général des Impôts CI (Art. 103–180)</li>
              <li>· Plan Comptable SYSCOHADA (2017)</li>
              <li>· Délibération N°2025-172/CC/CM/SG</li>
              <li>· Directives UEMOA Finances Locales</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex flex-wrap gap-3 pt-6 border-t border-ink-100">
        <Button variant="ghost" className="border-ink-200">
          <Download size={16} /> Télécharger le PDF complet
        </Button>
        <Button onClick={() => go('nouvelle_activite')} variant="primary" className="!px-6">
          <PlusCircle size={16} /> Déclarer mon activité
        </Button>
      </div>
    </div>
  )
}

// ── Root ──
export default function PortailPage() {
  const [screen, setScreen] = useState<Screen>('home')
  const { isTablet } = useBreakpoint()

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col">
      <Topnav screen={screen} go={setScreen} />
      
      <main className={`flex-1 overflow-x-hidden ${isTablet ? 'pb-[88px]' : 'pb-12'}`}>
        <div className="animate-in fade-in duration-500">
          {screen === 'home'              && <ScreenHome             go={setScreen} />}
          {screen === 'mes_activites'     && <ScreenMesActivites     go={setScreen} />}
          {screen === 'declaration'       && <ScreenDeclaration      go={setScreen} />}
          {screen === 'historique'        && <ScreenHistorique       go={setScreen} />}
          {screen === 'profil'            && <ScreenProfil           go={setScreen} />}
          {screen === 'nouvelle_activite' && <ScreenNouvelleActivite go={setScreen} />}
          {screen === 'bareme'            && <ScreenBareme           go={setScreen} />}
        </div>
      </main>

      <BottomNav screen={screen} go={setScreen} />
    </div>
  )
}
