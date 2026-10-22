import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './toolsHub.module.css'
import {
  Compass,
  Zap,
  Users,
  Sun,
  Gauge,
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BatteryCharging,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Free Electricity, Solar & Interval Utility Tools Pakistan | Read Meter',
  description:
    'Free programmatic calculators for Pakistan: 200-Unit Protected Slab Calculator, UPS Battery Backup Duration, Sub-Meter Bill Divider, Solar Net Metering Payback, and Vehicle Oil Change Interval Tracker.',
  keywords: [
    'utility calculators pakistan',
    'electricity bill calculator pakistan',
    'ups battery backup calculator',
    'inverter battery backup time calculator',
    '200ah tubular battery backup',
    '200 unit protected slab calculator',
    'sub meter electricity bill calculator',
    'solar net metering calculator pakistan',
    'car oil change calculator pakistan',
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
    ],
  }

  const tools = [
    {
      title: '200-Unit Protected Slab Calculator',
      description:
        'Avoid the costly 201-unit penalty cliff under NEPRA rules. Calculates bill differences and safe daily burn rate across K-Electric, IESCO, LESCO, and MEPCO.',
      href: '/protected-slab-calculator',
      category: 'Electricity & Tariffs',
      icon: <Zap size={24} color="#00f0ff" />,
      badge: 'High Impact',
      cardClass: styles.toolCardElectric,
    },
    {
      title: 'UPS & Inverter Battery Backup Calculator',
      description:
        'Calculate exact backup hours and minutes for 100Ah, 150Ah, 180Ah, and 200Ah batteries. Factor in inverter efficiency, safe depth of discharge (DoD), and full recharge units.',
      href: '/tools/battery-backup-calculator',
      category: 'Batteries & Inverters',
      icon: <BatteryCharging size={24} color="#00f0ff" />,
      badge: 'Popular',
      cardClass: styles.toolCardElectric,
    },
    {
      title: 'Sub-Meter Bill Divider & Tenant Split',
      description:
        'Fairly divide shared main electricity bills among tenants and portions. Includes common load (water pump motor) division and 1-click formatted WhatsApp invoices.',
      href: '/tools/sub-meter-bill-calculator',
      category: 'Sub-metering & Rentals',
      icon: <Users size={24} color="#10b981" />,
      badge: 'Zero Dispute',
      cardClass: styles.toolCardElectric,
    },
    {
      title: 'Solar Net Metering & Units Calculator',
      description:
        'Calculate daily and monthly unit generation for 3kW to 20kW systems, NEPRA green meter export credits, and investment payback period in Pakistani cities.',
      href: '/tools/solar-net-metering-calculator',
      category: 'Solar & Clean Energy',
      icon: <Sun size={24} color="#fbbf24" />,
      badge: 'Payback ROI',
      cardClass: styles.toolCardSolar,
    },
    {
      title: 'Car & Bike Oil Change Interval Calculator',
      description:
        'Track remaining kilometers and projected service due dates based on commute, oil grade (mineral, semi-synthetic, fully synthetic), and severe city driving.',
      href: '/tools/car-oil-change-calculator',
      category: 'Vehicles & Maintenance',
      icon: <Gauge size={24} color="#3b82f6" />,
      badge: 'Interval Tracking',
      cardClass: styles.toolCardVehicle,
    },
  ]

  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Compass size={28} color="#00f0ff" />
          <span>Read Meter</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/blog" className={styles.navBtn}>
            Energy Blog
          </Link>
          <Link href="/protected-slab-calculator" className={styles.navBtn}>
            Protected Slab
          </Link>
          <Link href="/guest" className={styles.navBtnPrimary}>
            Open Scanner
          </Link>
        </div>
      </header>

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
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className={`${styles.toolCard} ${tool.cardClass}`}>
              <div>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>{tool.category}</span>
                  <span className={styles.badgePopular}>{tool.badge}</span>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <div className={styles.iconWrapper}>{tool.icon}</div>
                  <div className={styles.cardBody} style={{ marginTop: '1rem' }}>
                    <h2 className={styles.toolTitle}>{tool.title}</h2>
                    <p className={styles.toolDescription}>{tool.description}</p>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.launchLink}>
                  <span>Open Interactive Tool</span>
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

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
