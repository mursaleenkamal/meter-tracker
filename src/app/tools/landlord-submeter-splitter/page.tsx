import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../sub-meter-bill-calculator/subMeterCalculator.module.css'
import SubMeterBillCalculator from '../sub-meter-bill-calculator/SubMeterBillCalculator'
import Navbar from '@/components/Navbar'
import { Compass, ArrowRight, ShieldCheck, HelpCircle, Users, CheckCircle2, Zap } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Tenant Sub-Meter Bill Divider & Receipt Generator | Landlord Split Calculator',
  description:
    'Split shared utility bills by exact sub-meter units with downloadable tenant receipt proofs. Handle common load, water pumps, and proportional tariff math with 0 disputes.',
  keywords: [
    'submeter electricity bill split calculator',
    'tenant sub meter bill divider',
    'landlord submeter split receipt generator',
    'split shared utility bill between tenants',
    'rental sub meter bill division formula',
    'common load water pump electrical split',
    'submeter calculator for landlords',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/landlord-submeter-splitter`,
  },
  openGraph: {
    title: 'Tenant Sub-Meter Bill Divider & Receipt Generator | Read Meter',
    description:
      'Easily divide main electric bills among multiple tenants with fair blended rates and 1-click WhatsApp receipts.',
    url: `${siteUrl}/tools/landlord-submeter-splitter`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Landlord Sub-Meter Bill Splitter Read Meter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Landlord Sub-Meter Bill Divider & Receipt Generator',
    description:
      'Fair, dispute-free utility bill splits for tenants, apartment buildings, and shared homes.',
    images: ['/og-image.png'],
  },
}

export default function LandlordSubmeterSplitterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/landlord-submeter-splitter#app`,
        name: 'Tenant Sub-Meter Bill Divider & Receipt Generator',
        url: `${siteUrl}/tools/landlord-submeter-splitter`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Automated tool for landlords and property managers to divide shared utility bills among tenants with proof receipts.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/landlord-submeter-splitter#howto`,
        name: 'How to Split Shared Utility Bills Fairly Among Tenants',
        description:
          'A simple step-by-step method to calculate proportional electricity bills for rental units.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Enter Main Bill and Units',
            text: 'Input the total bill amount and total kilowatt-hours billed by the utility provider.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Add Sub-Meter Portions',
            text: 'Input monthly units consumed or previous and current meter readings for each tenant.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Allocate Shared Load',
            text: 'Distribute unmetered common consumption (such as water pumps and hallway lighting) equally or proportionally.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Generate and Send Slips',
            text: 'Copy formatted WhatsApp invoices or print receipts for all tenants.',
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

      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Users size={16} />
          <span>Landlord &amp; Tenant Hub</span>
        </div>
        <h1 className={styles.title}>Tenant Sub-Meter Bill Divider &amp; Receipt Generator</h1>
        <p className={styles.subtitle}>
          Stop arguing over shared electricity bills. Calculate 100% mathematically fair unit rates
          across all rental portions, distribute common loads, and generate 1-click WhatsApp slips.
        </p>
      </section>

      {/* Calculator Body */}
      <SubMeterBillCalculator />

      {/* Footer Navigation */}
      <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#38bdf8',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          <Compass size={18} /> Explore All Utility Calculators &amp; AI Tools <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
