import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import NetworkSyncBar from '@/components/NetworkSyncBar'
import AppPreloader from '@/components/AppPreloader'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'VoltTrack - Smart Electric Meter Unit Tracker',
  description:
    'VoltTrack is a secure, premium dashboard for tracking your electric meter unit usage. Upload meter photos for automated OCR scans, input manual readings, and set maximum unit limits with warning alerts.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <AppPreloader />
        {children}
        <NetworkSyncBar />
        <SpeedInsights />
      </body>
    </html>
  )
}

