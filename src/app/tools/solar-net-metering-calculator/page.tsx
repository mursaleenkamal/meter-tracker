import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './solarCalculator.module.css'
import SolarNetMeteringCalculator from './SolarNetMeteringCalculator'
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Solar Net Metering Calculator Pakistan 2026 | 5kW, 10kW Units & Payback',
  description:
    'Free Solar Net Metering & Units Savings Calculator for Pakistan. Calculate daily and monthly units generation for 3kW, 5kW, 10kW systems, NEPRA export buyback credits, and exact ROI payback period across K-Electric, LESCO, and IESCO.',
  keywords: [
    'solar net metering calculator pakistan',
    'how many units 5kw solar system produce in pakistan',
    'solar payback calculator pakistan',
    'solar system bill saving calculator k-electric',
    'nepra net metering buyback rate 2026',
    '10kw solar system daily units pakistan',
    'on grid solar system savings calculator',
    'solar net meter reading check',
    'solar unit generation calculator karachi lahore',
    'green meter export units rate',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/solar-net-metering-calculator`,
  },
  openGraph: {
    title: 'Solar Net Metering & Units Savings Calculator Pakistan | Read Meter',
    description:
      'Calculate solar unit generation, monthly rupee savings, NEPRA green meter export credits, and system payback across Pakistan.',
    url: `${siteUrl}/tools/solar-net-metering-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Solar Net Metering Calculator Pakistan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Net Metering & ROI Calculator Pakistan | Read Meter',
    description:
      'Find out how many units your solar system produces and your exact payback period with K-Electric, LESCO, and IESCO tariffs.',
    images: ['/og-image.png'],
  },
}

