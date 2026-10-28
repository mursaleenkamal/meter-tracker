import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../toolsHub.module.css'
import WaterMeterScanner from './WaterMeterScanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Compass, Droplets, ArrowLeft } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Free Smart Water Meter Scanner & Leak Detector | Gallons, m³ & CCF OCR',
  description:
    'Scan mechanical water meter registers and sweep hands with your phone camera. Built-in low-flow leak detection indicator test spots continuous toilet and pipe leaks instantly.',
  keywords: [
    'online water meter scanner',
    'how to read water meter dials',
    'read water meter photo leak test',
    'water meter reading app free',
    'low flow leak detector water meter',
    'scan water meter gallons ccf m3',
    'residential water meter ocr',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/read-water-meter`,
  },
  openGraph: {
    title: 'Free Smart Water Meter Scanner & Leak Detector | Read Meter',
    description:
      'Point your camera at any residential water meter to decode registers, sweep hands, and test for household leaks.',
    url: `${siteUrl}/tools/read-water-meter`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Water Meter Scanner & Leak Detector Read Meter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Water Meter Scanner & Leak Detector (Gal / m³ / L)',
    description:
      'Scan water registers and test for hidden pipe leaks directly in your browser. 100% private client OCR.',
    images: ['/og-image.png'],
  },
}

export default function WaterMeterScannerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/read-water-meter#app`,
        name: 'Smart Water Meter Scanner & Leak Detector',
        url: `${siteUrl}/tools/read-water-meter`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Browser-based AI camera tool that extracts water meter register digits and performs low-flow leak tests without app installs.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/read-water-meter#howto`,
        name: 'How to Read a Water Meter and Check for Household Leaks',
        description:
          'Step-by-step procedure to read residential water meters in Gallons, Cubic Meters, or CCF and perform a leak check.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Record the Odometer Register',
            text: 'Read the cumulative whole units displayed on the odometer counter wheels from left to right.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Check the Large Sweep Hand',
            text: 'Note the single-digit position of the large sweep hand to capture fractional unit flow.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Perform the Leak Indicator Test',
            text: 'Turn off all water taps in the home and watch the small red or blue triangle star. If it moves, a leak is present.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/read-water-meter#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does the small spinning star or triangle mean on a water meter?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It is a low-flow leak indicator that spins with even tiny water drips, making it easy to identify running toilets or hidden underground leaks.',
            },
          },
          {
            '@type': 'Question',
            name: 'What units do water meters use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In the United States, water meters typically measure in Gallons or CCF (Hundred Cubic Feet = 748 Gallons). In Europe, UK, and Asia, they measure in Cubic Meters (m³) or Liters.',
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
        <WaterMeterScanner />
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
