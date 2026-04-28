import Link from 'next/link'
import { CheckCircle2, ChevronLeft, ChevronRight, TriangleAlert } from 'lucide-react'
import { formatAmount } from '@/lib/mock-data'

const RECUS = [
  { date: '14 avril 2026', num: '2026-04-1847', psp: 'Orange Money', amount: 15000, status: 'ok' },
  { date: '13 avril 2026', num: '2026-04-1723', psp: 'Wave', amount: 15000, status: 'ok' },
  { date: '12 avril 2026', num: '2026-04-1612', psp: 'MTN Money', amount: 15000, status: 'ok' },
  { date: '11 avril 2026', num: '-', psp: '-', amount: 0, status: 'miss' },
  { date: '10 avril 2026', num: '2026-04-1388', psp: 'Orange Money', amount: 15000, status: 'ok' },
  { date: '09 avril 2026', num: '2026-04-1247', psp: 'Orange Money', amount: 15000, status: 'ok' },
  { date: '08 avril 2026', num: '2026-04-1102', psp: 'Wave', amount: 15000, status: 'ok' },
]

export default function RecusPage() {
  return (
    <main className="min-h-screen bg-paper-50">
      <header className="border-b border-ink-200 bg-paper-0 px-4 py-[14px]">
        <div className="mx-auto flex max-w-[560px] items-center gap-[10px]">
          <Link href="/portail" className="flex items-center text-ink-700">
            <ChevronLeft size={22} strokeWidth={1.5} />
          </Link>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-ink-900">Mes recus</div>
            <div className="text-[11px] text-ink-500">Etal B-214 · Adjoua Kouame</div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[560px] px-4 py-6">
        <section className="bg-gradient-to-br from-lagune-900 to-lagune-700 p-6 rounded-2xl  relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("/assets/pattern-kita.svg")', backgroundSize: '200px' }} />
          <div className="relative z-10 grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1.5">Collecte (Avril)</div>
              <div className="text-2xl font-mono font-semibold text-white">
                {formatAmount(90000)} <span className="text-xs text-white/50 font-ui font-medium">F</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1.5">Regularite</div>
              <div className="text-2xl font-mono font-semibold text-forest-200">
                6/7 <span className="text-xs text-white/50 font-ui font-medium">jours</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-ink-400">Historique journalier</h2>
        </div>
        </div>
      </header>

      <div className="mx-auto max-w-[560px] px-4 py-6">
        <section className="hero-surface p-6 rounded-3xl ">
          <div className="relative z-10 grid grid-cols-2 gap-6">
            <div>
              <div className="t-micro text-white/60 font-bold uppercase tracking-widest mb-1.5">Collecte (Avril)</div>
              <div className="t-h2 text-white !text-2xl font-mono">
                {formatAmount(90000)} <span className="text-[12px] text-white/50 font-ui font-medium">F</span>
              </div>
            </div>
            <div>
              <div className="t-micro text-white/60 font-bold uppercase tracking-widest mb-1.5">Régularité</div>
              <div className="t-h2 text-forest-200 !text-2xl font-mono">
                6/7 <span className="text-[12px] text-white/50 font-ui font-medium">jours</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 mb-4">
          <h2 className="t-micro text-ink-400 font-bold uppercase tracking-widest">Historique journalier</h2>
        </div>

        <section className="flex flex-col gap-3">
          {RECUS.map((receipt, index) =>
            receipt.status === 'ok' ? (
              <Link
                key={`${receipt.date}-${index}`}
                href={`/v/${receipt.num.split('-').pop()}`}
                className="section-card flex items-center gap-4 px-4 py-3.5 no-underline hover:border-lagune-300 transition-all  hover:shadow-elev-1 active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
                  <CheckCircle2 size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold text-ink-900 leading-tight mb-0.5">{receipt.date}</div>
                  <div className="truncate text-[11px] text-ink-500 font-mono">
                    N° {receipt.num} · {receipt.psp}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="t-amount text-[14px] font-bold text-ink-900">
                    {formatAmount(receipt.amount)}
                  </span>
                  <ChevronRight size={14} className="text-ink-300" />
                </div>
              </Link>
            ) : (
              <div
                key={`${receipt.date}-${index}`}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-terra-100 bg-terra-50 "
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terra-100 text-terra-700">
                  <TriangleAlert size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-terra-950 leading-tight mb-0.5">{receipt.date}</div>
                  <div className="text-[11px] text-terra-600 font-medium italic">Aucun paiement enregistré</div>
                </div>
                <span className="t-micro bg-terra-600 text-white px-2 py-0.5 rounded-pill font-bold ">
                  Manque
                </span>
              </div>
            ),
          )}
        </section>

        <div className="mt-10 p-5 bg-paper-100 rounded-3xl border border-ink-100 text-center">
          <p className="text-[13px] text-ink-500 leading-relaxed mb-4">
            Besoin d&apos;une attestation fiscale globale pour votre activité ?
          </p>
          <Link 
            href="/portail" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink-900 text-[13px] font-bold rounded-xl border border-ink-200  hover:bg-paper-50 transition-colors"
          >
            Aller sur mon profil
          </Link>
        </div>
      </div>
    </main>
  )
}
