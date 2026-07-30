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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volttrack.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VoltTrack - Smart Electricity Meter & Unit Consumption Tracker',
    template: '%s | VoltTrack',
  },
  description:
    'Track your electricity meter unit consumption in real-time with VoltTrack. AI meter photo OCR scanning, sub-meter billing calculations, peak charge alerts, and Web Push notifications for tenants and homeowners.',
  keywords: [
    'electricity meter tracker',
    'smart meter tracker',
    'electric unit calculator',
    'sub meter billing calculator',
    'tenant electricity meter app',
    'K-Electric meter tracker',
    'LESCO meter tracker',
    'FESCO meter tracker',
    'IESCO electricity calculator',
    'PESCO sub meter app',
    'electricity bill estimator',
    'meter reading OCR scan',
    'electricity unit budget alerts',
  ],
  authors: [{ name: 'VoltTrack Team' }],
  creator: 'VoltTrack',
  publisher: 'VoltTrack',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'VoltTrack - Smart Electricity Meter & Unit Consumption Tracker',
    description:
      'Monitor your electric meter readings, calculate billing cycle units, avoid peak charge penalties, and get web push reminders.',
    siteName: 'VoltTrack',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VoltTrack Smart Electricity Meter Tracker Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoltTrack - Smart Electricity Meter & Unit Tracker',
    description:
      'Track electricity unit consumption, sub-meter billing, and receive reading push notifications.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
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
