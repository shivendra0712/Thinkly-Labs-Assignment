import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ORION — Your Space Guide',
  description: 'Explore the cosmos with ORION, your AI guide to space and astronomy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
