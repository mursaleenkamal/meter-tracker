import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../toolsHub.module.css'
import AnalogDialMeterScanner from './AnalogDialMeterScanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Compass, Sparkles, ArrowLeft } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Free Analog Electric Meter Reader | Online Clock Dial OCR Scanner (kWh)',
  description:
    'Decode rotating clock dials on analog electric meters with phone camera OCR. Automatic clockwise and counter-clockwise neighbor-dial rounding rules prevent 1000 kWh errors.',
  keywords: [
    'read analog electric meter online',
    'free analog electric meter reader',
    'decode electric meter dials from photo',
    '5 dial electric meter reader online',
    'analog meter neighbor dial rule calculator',
    'clock dial electricity meter reading app',
    'how to read dial electric meter kwh',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/read-analog-dial-meter`,
  },
  openGraph: {
    title: 'Free Analog Electric Meter Reader | Online Clock Dial Scanner',
    description:
      'Point your camera or drop a photo to decode rotating dials with neighbor-dial rounding rules.',
    url: `${siteUrl}/tools/read-analog-dial-meter`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Analog Dial Electric Meter Reader Read Meter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Analog Dial Electric Meter Scanner (kWh)',
    description:
      'Extract exact kilowatt-hours from 4 and 5-dial analog electric meters in your browser. 100% private client OCR.',
    images: ['/og-image.png'],
  },
}

export default function AnalogDialMeterScannerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/read-analog-dial-meter#app`,
        name: 'Free Analog Electric Meter Reader (Clock Dials)',
        url: `${siteUrl}/tools/read-analog-dial-meter`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Browser-based AI camera tool that decodes rotating clock-face dials on analog electric meters using client-side AI.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/read-analog-dial-meter#howto`,
        name: 'How to Read an Analog Dial Electric Meter Accurately',
        description:
          'Step-by-step procedure to read 4 and 5 dial analog utility electric meters without errors.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Read Left to Right',
            text: 'Begin with the 10,000s dial on the far left and progress through 1,000s, 100s, 10s down to the 1s unit dial on the right.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Observe Dial Rotation Direction',
            text: 'Notice that alternating dials rotate clockwise (0-1-2...9) and counter-clockwise (0-9-8...1).',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Record the Lower Number',
            text: 'When a pointer rests between two numbers, always write down the smaller number.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Check the Neighbor Dial to the Right',
            text: 'If a pointer looks directly on a number, verify if the dial to the right has crossed zero. If not, record the lower digit.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/read-analog-dial-meter#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Why do adjacent dials rotate in opposite directions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mechanical dial meters use a gear train where each adjacent gear meshes directly with the next, turning it in the reverse direction.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the Neighbor Dial Rule on electric meters?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'When a pointer is right on a number, check the dial to the right. If the right dial has not yet passed 0, the current hand has not reached the number yet; record the lower number.',
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
        <AnalogDialMeterScanner />
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
