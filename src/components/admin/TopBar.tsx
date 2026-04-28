'use client'

import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { IcoSearch, IcoCalendar, IcoBell, IcoSettings } from '@/components/ui/Icons'
import { useAdminShell } from '@/components/admin/AdminShellContext'

interface TopBarProps {
  title: string
  period?: string
}

export function TopBar({ title, period = '14 avril 2026' }: TopBarProps) {
  const { onMenuToggle, onCollapseToggle, isTablet, collapsed } = useAdminShell()

  return (
    <header className="bg-paper-0 border-b border-ink-200 h-[var(--nav-h-desktop)] px-4 lg:px-6 flex items-center gap-3 sticky top-0 z-10">
      {isTablet ? (
        <button
          onClick={onMenuToggle}
          aria-label="Ouvrir le menu"
          className="w-9 h-9 inline-flex items-center justify-center rounded-[10px] text-ink-700 hover:bg-ink-50 transition-colors duration-150"
        >
          <Menu size={20} />
        </button>
      ) : (
        <button
          onClick={onCollapseToggle}
          aria-label={collapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
          className="w-9 h-9 inline-flex items-center justify-center rounded-[10px] text-ink-500 hover:text-ink-900 hover:bg-ink-50 transition-colors duration-150"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      )}

      <h1 className="font-[family-name:var(--font-display)] text-[20px] lg:text-[22px] font-semibold m-0 tracking-[-0.01em] truncate shrink-0 max-w-[40%]">
        {title}
      </h1>

      <div className="flex-1 min-w-0 mx-3 lg:mx-4 relative hidden md:block">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none">
          <IcoSearch size={16} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un contribuable, un reçu, un agent…"
          className="w-full h-10 pl-10 pr-3 rounded-[10px] border border-ink-200 bg-ink-50 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-lagune-500 focus:bg-paper-0 focus:shadow-[0_0_0_2px_var(--paper-0),_0_0_0_4px_var(--lagune-500)] transition-colors duration-150"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 lg:gap-2 shrink-0">
        <button className="hidden sm:inline-flex px-3 py-[7px] rounded-[10px] border-0 bg-transparent text-ink-700 hover:bg-ink-50 items-center gap-2 text-sm font-medium cursor-pointer transition-colors duration-150">
          <IcoCalendar size={16} />
          <span className="hidden md:inline">{period}</span>
        </button>

        <button className="w-9 h-9 rounded-[10px] border-0 bg-transparent text-ink-700 hover:bg-ink-50 inline-flex items-center justify-center cursor-pointer transition-colors duration-150 relative">
          <IcoBell size={18} />
          <span className="absolute top-2 right-[9px] w-2 h-2 rounded-full bg-terra-500 border-2 border-paper-0" />
        </button>

        <button className="w-9 h-9 rounded-[10px] border-0 bg-transparent text-ink-700 hover:bg-ink-50 inline-flex items-center justify-center cursor-pointer transition-colors duration-150">
          <IcoSettings size={18} />
        </button>
      </div>
    </header>
  )
}