export default function SolarCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/solar-net-metering-calculator#app`,
        name: 'Solar Net Metering & Units Savings Calculator Pakistan',
        url: `${siteUrl}/tools/solar-net-metering-calculator`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Online solar generation and payback calculator for Pakistani consumers. Estimates daily/monthly kWh production for 3kW to 20kW systems, NEPRA green meter export credits, and electricity bill savings under current tariffs.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/solar-net-metering-calculator#howto`,
        name: 'How to Calculate Solar Net Metering Savings in Pakistan',
        description:
          'Step-by-step method to estimate solar system unit production, monthly bill reductions, and investment payback in Pakistan.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Select Solar System Capacity (kW)',
            text: 'Choose your installed or planned solar capacity (e.g., 5 kW for average home, 10 kW for home with multiple inverter ACs).',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Select City Solar Irradiance',
            text: 'Pick your city (Karachi, Lahore, Islamabad, Multan) to apply accurate regional peak sun hours per day.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Estimate Daytime Self-Consumption',
            text: 'Specify what percentage of solar power is used directly in daytime vs exported to the grid through the bidirectional green meter.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Review Payback and Monthly Savings',
            text: 'View monthly rupee savings, NEPRA export buyback credits, and years required to recover the total investment.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/solar-net-metering-calculator#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Pakistan mein 5kW solar system rozana kitne units banata hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pakistan mein 5kW on-grid ya hybrid solar system saal ke ausat (annual average) par rozana taqreeban 18 se 22 units generate karta hai. Garmiyon mein yeh 24 units tak pohanchta hai aur sardiyon mein 15–18 units rehta hai.',
            },
          },
          {
            '@type': 'Question',
            name: '10kW solar system lagane par mahana kitni bachat hoti hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '10kW system mahana taqreeban 1,200 se 1,350 units generate karta hai. Mojooda electricity tariffs (Rs 42–48/unit) par yeh mahana Rs 45,000 se Rs 60,000+ tak ki direct electricity bill savings deta hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'NEPRA Green Meter export rate kya hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'NEPRA net metering regulations ke mutabiq grid ko export kiye gaye excess units national average generation basket rate (taqreeban Rs 21–22/unit) par settle kiye jatay hain ya off-peak units se 1:1 net kiye jatay hain.',
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
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Compass size={28} color="#00f0ff" />
          <span>Read Meter</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/tools" className={styles.navBtn}>
            All Tools
          </Link>
          <Link href="/tools/sub-meter-bill-calculator" className={styles.navBtn}>
            Sub-Meter Tool
          </Link>
          <Link href="/guest" className={styles.navBtnPrimary}>
            Open Scanner
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sun size={14} />
          <span>Pakistan Solar Energy Tool</span>
        </div>
        <h1 className={styles.title}>
          Solar Net Metering & Units Calculator Pakistan 2026
        </h1>
        <p className={styles.subtitle}>
          Apne solar system (3kW se 20kW) ki daily aur monthly unit generation calculate karein. NEPRA green meter export
          credits, electricity bill reduction, aur investment payback period ka mukammal hisab.
        </p>
      </section>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Interactive Tool */}
        <SolarNetMeteringCalculator />

        {/* Educational Content & Guide */}
        <section className={styles.contentSection}>
          <h2 className={styles.contentH2}>
            Pakistan Mein Solar System Kitne Units Generate Karta Hai?
          </h2>
          <p className={styles.contentP}>
            Pakistan dunya ke behtareen solar irradiance regions mein shumar hota hai jahan saal mein 300 se ziada din
            dhoop nikalti hai. Kisi bhi solar system ki generation ka aasan formula yeh hai:
          </p>

          <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '12px' }}>
            <code style={{ color: '#fbbf24', fontSize: '1.05rem', fontWeight: 700 }}>
              Rozana Units = System Capacity (kW) × Peak Sun Hours (4.4 - 5.0) × Performance Ratio (0.80)
            </code>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className={styles.faqItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>3 kW System (Small House / 5 Marla)</span>
              </div>
              <p className={styles.faqAnswer}>
                • Rozana Units: 11 se 13 Units
                <br />
                • Mahana Generation: ~360 se 390 Units
                <br />
                • Ideal Load: 1 Inverter AC (din mein) + Fridge + Fans + LED lights.
              </p>
            </div>

            <div className={styles.faqItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>5 kW System (Standard Home / 120-200 Sq Yds)</span>
              </div>
              <p className={styles.faqAnswer}>
                • Rozana Units: 19 se 22 Units
                <br />
                • Mahana Generation: ~600 se 660 Units
                <br />
                • Ideal Load: 2 Inverter ACs (din mein) + 1 HP water pump + full home load.
              </p>
            </div>

            <div className={styles.faqItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>10 kW System (Double Storey / 1 Kanal)</span>
              </div>
              <p className={styles.faqAnswer}>
                • Rozana Units: 40 se 45 Units
                <br />
                • Mahana Generation: ~1,200 se 1,350 Units
                <br />
                • Ideal Load: 3-4 Inverter ACs + Deep Freezer + Water Motor + heavy daytime appliances.
              </p>
            </div>
          </div>

          <h2 className={styles.contentH2}>Daytime Self-Consumption vs Grid Export (NEPRA)</h2>
          <p className={styles.contentP}>
            Pakistani consumers ke liye sab se ziada faida mand baat yeh hai ke din ke waqt solar se banne wali bijli ko
            direct ghar ke andar istemal kiya jaye (Self-Consumption). Wajah yeh hai ke jab aap solar unit direct use kartay
            hain to aap grid ka retail rate (Rs 42–48/unit) bachate hain, jabke grid ko export kiye gaye excess units NEPRA
            basket rate (Rs 21–22/unit) par credit hotay hain.
          </p>

          <h2 className={styles.contentH2}>Aksar Poochay Janay Walay Sawalat (FAQs)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Q: Green Meter lagwane mein kitna waqt lagta hai?
              </div>
              <div className={styles.faqAnswer}>
                Pakistan mein DISCOs (K-Electric, LESCO, IESCO waghera) se net metering approval aur green bidirectional
                meter installation mein aam tor par 4 se 8 haftay lagte hain.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Q: Kya Read Meter se solar green meter ki readings monitor ki ja sakti hain?
              </div>
              <div className={styles.faqAnswer}>
                Jee haan! Read Meter camera scanner bidirectional meters ke Import aur Export dono dials ko scan kar sakta hai,
                taake DISCO bill mein credit unit entry ghalat na ho.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Q: On-Grid aur Hybrid system mein kya farq hai?
              </div>
              <div className={styles.faqAnswer}>
                On-Grid system grid ke sath sync rehta hai aur loadshedding ke waqt band ho jata hai (inverter anti-islanding).
                Hybrid system mein lithium/tubular batteries connect hoti hain jo loadshedding ke dauran bhi backup supply
                farmaham karti hain.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
