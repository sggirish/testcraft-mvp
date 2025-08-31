import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GlassToastContainer } from '@/components/ui/glass-toast'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TestCraft - Visual Test Automation',
  description: 'Build automated tests without writing code',
  keywords: 'test automation, no-code testing, visual testing, web testing',
  authors: [{ name: 'TestCraft Team' }],
  openGraph: {
    title: 'TestCraft - Visual Test Automation',
    description: 'Build automated tests without writing code',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}