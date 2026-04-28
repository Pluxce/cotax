import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'CoTax Cocody',
  description: 'Plateforme de digitalisation de la collecte fiscale - Commune de Cocody',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={
          {
            '--font-display': '"Fraunces", Georgia, serif',
            '--font-ui': '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
            '--font-mono': '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
          } as CSSProperties
        }
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
