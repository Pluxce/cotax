import Link from 'next/link'
import { LayoutDashboard, Smartphone, ShieldCheck } from 'lucide-react'

const ROLES = [
  {
    href: '/admin/dashboard',
    label: 'Mairie et administration',
    sub: 'Tableau de bord, agents, tresor et rapports',
    Icon: LayoutDashboard,
    bg: 'bg-lagune-500',
    roles: ['Maire', 'Adjoint', 'Regisseur', 'Directeur de recette'],
  },
  {
    href: '/portail',
    label: 'Portail commercant',
    sub: 'Taxes, recus et paiement mobile',
    Icon: Smartphone,
    bg: 'bg-forest-600',
    roles: ['Commercant', 'Assujetti'],
  },
  {
    href: '/v/1847',
    label: 'Verification de recu',
    sub: "Controle public d'authenticite d'un recu",
    Icon: ShieldCheck,
    bg: 'bg-tresor-500',
    roles: ['Public', 'Controleur'],
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink-900 text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1160px] flex-col justify-center">
        <section className="bg-gradient-to-br from-lagune-900 to-lagune-700 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 rounded-2xl">
          <div className="relative z-[1] flex flex-wrap items-center gap-4">
            <img
              src="/assets/logo-cocody.png"
              alt="Logo Cocody"
              className="h-16 w-16 rounded-2xl bg-white p-1.5"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ocre-500">
                Commune de Cocody
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
                CoTax Cocody
              </h1>
              <p className="mt-3 max-w-[680px] text-sm leading-6 text-white/75 sm:text-[15px]">
                Point d&apos;entree unique pour le pilotage fiscal municipal, le portail contribuable et la verification des recus.
              </p>
            </div>
          </div>

          <div className="relative z-[1] mt-8 flex flex-wrap items-center gap-3 text-[12px] text-white/65">
            <img src="/assets/drapeau-ci.svg" alt="Drapeau CI" className="h-5 w-auto rounded-sm" />
            <span>Exercice 2026</span>
            <span className="hidden sm:inline">Deliberation Ndeg 2025-172/CC/CM/SG</span>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {ROLES.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="flex min-h-[240px] flex-col rounded-2xl border border-white/10 bg-white/6 p-6 no-underline transition-transform hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role.bg}`}>
                <role.Icon size={22} strokeWidth={1.6} className="text-white" />
              </div>
              <h2 className="mt-5 font-display text-[1.35rem] font-semibold text-white">
                {role.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{role.sub}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {role.roles.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/70"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>

        <p className="mt-6 text-center text-[12px] text-white/35">
          Commune de Cocody · Plateforme de digitalisation fiscale
        </p>
      </div>
    </main>
  )
}
