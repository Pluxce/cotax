import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CoTax · Portail fiscal — Cocody',
}

export default function PortailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-50 text-ink-900">
      {children}
    </div>
  )
}
