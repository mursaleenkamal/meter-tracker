import type { Metadata } from 'next'
import LpgCylinderCalculator from './LpgCylinderCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'LPG Gas Cylinder Days & Consumption Calculator 2026 | Read Meter',
  description:
    'Calculate how many days an 11.8 kg domestic or 45.4 kg commercial LPG cylinder will last based on stove burners and geyser usage in Pakistan.',
  keywords: [
    'lpg cylinder duration calculator pakistan',
    'how many days 11.8 kg lpg cylinder last',
    'lpg cylinder gas consumption per hour',
    'domestic lpg cylinder price calculation',
    'gas geyser lpg consumption',
    'lpg cylinder refill date calculator',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/lpg-cylinder-calculator`,
  },
  openGraph: {
    title: 'LPG Cylinder Days & Consumption Calculator | Read Meter',
    description:
      'Forecast how many days your gas cylinder will last and pinpoint your next refill date.',
    url: `${siteUrl}/tools/lpg-cylinder-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LPG Gas Cylinder Duration Calculator',
      },
    ],
    type: 'website',
  },
}

export default function LpgCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LPG Gas Cylinder Days & Consumption Calculator',
    url: `${siteUrl}/tools/lpg-cylinder-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Programmatic gas fuel consumption estimator to predict days remaining, burn rates, and refill dates for LPG cylinders.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LpgCylinderCalculator />
    </>
  )
}
