'use client'
import React from 'react'
import { Search, Bell, Settings, Calendar, Menu } from 'lucide-react'
import { useAdminShell } from '@/components/admin/AdminShellContext'

interface TopBarProps {
  title: string
  period?: string
}

export function TopBar({ title, period = '14 avril 2026' }: TopBarProps) {
  const { onMenuToggle, isTablet } = useAdminShell()

  return (
    <header className="bg-[var(--paper-0)] border-b border-[var(--border)] h-16 px-4 flex items-center gap-2.5 sticky top-0 z-20">
      {/* Hamburger — tablet/mobile only */}
      {isTablet && (
        <button
          onClick={onMenuToggle}
          aria-label="Ouvrir le menu"
          className="w-[38px] h-[38px] rounded-[10px] border-none bg-transparent text-[var(--fg-2)] cursor-pointer flex items-center justify-center shrink-0"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      )}

      <h1
        className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis m-0"
        style={{
          fontSize: isTablet ? 18 : 22,
          flex: isTablet ? 1 : '0 0 auto',
          minWidth: 0,
        }}
      >
        {title}
      </h1>

      {/* Search bar — desktop only */}
      {!isTablet && (
        <div className="flex-1 max-w-[400px] ml-3 relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-3)]" />
          <input
            placeholder="Rechercher un commerçant, un reçu…"
            className="w-full py-2 pr-3 pl-9 rounded-[10px] border border-[var(--border)] bg-[var(--bg-sunken)] font-[family-name:var(--font-ui)] text-sm text-[var(--fg-1)] outline-none"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-1.5 shrink-0">
        {/* Period — desktop only */}
        {!isTablet && (
          <button className="inline-flex items-center gap-[7px] py-[7px] px-3 rounded-[10px] border border-[var(--border)] bg-transparent text-[var(--fg-2)] cursor-pointer text-[13px] font-[family-name:var(--font-ui)] font-medium whitespace-nowrap">
            <Calendar size={15} strokeWidth={1.5} />{period}
          </button>
        )}

        {/* Bell */}
        <button className="w-9 h-9 rounded-[10px] border-none bg-transparent text-[var(--fg-2)] cursor-pointer flex items-center justify-center relative shrink-0">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-2 right-[9px] w-2 h-2 rounded-full bg-terra-500 border-2 border-[var(--paper-0)]" />
        </button>

        {/* Settings — desktop only */}
        {!isTablet && (
          <button className="w-9 h-9 rounded-[10px] border-none bg-transparent text-[var(--fg-2)] cursor-pointer flex items-center justify-center">
            <Settings size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </header>
  )
}
