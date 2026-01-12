import { Toaster } from '@/components/ui/Toaster'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Frontend Middleware',
  description: 'SQL to Cypher Translator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
