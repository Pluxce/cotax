'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LayoutDashboard, Coins, Users, MapPin, Landmark, BarChart3, Store, BellRing } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Pilotage',
    items: [
      { href: '/admin/dashboard',     label: "Vue d'ensemble", Icon: LayoutDashboard },
      { href: '/admin/recettes',      label: 'Recettes',       Icon: Coins },
      { href: '/admin/agents',        label: 'Agents',         Icon: Users, count: 18 },
      { href: '/admin/marches',       label: 'Marchés',        Icon: MapPin },
    ],
  },
  {
    label: 'Conformité',
    items: [
      { href: '/admin/tresor',        label: 'Trésor Public',  Icon: Landmark },
      { href: '/admin/rapports',      label: 'Rapports',       Icon: BarChart3 },
      { href: '/admin/recouvrement',  label: 'Recouvrement',   Icon: BellRing, count: 782 },
    ],
  },
  {
    label: 'Back-office',
    items: [
      { href: '/admin/contribuables', label: 'Contribuables',  Icon: Store, count: 412 },
    ],
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  isDrawer: boolean
}

export function Sidebar({ open, onClose, isDrawer }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="h-screen bg-[var(--paper-0)] border-r border-[var(--border)] py-5 px-3.5 flex flex-col gap-1 overflow-y-auto"
      style={{
        position: isDrawer ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: isDrawer ? 40 : 'auto' as never,
        width: isDrawer ? 'min(88vw, 260px)' : 260,
        flexShrink: 0,
        transform: isDrawer ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: isDrawer ? 'transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1)' : 'none',
        boxShadow: isDrawer && open ? '4px 0 24px rgba(10,15,21,0.18)' : 'none',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-cocody.png" alt="Cocody" className="w-[38px] h-[38px]" />
        <div className="flex-1">
          <div className="font-[family-name:var(--font-display)] font-semibold text-base tracking-[-0.01em] text-[var(--fg-1)]">
            CoTax
          </div>
          <div className="text-[11px] text-[var(--fg-3)] font-medium tracking-[0.04em] uppercase">
            Cocody
          </div>
        </div>
        {isDrawer && (
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="w-8 h-8 rounded-lg border-none bg-[var(--bg-sunken)] text-[var(--fg-2)] cursor-pointer flex items-center justify-center shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {NAV_GROUPS.map(group => (
        <React.Fragment key={group.label}>
          <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--fg-3)] font-semibold px-2.5 pt-4 pb-2">
            {group.label}
          </div>
          {group.items.map(({ href, label, Icon, count }) => {
            const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={isDrawer ? onClose : undefined}
                className="flex items-center gap-3 py-[9px] px-2.5 rounded-[10px] text-sm no-underline transition-all duration-[150ms]"
                style={{
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--lagune-700)' : 'var(--fg-2)',
                  background: active ? 'var(--lagune-100)' : 'transparent',
                }}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span className="flex-1">{label}</span>
                {count !== undefined && (
                  <span
                    className="text-[11px] font-semibold py-px px-[7px] rounded-[999px] tabular-nums"
                    style={{
                      background: active ? 'var(--paper-0)' : 'var(--bg-sunken)',
                      color: active ? 'var(--lagune-700)' : 'var(--fg-3)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </React.Fragment>
      ))}

      {/* User */}
      <div className="mt-auto pt-4 pb-px border-t border-[var(--border)] flex items-center gap-2.5 px-2.5">
        <div className="w-9 h-9 rounded-full bg-forest-600 text-white flex items-center justify-center font-semibold text-[13px] shrink-0">
          KA
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[var(--fg-1)] whitespace-nowrap overflow-hidden text-ellipsis">
            Kouassi Aka
          </div>
          <div className="text-[11px] text-[var(--fg-3)]">Maire adjoint</div>
        </div>
      </div>
    </aside>
  )
}
