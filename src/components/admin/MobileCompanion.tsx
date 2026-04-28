'use client'

import { IcoHome, IcoCoins, IcoUsers, IcoChart, IcoLandmark } from '@/components/ui/Icons'

interface MobileCompanionProps {
  showAmounts?: boolean
}

export function MobileCompanion({ showAmounts = true }: MobileCompanionProps) {
  const mask = (n: string) => showAmounts ? n : '• • •'

  return (
    <div className="w-[320px] bg-paper-50 rounded-[28px] border-8 border-ink-950 overflow-hidden">
      {/* Header */}
      <div className="bg-lagune-900 text-white p-[14px_18px_20px] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-8 pointer-events-none"
          style={{
            backgroundImage: "url('/assets/pattern-kita.svg')",
            backgroundSize: '160px',
            filter: 'brightness(0) invert(1)'
          }}
        />
        <div className="flex items-center gap-2.5 relative">
          <img src="/assets/logo-cocody.png" className="w-7 h-7" alt="Cocody" />
          <div className="text-[12px] font-semibold tracking-[0.02em]">Cocody · Recettes</div>
          <div className="ml-auto text-[11px] opacity-70">14 avr.</div>
        </div>
        <div className="mt-3.5 relative">
          <div className="text-[10px] tracking-[0.08em] uppercase opacity-65 font-semibold">Recettes du jour</div>
          <div className="font-[family-name:var(--font-display)] text-[30px] font-semibold tracking-[-0.02em] mt-1 tabular-nums">
            {mask('2 430 000')}<span className="text-[11px] ml-1.5 opacity-65">FCFA</span>
          </div>
          <div className="text-[11px] mt-1 opacity-75">+12,4 % vs hier · 69 % du marché</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-[14px_14px_80px]">
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="bg-paper-0 border border-ink-100 rounded-[12px] p-[10px_12px]">
            <div className="text-[10px] tracking-[0.08em] uppercase text-ink-500 font-semibold">Payés</div>
            <div className="font-[family-name:var(--font-display)] text-[22px] font-semibold text-ink-900">
              {mask('284')}<span className="text-[10px] text-ink-500 ml-1">/412</span>
            </div>
          </div>
          <div className="bg-paper-0 border border-ink-100 rounded-[12px] p-[10px_12px]">
            <div className="text-[10px] tracking-[0.08em] uppercase text-ink-500 font-semibold">Retard</div>
            <div className="font-[family-name:var(--font-display)] text-[22px] font-semibold text-terra-700">47</div>
          </div>
        </div>

        <div className="bg-paper-0 border border-ink-100 rounded-[12px] p-[12px_14px] mb-2.5">
          <div className="flex justify-between items-center mb-2.5">
            <div className="text-[13px] font-semibold">Top agents</div>
            <span className="text-[10px] text-ink-500">Aujourd'hui</span>
          </div>
          {[
            ['K. Adou', '485 000', 1],
            ['A. Bamba', '412 500', 2],
            ['Y. Koffi', '356 000', 3],
          ].map(([n, v, r]) => (
            <div key={n} className={`flex items-center gap-2.5 py-1.5 ${(r as number) > 1 ? 'border-t border-ink-100' : ''}`}>
              <div className="w-[22px] h-[22px] rounded-full bg-lagune-100 text-lagune-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                {r}
              </div>
              <div className="flex-1 text-[13px] font-medium">{n}</div>
              <div className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tabular-nums">
                {showAmounts ? v : '• • •'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-tresor-100 text-tresor-700 p-[10px_12px] rounded-[10px] text-[12px] flex items-center gap-2 border-l-3 border-tresor-500">
          <IcoLandmark size={16} />
          <span><b>Trésor · OK.</b> Dernier rapprochement hier 22h.</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="relative mt-[-70px] flex bg-paper-0 border-t border-ink-200 p-[10px_0_16px]">
        {[
          { i: <IcoHome size={18} />, l: 'Accueil', a: true },
          { i: <IcoCoins size={18} />, l: 'Recettes' },
          { i: <IcoUsers size={18} />, l: 'Agents' },
          { i: <IcoChart size={18} />, l: 'Rapports' },
        ].map((t, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5" style={{ color: t.a ? 'var(--lagune-700)' : 'var(--fg-3)' }}>
            {t.i}
            <span className="text-[10px]" style={{ fontWeight: t.a ? 600 : 500 }}>{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
