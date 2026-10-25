import type { Metadata } from 'next'
import WaterPumpCostCalculator from './WaterPumpCostCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Water Pump & Motor Electricity Cost Calculator 2026 | Read Meter',
  description:
    'Calculate exact electricity units (kWh) and monthly bill for 0.5 HP, 1 HP, 1.5 HP, and 2 HP water motors and submersible pumps in Pakistan. Estimate overhead tank fill cost and protected slab impact.',
  keywords: [
    'water pump electricity consumption calculator pakistan',
    '1 hp motor unit consumption per hour',
    'pani ki motor kitne unit leti hai',
    'submersible pump electricity bill calculator',
    'water motor bill calculation 2026',
    '1.5 hp motor kwh per day',
    'overhead tank fill electricity cost',
    'kelectric motor units consumption',
    'wapda water pump electricity cost',
    'shared water motor sub meter bill divider',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/water-pump-electricity-calculator`,
  },
  openGraph: {
    title: 'Water Pump Electricity Cost & Units Calculator | Read Meter',
    description:
      'Audit 0.5 HP, 1 HP, 1.5 HP, and 2 HP water motor power consumption, tank filling expenses, and avoid 200-unit slab penalties.',
    url: `${siteUrl}/tools/water-pump-electricity-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Water Pump Electricity Calculator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Pump Electricity Cost & Units Calculator | Read Meter',
    description:
      'Check how many units your water motor or borewell pump consumes and calculate overhead tank fill expenses.',
    images: ['/og-image.png'],
  },
}

export default function WaterPumpCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Water Pump Electricity Cost & Units Calculator',
    url: `${siteUrl}/tools/water-pump-electricity-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Programmatic energy calculator for Pakistani households to audit water motor and submersible pump unit consumption, overhead tank fill costs, and avoid tariff slab penalties.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WaterPumpCostCalculator />
    </>
  )
}
