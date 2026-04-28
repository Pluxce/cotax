'use client'
import { useEffect, useState } from 'react'

export interface Breakpoint {
  /** ≤ 1024 px */
  isTablet: boolean
  /** ≤ 640 px */
  isMobile: boolean
}

function getViewport(): Breakpoint {
  const w = Math.min(
    window.innerWidth,
    document.documentElement?.clientWidth ?? window.innerWidth,
    window.visualViewport?.width ?? window.innerWidth,
  )
  return {
    isMobile: w <= 640,
    isTablet: w <= 1024,
  }
}

export function useBreakpoint(): Breakpoint {
  // ⚠️ IMPORTANT : toujours initialiser avec false/false
  // Le premier rendu doit correspondre au rendu serveur (SSR = pas de window).
  // useEffect met à jour après hydratation — pas de mismatch React.
  const [bp, setBp] = useState<Breakpoint>({ isMobile: false, isTablet: false })

  useEffect(() => {
    function update() {
      setBp(getViewport())
    }
    // Correction immédiate après hydratation
    update()
    window.addEventListener('resize', update, { passive: true })
    window.visualViewport?.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [])

  return bp
}
