import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './toolsHub.module.css'
import ToolsGrid from './ToolsGrid'
import Navbar from '@/components/Navbar'
import {
  Compass,
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Free Electricity, Solar & Interval Utility Tools Pakistan | Read Meter',
  description:
    'Free programmatic calculators for Pakistan: 200-Unit Protected Slab Calculator, EV & Electric Bike Charging Cost, UPS Battery Backup Duration, Sub-Meter Bill Divider, Solar Net Metering Payback, and Vehicle Oil Change Interval Tracker.',
  keywords: [
    'utility calculators pakistan',
    'electricity bill calculator pakistan',
    'ev charging cost calculator pakistan',
    'electric bike charging units consumed kwh electricity bill',
    'ups battery backup calculator',
    'inverter battery backup time calculator',
    '200ah tubular battery backup',
    '200 unit protected slab calculator',
    'sub meter electricity bill calculator',
    'solar net metering calculator pakistan',
    'car oil change calculator pakistan',
    'online water meter scanner',
    'read water meter leak test',
    'k-electric bill tools',
    'nepra tariff calculators 2026',
    'read meter tools',
  ],
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
  openGraph: {
    title: 'Programmatic Utility & Interval Calculators | Read Meter',
    description:
      'High-intent utility calculators for Pakistani households: Protected Slab, Sub-Meter Split, Solar Net Metering, and Odometer Intervals.',
    url: `${siteUrl}/tools`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Read Meter Utility Tools Hub',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Utility & Interval Calculators | Read Meter',
    description:
      'Smart utility calculators for Pakistan: electricity slabs, sub-meter division, solar generation, and vehicle service tracking.',
    images: ['/og-image.png'],
  },
}

export default function ToolsHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/tools#collection`,
    name: 'Read Meter Programmatic Utility & Interval Tools',
    url: `${siteUrl}/tools`,
    description:
      'Comprehensive collection of free programmatic utility and interval calculators designed for Pakistani households and vehicle owners.',
    hasPart: [
      {
        '@type': 'WebApplication',
        name: 'Instant Digital Meter Scanner (kWh)',
        url: `${siteUrl}/tools/read-digital-lcd-meter`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Free Analog Electric Meter Reader (Dials)',
        url: `${siteUrl}/tools/read-analog-dial-meter`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Online Gas Meter Photo Reader (m³ / CCF)',
        url: `${siteUrl}/tools/read-gas-meter`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Smart Water Meter Scanner & Leak Detector',
        url: `${siteUrl}/tools/read-water-meter`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: '200 Unit Protected Slab Calculator',
        url: `${siteUrl}/protected-slab-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Sub-Meter Electricity Bill Divider',
        url: `${siteUrl}/tools/sub-meter-bill-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Landlord Sub-Meter Electricity Splitter',
        url: `${siteUrl}/tools/landlord-submeter-splitter`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Solar Net Metering & Units Calculator',
        url: `${siteUrl}/tools/solar-net-metering-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Car & Bike Oil Change Interval Calculator',
        url: `${siteUrl}/tools/car-oil-change-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'UPS & Solar Inverter Battery Backup Calculator',
        url: `${siteUrl}/tools/battery-backup-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'EV & Electric Bike Charging Cost Calculator',
        url: `${siteUrl}/tools/ev-charging-cost-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Appliance Electricity Cost & Wattage Calculator',
        url: `${siteUrl}/tools/appliance-power-cost-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'AC Electricity Cost & Inverter Savings Calculator',
        url: `${siteUrl}/tools/ac-electricity-cost-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Solar System Sizing & Inverter Calculator',
        url: `${siteUrl}/tools/solar-system-sizing-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Generator Fuel Cost & Backup Calculator',
        url: `${siteUrl}/tools/generator-fuel-cost-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'LPG Gas Cylinder Days & Consumption Calculator',
        url: `${siteUrl}/tools/lpg-cylinder-calculator`,
        applicationCategory: 'UtilityApplication',
      },
      {
        '@type': 'WebApplication',
        name: 'Water Pump & Motor Electricity Cost Calculator',
        url: `${siteUrl}/tools/water-pump-electricity-calculator`,
        applicationCategory: 'UtilityApplication',
      },
    ],
  }

  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar maxWidth="1100px" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Programmatic Utility Engine</span>
        </div>
        <h1 className={styles.title}>
          Utility, Solar & Interval Calculators
        </h1>
        <p className={styles.subtitle}>
          Pakistani households aur vehicle owners ke liye free interactive tools. NEPRA electricity tariffs, sub-meter
          bill division, solar net metering, aur vehicle maintenance ka aasan hisab.
        </p>
      </section>

      {/* Main Grid */}
      <main className={styles.mainContent}>
        <ToolsGrid />

        {/* PWA Integration Banner */}
        <section className={styles.pwaBanner}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <ShieldCheck size={18} />
              <span>Zero-Friction Camera Scanner</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0' }}>
              Want to skip manual numbers entry?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Read Meter PWA provides instant on-device OCR. Snap your electricity meter, gas dial, solar bidirectional
              green meter, or car odometer to automatically track intervals without typing!
            </p>
          </div>
          <Link href="/guest" className={styles.navBtnPrimary} style={{ padding: '0.85rem 1.6rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <Camera size={20} />
            <span>Launch Camera OCR</span>
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  )
}
