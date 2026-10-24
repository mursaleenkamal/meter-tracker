import type { Metadata } from 'next'
import AppliancePowerCostCalculator from './AppliancePowerCostCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Appliance Electricity Cost & Wattage Calculator 2026 | Read Meter',
  description:
    'Calculate exact units (kWh) and monthly bill cost for household appliances: 1.5 Ton AC, refrigerator, water motor pump, ceiling fans, iron, and LED TV under Pakistani DISCO tariffs.',
  keywords: [
    'appliance electricity cost calculator pakistan',
    'ac electricity bill calculator per hour',
    'refrigerator units consumed per month kwh',
    '1.5 ton inverter ac power consumption',
    'water pump motor electricity cost',
    'ceiling fan wattage calculator',
    'electricity bill per appliance kwh calculator',
    'nepra electricity cost per appliance',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/appliance-power-cost-calculator`,
  },
  openGraph: {
    title: 'Appliance Electricity Cost & Wattage Calculator | Read Meter',
    description:
      'Check how many units (kWh) and rupees your AC, fridge, iron, and fans add to your monthly electric bill.',
    url: `${siteUrl}/tools/appliance-power-cost-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appliance Electricity Cost Calculator',
      },
    ],
    type: 'website',
  },
}

export default function ApplianceCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Appliance Electricity Cost & Wattage Calculator',
    url: `${siteUrl}/tools/appliance-power-cost-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Programmatic energy calculator to calculate daily and monthly kWh consumption and electricity bill cost for household electrical appliances.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppliancePowerCostCalculator />
    </>
  )
}
