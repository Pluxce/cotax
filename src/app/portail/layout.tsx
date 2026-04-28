import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CoTax · Portail fiscal — Cocody',
}

export default function PortailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-50)' }}>
      {children}
    </div>
  )
}
