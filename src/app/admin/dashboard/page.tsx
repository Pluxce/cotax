import { TopBar } from '@/components/admin/TopBar'
import { KpiGrid } from '@/components/admin/KpiGrid'
import { RecettesChart } from '@/components/admin/RecettesChart'
import { PSPDonut } from '@/components/admin/PSPDonut'
import { AgentsTable } from '@/components/admin/AgentsTable'
import { RecentPayments } from '@/components/admin/RecentPayments'
import { MobileCompanion } from '@/components/admin/MobileCompanion'
import { IcoDownload, IcoCheck, IcoRefresh, IcoWifiOff } from '@/components/ui/Icons'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <TopBar title="Vue d'ensemble" period="14 avril 2026" />

      <div className="flex-1 px-7 py-6 max-w-[1280px] w-full mx-auto">
        <div className="page-header">
          <div>
            <h1 className="page-title">Bonjour, Monsieur le Maire</h1>
            <div className="page-subtitle">
              Activité temps réel · Marché Cocovico (phase pilote)
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost">
              <IcoDownload size={16} />
              Exporter
            </Button>
            <Button variant="primary">
              <IcoCheck size={16} />
              Valider la journée
            </Button>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="status-banner status-banner-warning mb-5">
          <IcoWifiOff size={18} className="shrink-0" />
          <span className="min-w-0">
            <b>Mode hors-ligne — 2 agents.</b> 6 paiements en attente de synchronisation.
          </span>
          <a
            href="#"
            className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 text-inherit no-underline transition-colors duration-150"
          >
            Forcer la synchro <IcoRefresh size={14} />
          </a>
        </div>

        <KpiGrid showAmounts={true} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
          <RecettesChart showAmounts={true} />
          <PSPDonut showAmounts={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          <AgentsTable showAmounts={true} />
          <RecentPayments showAmounts={true} />
        </div>

        {/* Mobile Companion Preview */}
        <div className="bg-ink-950 p-10 flex justify-center gap-10 mb-[-24px] -mx-7 -mb-6" style={{
          backgroundImage: "url('/assets/pattern-kita.svg')",
          backgroundSize: '220px',
          backgroundBlendMode: 'overlay'
        }}>
          <div className="max-w-[280px] pt-8">
            <div className="text-[11px] tracking-[0.08em] uppercase text-ocre-300 font-semibold mb-2.5">Vue mobile</div>
            <h3 className="font-[family-name:var(--font-display)] text-[26px] font-semibold text-white mb-2.5 leading-[1.1]">
              Pilotage en déplacement
            </h3>
            <p className="text-[14px] leading-[1.55] text-white/78">
              Le même tableau de bord, consulté depuis le smartphone du Maire. Les KPIs essentiels, les top agents et l'état de la réconciliation Trésor, en un coup d'œil.
            </p>
          </div>
          <MobileCompanion showAmounts={true} />
        </div>
      </div>
    </main>
  )
}
