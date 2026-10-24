import type { Metadata } from 'next'
import GeneratorFuelCostCalculator from './GeneratorFuelCostCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Generator Fuel Cost & Backup Calculator 2026 | Read Meter',
  description:
    'Calculate generator petrol, diesel, and LPG fuel consumption per hour, daily outage fuel expense, and effective cost per unit (kWh) in Pakistan.',
  keywords: [
    'generator fuel consumption calculator pakistan',
    'petrol generator fuel consumption per hour',
    'diesel generator fuel cost per kwh',
    '3.5 kva generator fuel average',
    'generator cost per unit vs grid',
    'lpg generator running cost',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/generator-fuel-cost-calculator`,
  },
  openGraph: {
    title: 'Generator Fuel Cost & Backup Calculator | Read Meter',
    description:
      'Check hourly fuel burn, monthly fuel budget, and cost per unit for petrol, diesel, and gas generators.',
    url: `${siteUrl}/tools/generator-fuel-cost-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Generator Fuel Cost Calculator',
      },
    ],
    type: 'website',
  },
}

export default function GeneratorCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Generator Fuel Cost & Backup Calculator',
    url: `${siteUrl}/tools/generator-fuel-cost-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Programmatic fuel burn and outage cost calculation engine for residential and commercial backup generators.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GeneratorFuelCostCalculator />
    </>
  )
}
