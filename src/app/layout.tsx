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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Read Meter - Smart Electricity Meter & Unit Consumption Tracker',
    template: '%s | Read Meter',
  },
  description:
    'Read Meter is the smart electricity monitoring platform. Track your power meter units in real-time, scan dials with AI OCR camera scanner, calculate sub-meter billing, avoid peak slab penalties, and receive Web Push reminders.',
  keywords: [
    'Read Meter',
    'read meter online',
    'electricity meter reader',
    'smart meter tracker',
    'electric unit calculator',
    'sub meter billing calculator',
    'tenant electricity meter app',
    'meter reading OCR scan',
    'AI meter scanner',
    'K-Electric meter tracker',
    'LESCO meter tracker',
    'FESCO meter tracker',
    'IESCO electricity calculator',
    'PESCO sub meter app',
    'electricity bill estimator',
    'electricity unit budget alerts',
    'power consumption tracker',
  ],
  authors: [{ name: 'Read Meter Team', url: siteUrl }],
  creator: 'Read Meter',
  publisher: 'Read Meter',
  applicationName: 'Read Meter',
  category: 'Utilities & Energy Management',
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
    title: 'Read Meter - Smart Electricity Meter & Unit Consumption Tracker',
    description:
      'Monitor your electric meter readings, calculate billing cycle units, avoid peak charge penalties, and get web push reminders with Read Meter.',
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Read Meter - Smart Electricity Meter Tracker Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Read Meter - Smart Electricity Meter & Unit Tracker',
    description:
      'Track electricity unit consumption, scan meter dials with AI OCR, and manage sub-meter billing accurately.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Read Meter',
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
