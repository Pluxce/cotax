'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IcoHome, IcoCoins, IcoUsers, IcoPin, IcoLandmark, IcoChart, IcoStore,
} from '@/components/ui/Icons'
import { ChevronsLeft, ChevronsRight, X, FileText } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
  isDrawer?: boolean
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  href: string
  section: 'pilotage' | 'conformite'
  count?: number
}

const navItems: NavItem[] = [
  { id: 'dashboard',     label: "Vue d'ensemble", icon: IcoHome,     href: '/admin/dashboard',     section: 'pilotage' },
  { id: 'recettes',      label: 'Recettes',       icon: IcoCoins,    href: '/admin/recettes',      section: 'pilotage' },
  { id: 'contribuables', label: 'Contribuables',  icon: IcoStore,    href: '/admin/contribuables', section: 'pilotage', count: 412 },
  { id: 'agents',        label: 'Agents',         icon: IcoUsers,    href: '/admin/agents',        section: 'pilotage', count: 18 },
  { id: 'marches',       label: 'Marchés',        icon: IcoPin,      href: '/admin/marches',       section: 'pilotage' },
  { id: 'recouvrement',  label: 'Recouvrement',   icon: FileText,    href: '/admin/recouvrement',  section: 'conformite' },
  { id: 'tresor',        label: 'Trésor Public',  icon: IcoLandmark, href: '/admin/tresor',        section: 'conformite' },
  { id: 'rapports',      label: 'Rapports',       icon: IcoChart,    href: '/admin/rapports',      section: 'conformite' },
]

function isActiveHref(pathname: string, href: string) {
  if (pathname === href) return true
  // /admin → match dashboard
  if (href === '/admin/dashboard' && (pathname === '/admin' || pathname === '/admin/')) return true
  return pathname.startsWith(href + '/')
}

export function Sidebar({
  open = true,
  onClose,
  isDrawer = false,
  collapsed = false,
  onToggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname() || ''
  if (!open) return null

  const renderItem = (item: NavItem) => {
    const active = isActiveHref(pathname, item.href)
    const Icon = item.icon
    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => isDrawer && onClose?.()}
        title={collapsed ? item.label : undefined}
        className={[
          'flex items-center rounded-[10px] text-sm font-medium transition-colors duration-150 outline-none',
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-2.5 py-2.5',
          active
            ? 'bg-lagune-100 text-lagune-700 font-semibold'
            : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
        ].join(' ')}
      >
        <Icon size={20} />
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        {!collapsed && item.count != null && (
          <span
            className={[
              'text-[11px] font-semibold px-[7px] py-px rounded-full tabular-nums',
              active ? 'bg-paper-0 text-lagune-700' : 'bg-ink-50 text-ink-500',
            ].join(' ')}
          >
            {item.count}
          </span>
        )}
      </Link>
    )
  }

  const pilotage   = navItems.filter(n => n.section === 'pilotage')
  const conformite = navItems.filter(n => n.section === 'conformite')

  const content = (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Brand */}
      <div className={[
        'flex items-center pb-6',
        collapsed ? 'justify-center px-0' : 'gap-2.5 px-2',
      ].join(' ')}>
        <img src="/assets/logo-cocody.png" alt="Cocody" className="w-9 h-9 shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-[family-name:var(--font-display)] font-semibold text-[15px] leading-[1.1] text-ink-900 tracking-[-0.01em]">
              Cocody
            </div>
            <div className="text-[11px] text-ink-500 font-semibold tracking-[0.08em] uppercase">
              Recettes
            </div>
          </div>
        )}
        {isDrawer && (
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="ml-auto w-8 h-8 inline-flex items-center justify-center rounded-md text-ink-700 hover:bg-ink-50"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Pilotage */}
      {!collapsed && (
        <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold px-2.5 pt-2 pb-2">
          Pilotage
        </div>
      )}
      <nav className="flex flex-col gap-1">
        {pilotage.map(renderItem)}
      </nav>

      {/* Conformité */}
      {!collapsed && (
        <div className="text-[11px] tracking-[0.08em] uppercase text-ink-500 font-semibold px-2.5 pt-4 pb-2">
          Conformité
        </div>
      )}
      {collapsed && <div className="my-2 mx-auto h-px w-6 bg-ink-200" />}
      <nav className="flex flex-col gap-1">
        {conformite.map(renderItem)}
      </nav>

      {/* Footer: collapse toggle + user */}
      <div className="mt-auto pt-3 border-t border-ink-200">
        {!isDrawer && (
          <button
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
            className={[
              'mb-2 inline-flex items-center gap-2 rounded-[10px] text-[12px] font-semibold text-ink-500 hover:bg-ink-50 hover:text-ink-900 transition-colors duration-150',
              collapsed ? 'justify-center w-full py-2' : 'px-2.5 py-2 w-full',
            ].join(' ')}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            {!collapsed && <span>Réduire</span>}
          </button>
        )}

        <div className={[
          'flex items-center pt-2 border-t border-ink-100',
          collapsed ? 'justify-center px-0' : 'gap-2.5 px-2',
        ].join(' ')}>
          <Avatar name="Kouassi Aka" bg="var(--forest-600)" style={{ width: 36, height: 36, fontSize: 13 }} />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-900 truncate">Kouassi Aka</div>
              <div className="text-[11px] text-ink-500">Maire adjoint</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isDrawer) {
    return (
      <div className="fixed inset-y-0 left-0 z-40 w-[260px] bg-paper-0 border-r border-ink-200 p-3.5 shadow-elev-3">
        {content}
      </div>
    )
  }

  return (
    <aside
      className={[
        'shrink-0 bg-paper-0 border-r border-ink-200 sticky top-0 h-screen transition-[width] duration-220',
        collapsed ? 'w-[72px] p-2' : 'w-[260px] p-3.5',
      ].join(' ')}
      style={{ transitionTimingFunction: 'var(--ease-standard)' }}
    >
      {content}
    </aside>
  )
}
