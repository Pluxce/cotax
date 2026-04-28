import Link from 'next/link'
import { CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react'
import { RECEIPT_PUBLIC, formatAmount } from '@/lib/mock-data'

export default async function VerifPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const receipt = RECEIPT_PUBLIC[id]

  if (!receipt) {
    return (
      <main className="min-h-screen bg-paper-50 px-4 py-16">
        <div className="mx-auto max-w-[460px] text-center">
          <div className="section-card px-6 py-12 shadow-elev-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-terra-100 text-terra-700 shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h1 className="t-h1 mt-6 font-display">Reçu introuvable</h1>
            <p className="mt-4 t-body text-ink-500 max-w-[320px] mx-auto">
              Le reçu n° <b>{id}</b> n&apos;existe pas ou n&apos;est pas encore enregistré au Trésor.
            </p>
            <div className="mt-8 pt-8 border-t border-ink-100">
              <Link
                href="/portail"
                className="inline-flex items-center gap-2 text-sm font-bold text-lagune-700 hover:text-lagune-900 transition-colors"
              >
                <ChevronLeft size={18} />
                Retour au portail
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[520px]">
        <Link
          href="/portail"
          className="mb-6 inline-flex items-center gap-2 text-[13px] font-bold text-ink-500 hover:text-ink-900 transition-colors no-underline"
        >
          <ChevronLeft size={16} />
          VÉRIFICATION PUBLIQUE
        </Link>

        <section className="hero-surface px-6 py-8 sm:px-8 rounded-t-[32px] shadow-lg">
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner">
              <ShieldCheck size={26} />
            </div>
            <div className="min-w-0">
              <p className="t-micro text-white/60 font-bold uppercase tracking-[0.15em] mb-1">
                Authentification CoTax
              </p>
              <h1 className="font-display text-[28px] font-bold text-white leading-tight">
                Reçu n° {receipt.num}
              </h1>
              <p className="mt-2 text-[14px] text-white/80 leading-relaxed">
                Émis par la <b>Mairie de Cocody</b> et certifié par le <b>Trésor Public</b>.
              </p>
            </div>
          </div>
        </section>

        <section className="section-card px-5 py-6 sm:px-8 rounded-t-none rounded-b-[32px] shadow-elev-2 -mt-1 border-t-0">
          <div className="flex items-start gap-4 rounded-2xl bg-forest-50 border border-forest-100 px-5 py-4 text-forest-900 shadow-sm">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-600 text-white shadow-sm">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-[15px] font-bold">Document authentique</p>
              <p className="mt-1 text-[12px] leading-relaxed text-forest-800 font-medium">
                Ce paiement a été rapproché et validé. Il constitue une preuve légale de libération de taxe municipale.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="t-micro text-ink-400 font-bold uppercase tracking-widest mb-4">Détails de la transaction</div>
            <div className="space-y-1 rounded-2xl border border-ink-100 bg-paper-50/50 p-2">
              {[
                ['Date & Heure', receipt.date],
                ['Contribuable', receipt.contribuable],
                ['Emplacement', receipt.stall],
                ['Agent collecteur', receipt.agent],
                ['Moyen de paiement', receipt.psp],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-3 px-3 border-b border-ink-100/50 last:border-0"
                >
                  <span className="text-[13px] text-ink-500 font-medium uppercase tracking-wider">{label}</span>
                  <span className="text-right text-[13px] font-bold text-ink-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-10 text-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-ink-100 -z-10" />
            <div className="inline-block bg-white px-6">
              <div className="t-display-xl !text-5xl text-ink-900 mb-1">
                {formatAmount(receipt.amount)}
                <span className="ml-3 t-body !text-sm font-bold text-ink-400 uppercase tracking-widest">fcfa</span>
              </div>
              <p className="t-micro text-ink-400 font-bold uppercase tracking-[0.15em]">
                TAXE JOURNALIÈRE · AVRIL 2026
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-tresor-50 border border-tresor-100 px-5 py-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white p-1 rounded-lg shadow-sm">
                <img src="/assets/tampon-tresor.svg" alt="Trésor Public" className="h-12 w-12 shrink-0" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-tresor-600 uppercase tracking-widest mb-1">Rapprochement Bancaire</div>
                <div className="text-[13px] leading-tight text-tresor-900 font-bold">
                  Trésor Public de Côte d&apos;Ivoire
                </div>
                <div className="text-[11px] text-tresor-700 mt-1 font-mono">
                  REF: {receipt.tresorRef} · {receipt.tresorDate}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-100 text-center">
            <p className="font-mono text-[11px] text-ink-400 uppercase tracking-widest">
              Généré par CoTax · cocody.ci/v/{id}
            </p>
          </div>
        </section>
        
        <div className="mt-8 text-center">
          <Link 
            href="/portail" 
            className="text-[13px] font-bold text-ink-400 hover:text-ink-900 transition-colors uppercase tracking-widest"
          >
            Accéder au portail fiscal
          </Link>
        </div>
      </div>
    </main>
  )
}
