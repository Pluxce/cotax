'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface AdminShellCtx {
  onMenuToggle: () => void
  onCollapseToggle: () => void
  isTablet: boolean
  collapsed: boolean
}

const Ctx = createContext<AdminShellCtx>({
  onMenuToggle: () => {},
  onCollapseToggle: () => {},
  isTablet: false,
  collapsed: false,
})

export function useAdminShell() {
  return useContext(Ctx)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isTablet } = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const toggle = useCallback(() => setSidebarOpen(v => !v), [])
  const close = useCallback(() => setSidebarOpen(false), [])
  const toggleCollapsed = useCallback(() => setCollapsed(v => !v), [])

  useEffect(() => {
    if (!isTablet) setSidebarOpen(false)
  }, [isTablet])

  useEffect(() => {
    document.body.style.overflow = (isTablet && sidebarOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isTablet, sidebarOpen])

  // Persist collapsed preference
  useEffect(() => {
    const saved = typeof window !== 'undefined' && window.localStorage.getItem('cotax:sidebar:collapsed')
    if (saved === '1') setCollapsed(true)
  }, [])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cotax:sidebar:collapsed', collapsed ? '1' : '0')
    }
  }, [collapsed])

  return (
    <Ctx.Provider value={{ onMenuToggle: toggle, onCollapseToggle: toggleCollapsed, isTablet, collapsed }}>
      <div className="flex min-h-screen">
        {isTablet && sidebarOpen && (
          <div
            onClick={close}
            className="fixed inset-0 z-[39] backdrop-blur-[2px]"
            style={{ background: 'rgba(10,15,21,0.55)', animation: 'fadeIn 200ms ease' }}
          />
        )}

        <Sidebar
          open={!isTablet || sidebarOpen}
          onClose={close}
          isDrawer={isTablet}
          collapsed={!isTablet && collapsed}
          onToggleCollapsed={toggleCollapsed}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          {children}
        </div>
      </div>
    </Ctx.Provider>
  )
}
