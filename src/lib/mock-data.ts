export type PaymentStatus = 'ok' | 'late' | 'pending'
export type AgentPerf = 'up' | 'flat' | 'down'
export type RelanceStatus = 'urgent' | 'avertissement' | 'en_cours' | 'resolue'

export interface Contribuable {
  id: string
  name: string
  stall: string
  category: string
  market: string
  status: PaymentStatus
  due: number
  lastPayment: string
  phone: string
  history: { date: string; amount: number | null; psp: string }[]
}

export interface Agent {
  id: string
  name: string
  role: 'Agent' | 'Contrôleur'
  zone: string
  collected: number | null
  receipts: number
  perf: AgentPerf
  trend: string
}

export interface Payment {
  receiptNum: string
  contribuable: string
  stall: string
  psp: string
  amount: number
  status: 'ok' | 'pending'
  time: string
}

export interface DossierRetard {
  id: string
  name: string
  stall: string
  category: string
  montantDu: number
  joursRetard: number
  relanceStatus: RelanceStatus
  derniereRelance: string | null
  phone: string
  market: string
}

export const KPI_DATA = {
  recettesJour: 2_430_000,
  recettesJourDelta: 12.4,
  recettesJourRef: 2_162_000,
  contribuablesPaies: 284,
  contribuablesTotal: 412,
  contribuablesPaiesDelta: 18,
  enRetard: 47,
  enRetardDelta: 3,
  tresorReconcilie: 14_200_000,
  tresorJours: 7,
  tresorLastSync: 'hier 22h00',
}

export const KPI_RECOUVREMENT = {
  totalImpayes: 15_300_000,
  contribuablesEnRetard: 782,
  enRetardPlus30j: 134,
  smsEnvoyes: 1247,
  tauxReponse: 34,
  montantRecouvre: 3_840_000,
}

export const CHART_HOURLY = [
  { h: '7h', v: 80 }, { h: '8h', v: 180 }, { h: '9h', v: 310 },
  { h: '10h', v: 420 }, { h: '11h', v: 380 }, { h: '12h', v: 190 },
  { h: '13h', v: 150 }, { h: '14h', v: 280 }, { h: '15h', v: 330 },
  { h: '16h', v: 240 }, { h: '17h', v: 150 }, { h: '18h', v: 90 },
]

export const PSP_DATA = [
  { name: 'Orange Money', pct: 42, color: '#FF7900' },
  { name: 'Wave',         pct: 28, color: '#1DC9F5' },
  { name: 'MTN Money',    pct: 18, color: '#FFCC00' },
  { name: 'Moov Money',   pct: 8,  color: '#00A0E9' },
  { name: 'Espèces',      pct: 4,  color: '#6B7583' },
]

export const AGENTS: Agent[] = [
  { id: 'A01', name: 'Kouadio Adou',    role: 'Agent',       zone: 'Cocovico A', collected: 485_000, receipts: 42, perf: 'up',   trend: '+18 %' },
  { id: 'A02', name: 'Aïcha Bamba',     role: 'Agent',       zone: 'Cocovico B', collected: 412_500, receipts: 38, perf: 'up',   trend: '+9 %' },
  { id: 'A03', name: 'Yao Koffi',       role: 'Agent',       zone: 'Cocovico C', collected: 356_000, receipts: 29, perf: 'flat', trend: '0 %' },
  { id: 'A04', name: 'Marie Diallo',    role: 'Contrôleur',  zone: 'Brigade',    collected: null,    receipts: 12, perf: 'flat', trend: '12 vérif.' },
  { id: 'A05', name: 'Sékou Traoré',    role: 'Agent',       zone: 'Cocovico D', collected: 214_000, receipts: 19, perf: 'down', trend: '-14 %' },
]

export const RECENT_PAYMENTS: Payment[] = [
  { receiptNum: '2026-04-1847', contribuable: 'Adjoua Kouamé',   stall: 'B-214', psp: 'Orange', amount: 15_000, status: 'ok',      time: 'il y a 3 min' },
  { receiptNum: '2026-04-1846', contribuable: 'Kouadio Yao',     stall: 'A-102', psp: 'Wave',   amount: 10_000, status: 'ok',      time: 'il y a 8 min' },
  { receiptNum: '2026-04-1845', contribuable: 'Aïcha Traoré',    stall: 'C-54',  psp: 'MTN',    amount: 15_000, status: 'ok',      time: 'il y a 15 min' },
  { receiptNum: '2026-04-1844', contribuable: 'Moussa Ouattara', stall: 'B-98',  psp: 'Moov',   amount: 8_000,  status: 'pending', time: 'il y a 22 min' },
]

