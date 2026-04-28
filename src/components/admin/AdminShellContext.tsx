'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface AdminShellCtx {
  onMenuToggle: () => void
  isTablet: boolean
}

const Ctx = createContext<AdminShellCtx>({ onMenuToggle: () => {}, isTablet: false })

export function useAdminShell() {
  return useContext(Ctx)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isTablet } = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggle = useCallback(() => setSidebarOpen(v => !v), [])
  const close  = useCallback(() => setSidebarOpen(false),   [])

  // Close drawer when switching back to desktop
  useEffect(() => {
    if (!isTablet) setSidebarOpen(false)
  }, [isTablet])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = (isTablet && sidebarOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isTablet, sidebarOpen])

  return (
    <Ctx.Provider value={{ onMenuToggle: toggle, isTablet }}>
      <div className="flex min-h-screen">
        {/* Overlay — tablet/mobile only, when drawer is open */}
        {isTablet && sidebarOpen && (
          <div
            onClick={close}
            className="fixed inset-0 z-[39] backdrop-blur-[2px]"
            style={{ background: 'rgba(10,15,21,0.55)', animation: 'fadeIn 200ms ease' }}
          />
        )}

        <Sidebar open={!isTablet || sidebarOpen} onClose={close} isDrawer={isTablet} />

        <div className="flex-1 min-w-0 flex flex-col">
          {children}
        </div>
      </div>
    </Ctx.Provider>
  )
}
