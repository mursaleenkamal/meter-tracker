import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../toolsHub.module.css'
import GasMeterScanner from './GasMeterScanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Compass, Flame, ArrowLeft } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Online Gas Meter Photo Reader (m³ / CCF) | Free Mechanical Roller OCR',
  description:
    'Extract natural gas and LPG meter readings from phone camera photos. Automatic black-drum recognition strips red fractional decimal digits to prevent billing errors.',
  keywords: [
    'read gas meter from photo',
    'online gas meter photo reader',
    'gas meter scanner m3 ccf',
    'natural gas meter ocr free',
    'how to read mechanical gas meter',
    'gas meter red numbers billing rule',
    'read meter gas tools',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/read-gas-meter`,
  },
  openGraph: {
    title: 'Online Gas Meter Photo Reader (m³ / CCF) | Read Meter',
    description:
      'Point your phone camera or drop a photo to extract mechanical gas meter odometer digits. Strips red decimals in seconds.',
    url: `${siteUrl}/tools/read-gas-meter`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gas Meter Scanner Read Meter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Gas Meter Photo Reader (m³ / CCF)',
    description:
      'Extract whole cubic meters and CCF from mechanical gas meters in your browser. 100% private client OCR.',
    images: ['/og-image.png'],
  },
}

export default function GasMeterScannerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/read-gas-meter#app`,
        name: 'Online Gas Meter Photo Reader (m³ / CCF)',
        url: `${siteUrl}/tools/read-gas-meter`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Browser-based AI camera tool that extracts mechanical roller odometer readings from natural gas and LPG meters.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/read-gas-meter#howto`,
        name: 'How to Read a Mechanical Gas Meter Accurately',
        description:
          'Step-by-step procedure to read natural gas and LPG roller odometer registers without mistakes.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Locate White on Black Roller Numbers',
            text: 'Read the white numbers on black background from left to right; these represent whole cubic meters (m³) or CCF.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Ignore Red Fractional Digits',
            text: 'Exclude the numbers in red boxes or to the right of the comma; these measure fractions of a unit.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Avoid Screen Glare',
            text: 'Angle your phone slightly to prevent camera flash reflection on the glass cover.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/read-gas-meter#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Should I include red numbers when submitting a gas meter reading?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Red numbers represent fractional decimal units and are ignored for standard utility billing.',
            },
          },
          {
            '@type': 'Question',
            name: 'What units do gas meters measure?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Gas meters measure volume in cubic meters (m³) across Europe, UK, and Asia, and in Hundred Cubic Feet (CCF) across North America.',
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

      {/* Main Scanner Container */}
      <main style={{ width: '100%', marginTop: '1.5rem' }}>
        <GasMeterScanner />
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