export const CONTRIBUABLES: Contribuable[] = [
  {
    id: 'C-2891', name: 'Adjoua Kouamé',    stall: 'B-214', category: 'Légumes',        market: 'Cocovico', status: 'ok',      due: 15_000, lastPayment: '3 min',
    phone: '+225 07 12 34 56 78',
    history: [
      { date: '14/04', amount: 15_000, psp: 'Orange' }, { date: '13/04', amount: 15_000, psp: 'Orange' },
      { date: '12/04', amount: 15_000, psp: 'Wave' },   { date: '11/04', amount: null,   psp: '—' },
      { date: '10/04', amount: 15_000, psp: 'MTN' },    { date: '09/04', amount: 15_000, psp: 'Orange' },
    ],
  },
  { id: 'C-2752', name: 'Kouadio Yao',       stall: 'A-102', category: 'Viande',          market: 'Cocovico', status: 'ok',      due: 25_000, lastPayment: '12 min',  phone: '+225 07 22 11 33 44', history: [] },
  { id: 'C-2634', name: 'Aïcha Traoré',      stall: 'C-54',  category: 'Tissus',          market: 'Cocovico', status: 'late',    due: 45_000, lastPayment: '3 j',     phone: '+225 05 88 77 66 55', history: [] },
  { id: 'C-2598', name: 'Moussa Ouattara',   stall: 'B-98',  category: 'Épicerie',        market: 'Cocovico', status: 'pending', due: 8_000,  lastPayment: '1 h',     phone: '+225 01 22 33 44 55', history: [] },
  { id: 'C-2511', name: 'Fatou Koné',        stall: 'D-12',  category: 'Poisson',         market: 'Cocovico', status: 'ok',      due: 20_000, lastPayment: '5 min',   phone: '+225 07 99 88 77 66', history: [] },
  { id: 'C-2489', name: 'Séraphin Bonny',    stall: 'A-205', category: 'Quincaillerie',   market: 'Cocovico', status: 'late',    due: 30_000, lastPayment: '7 j',     phone: '+225 05 44 55 66 77', history: [] },
  { id: 'C-2401', name: 'Mariam Cissé',      stall: 'C-08',  category: 'Cosmétiques',     market: 'Cocovico', status: 'ok',      due: 12_000, lastPayment: '28 min',  phone: '+225 07 66 55 44 33', history: [] },
  { id: 'C-2388', name: 'Ibrahim Diabaté',   stall: 'B-302', category: 'Chaussures',      market: 'Cocovico', status: 'ok',      due: 18_000, lastPayment: '2 h',     phone: '+225 05 11 22 33 44', history: [] },
]

export const DOSSIERS_RETARD: DossierRetard[] = [
  { id: 'R-0041', name: 'Transport Gbaka Express', stall: 'T-01', category: 'Transport urbain', montantDu: 2_450_000, joursRetard: 47, relanceStatus: 'urgent',        derniereRelance: null,     phone: '+225 07 44 55 66 77', market: 'Cocovico' },
  { id: 'R-0038', name: 'Ibrahim Diabaté',          stall: 'B-302',category: 'Chaussures',       montantDu: 980_000,  joursRetard: 38, relanceStatus: 'urgent',        derniereRelance: null,     phone: '+225 05 11 22 33 44', market: 'Cocovico' },
  { id: 'R-0035', name: 'Aïcha Traoré',             stall: 'C-54', category: 'Tissus',           montantDu: 720_000,  joursRetard: 31, relanceStatus: 'urgent',        derniereRelance: '12/04',  phone: '+225 05 88 77 66 55', market: 'Cocovico' },
  { id: 'R-0029', name: 'Salon Coiffure Yves',      stall: 'SC-12',category: 'Services',         montantDu: 560_000,  joursRetard: 24, relanceStatus: 'avertissement', derniereRelance: '10/04',  phone: '+225 07 33 44 55 66', market: 'Cocovico' },
  { id: 'R-0027', name: "Épicerie du Carrefour",    stall: 'E-07', category: 'Épicerie',         montantDu: 480_000,  joursRetard: 18, relanceStatus: 'en_cours',      derniereRelance: '08/04',  phone: '+225 05 77 88 99 00', market: 'Cocovico' },
  { id: 'R-0024', name: 'Menuiserie Moderne CI',    stall: 'M-03', category: 'Artisanat',        montantDu: 390_000,  joursRetard: 15, relanceStatus: 'en_cours',      derniereRelance: '07/04',  phone: '+225 07 11 22 33 44', market: 'Cocovico' },
]

export const TRESOR_DATA = {
  certifieRef: 'TR-2026-0415',
  montant: 138_200_000,
  certifiedAt: '15/04/2026 à 22h05',
  reconcilieJ: 7,
  tauxRecouvrement: 84.7,
  objectif: 90,
}

export const RECEIPT_PUBLIC: Record<string, {
  num: string; date: string; contribuable: string; stall: string;
  agent: string; psp: string; amount: number; tresorRef: string; tresorDate: string;
}> = {
  '1847': {
    num: '2026-04-1847', date: '14/04/2026 11h42', contribuable: 'A. KOUAMÉ',
    stall: 'B-214 Cocovico', agent: 'K. ADOU', psp: 'ORANGE MONEY',
    amount: 15_000, tresorRef: 'TR-2026-18047', tresorDate: '14/04 à 22h05',
  },
}

export function formatFcfa(n: number): string {
  return n.toLocaleString('fr-CI').replace(/ /g, ' ') + ' FCFA'
}

export function formatAmount(n: number): string {
  return n.toLocaleString('fr-CI').replace(/ /g, ' ')
}

export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}
