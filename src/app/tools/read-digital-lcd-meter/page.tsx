import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../toolsHub.module.css'
import DigitalLcdMeterScanner from './DigitalLcdMeterScanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Compass, Sparkles, ArrowLeft } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Instant Digital Meter Scanner (kWh) | Free Online LCD OCR Reader',
  description:
    'Extract exact 7-segment digital electricity meter readings and strip decimals in seconds. Free browser-based AI camera scanner with 100% private client processing.',
  keywords: [
    'scan digital electricity meter kwh',
    'read digital electric meter online',
    'digital meter photo reader',
    'electric meter ocr scanner free',
    '7 segment lcd meter reading online',
    'how to read digital electric meter',
    'read meter tools',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/read-digital-lcd-meter`,
  },
  openGraph: {
    title: 'Instant Digital Meter Scanner (kWh) | Free Browser OCR',
    description:
      'Point your phone camera or upload a photo to decode digital electric meters and strip decimals instantly.',
    url: `${siteUrl}/tools/read-digital-lcd-meter`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Digital Meter Scanner Read Meter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Digital Electric Meter Scanner (kWh)',
    description:
      'Extract whole kilowatt-hours from digital LCD meters in your browser. 100% private client-side OCR.',
    images: ['/og-image.png'],
  },
}

export default function DigitalMeterScannerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/read-digital-lcd-meter#app`,
        name: 'Instant Digital Meter Scanner (kWh)',
        url: `${siteUrl}/tools/read-digital-lcd-meter`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Browser-based AI camera tool that extracts 7-segment digital electricity meter readings without app downloads.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/read-digital-lcd-meter#howto`,
        name: 'How to Scan a Digital Electric Meter using Phone Camera',
        description:
          'Step-by-step procedure to capture digital 7-segment electricity readings accurately.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Wait for the Active kWh Display',
            text: 'Ensure the meter cycles to the active kilowatt-hour (kWh) register denoted by code 01 or 02.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Hold Camera Level',
            text: 'Capture a crisp photo of the numeric LCD display, minimizing glass glare.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Extract and Strip Decimals',
            text: 'The AI scanner reads whole numbers from left to right and automatically excludes fractional tenths.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/read-digital-lcd-meter#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is my meter photo uploaded to any server or cloud database?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. All image preprocessing, canvas downscaling, and neural OCR run 100% client-side directly in your browser using WebAssembly.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I handle reflection or glare on the LCD screen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Angle your phone camera 10-15 degrees to the side or illuminate with indirect ambient light. If glare obscures a digit, use our manual adjustment stepper.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '1rem' }}>
        <Navbar maxWidth="1100px" />
      </div>

      {/* Scanner Interactive Tool Component */}
      <main style={{ width: '100%', marginTop: '1.5rem' }}>
        <DigitalLcdMeterScanner />
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
