import type { Metadata } from 'next'
import AcElectricityCostCalculator from './AcElectricityCostCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'AC Electricity Cost & Inverter Savings Calculator 2026 | Read Meter',
  description:
    'Calculate exact units (kWh) and bill cost for 1 Ton, 1.5 Ton, and 2 Ton inverter ACs. Compare energy savings between 26°C and 18°C thermostat settings.',
  keywords: [
    'ac electricity bill calculator pakistan',
    '1.5 ton inverter ac power consumption units',
    'inverter ac vs non inverter ac electricity cost',
    'ac temperature setting electricity savings 26 vs 18',
    'how many units 1.5 ton ac consume in 8 hours',
    'k-electric ac bill calculator',
    'ac units consumed per month',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/ac-electricity-cost-calculator`,
  },
  openGraph: {
    title: 'AC Electricity Cost & Inverter Savings Calculator | Read Meter',
    description:
      'Calculate monthly kWh units and rupee savings when setting AC to 26°C eco mode.',
    url: `${siteUrl}/tools/ac-electricity-cost-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AC Electricity Cost & Inverter Savings Calculator',
      },
    ],
    type: 'website',
  },
}

export default function AcCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AC Electricity Cost & Inverter Savings Calculator',
    url: `${siteUrl}/tools/ac-electricity-cost-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Interactive energy audit tool to calculate units, bill cost, and temperature savings for inverter and non-inverter air conditioners.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AcElectricityCostCalculator />
    </>
  )
}
