import type { Metadata } from 'next'
import SolarSystemSizingCalculator from './SolarSystemSizingCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Solar System Sizing & Inverter Calculator 2026 | Read Meter',
  description:
    'Calculate recommended solar system size in kW, number of 585W bifacial solar panels, inverter capacity, and roof space required based on your monthly units or bill in Pakistan.',
  keywords: [
    'solar system sizing calculator pakistan',
    'how many solar panels for 500 units',
    'solar inverter size calculator kw',
    'solar panels for 1.5 ton ac',
    'solar system cost and kw calculator pakistan',
    'roof space required for solar panels',
    'solar panel calculation formula',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/solar-system-sizing-calculator`,
  },
  openGraph: {
    title: 'Solar System Sizing & Inverter Calculator | Read Meter',
    description:
      'Determine how many solar panels, kW capacity, and roof space you need to eliminate your electric bill.',
    url: `${siteUrl}/tools/solar-system-sizing-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Solar System Sizing Calculator',
      },
    ],
    type: 'website',
  },
}

export default function SolarSizingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Solar System Sizing & Inverter Calculator',
    url: `${siteUrl}/tools/solar-system-sizing-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Programmatic solar engineering calculator to determine DC system kW, panel count, inverter rating, and roof area for residential and commercial rooftop solar.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolarSystemSizingCalculator />
    </>
  )
}
