import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './subMeterCalculator.module.css'
import SubMeterBillCalculator from './SubMeterBillCalculator'
import Navbar from '@/components/Navbar'
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Users,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Sub-Meter Electricity Bill Calculator Pakistan | Landlord & Tenant Split Formula',
  description:
    'Free sub-meter electricity bill divider calculator for Pakistan. Accurately split K-Electric, LESCO, IESCO, and MEPCO bills across tenants, portions, and shared water motors with zero disputes.',
  keywords: [
    'sub meter electricity bill calculator',
    'sub meter calculation formula pakistan',
    'landlord tenant electricity bill divider',
    'shared meter bill split calculator',
    'sub meter reading unit rate calculate karne ka tarika',
    'k electric sub meter calculation',
    'lesco shared meter bill split',
    'water pump common load division formula',
    'joint family electricity bill divide',
    'sub meter camera reading app',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/sub-meter-bill-calculator`,
  },
  openGraph: {
    title: 'Sub-Meter Electricity Bill Calculator Pakistan | Read Meter',
    description:
      'Stop arguing over electricity bills. Calculate fair proportional sub-meter shares with common load division and 1-click WhatsApp bills.',
    url: `${siteUrl}/tools/sub-meter-bill-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sub-Meter Electricity Bill Calculator Pakistan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sub-Meter Electricity Bill Calculator | Read Meter',
    description:
      'Accurate sub-meter bill calculation formula for Pakistani landlords and tenants. Generate WhatsApp invoices in seconds.',
    images: ['/og-image.png'],
  },
}

export default function SubMeterCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/sub-meter-bill-calculator#app`,
        name: 'Sub-Meter Electricity Bill Divider & Tenant Split Calculator',
        url: `${siteUrl}/tools/sub-meter-bill-calculator`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Free online sub-meter electricity bill divider. Calculates fair effective blended unit rate across tenants and shared common loads like water motors for K-Electric, LESCO, IESCO, and MEPCO.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/sub-meter-bill-calculator#howto`,
        name: 'How to Calculate Sub-Meter Electricity Bills Fairly in Pakistan',
        description:
          'Step-by-step procedure to divide a shared main electricity meter bill among tenants and landlords without disputes.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Check Total Main Bill and Units',
            text: 'Find the total payable amount (including all taxes, FPA, and surcharges) and total units consumed from the utility electricity bill.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Record Sub-Meter Readings on the Same Day',
            text: 'Read all sub-meters on the same billing cycle date as the utility meter to ensure matching consumption timeframes.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Calculate the Effective Blended Rate',
            text: 'Divide the total bill amount by total main meter units to get the true blended rate per unit.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Allocate Common Load and Generate Invoice',
            text: 'Divide water motor and shared hallway lights equally or proportionally, then multiply each portion’s units by the blended rate.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/sub-meter-bill-calculator#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Sub-meter ke bill mein Fuel Price Adjustment (FPA) aur taxes kaise divide karein?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'FPA aur taxes ko alag se jorne ke bajaye Total Bill Amount ko Total Main Units par divide karein. Is se aik fair Effective Unit Rate nikalta hai jo har tenant par uske consumption ke mutabiq 100% barabar apply hota hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'Pani ki motor (water pump) aur common lights ka bill kaise divide hona chahiye?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Agar water motor ka alag sub-meter hai to uske units tamam portions mein barabar (equal split) ya family members ke hisab se proportional divide kiye jatay hain.',
            },
          },
          {
            '@type': 'Question',
            name: 'Agar sub-meters ka total main meter ke units se kam ho to kya karein?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yeh difference aksar staircase lights, unmetered boundary wall lights, ya purani wiring ki line loss ki wajah se hota hai. Is difference ko calculator automatically detect kar ke warn karta hai.',
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
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '1rem' }}>
        <Navbar maxWidth="1100px" />
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Zap size={14} />
          <span>Free Regional Utility Tool</span>
        </div>
        <h1 className={styles.title}>
          Sub-Meter Electricity Bill Calculator Pakistan
        </h1>
        <p className={styles.subtitle}>
          Landlord aur tenants ke darmian bijli ke bill ki 100% munafas taqseem. K-Electric, LESCO, IESCO, aur MEPCO
          ke main bill ko tamam portions aur common load (water motor) mein aasaani se divide karein.
        </p>
      </section>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Interactive Tool */}
        <SubMeterBillCalculator />

        {/* Educational Content & Guide */}
        <section className={styles.contentSection}>
          <h2 className={styles.contentH2}>
            Sub-Meter Bill Divide Karne Ka Sahi Formula Kya Hai?
          </h2>
          <p className={styles.contentP}>
            Pakistan mein aksar upper/lower portions ya rented apartments mein sab se barha jhagda month-end par bijli ke
            bill ki taqseem par hota hai. Agar landlord ya tenant purana tareeqa istemal karein jahan sirf basic unit rate
            lagaya jaye, to FPA (Fuel Price Adjustment), GST, Electricity Duty, aur Fixed Charges ka bojh kisi aik party par
            parh jata hai.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className={styles.faqItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>The Fair Effective Rate Method</span>
              </div>
              <p className={styles.faqAnswer}>
                Total Bill Amount (with all taxes & FPA) ko Total Units par divide kar ke aik single composite unit rate
                nikala jata hai:
                <br />
                <code style={{ color: '#00f0ff', background: 'rgba(0,240,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Effective Rate = Total Rs / Total Units
                </code>
                <br />
                Is formula se har portion apne units ke mutabiq taxes aur slabs ka hissa barabar ada karta hai.
              </p>
            </div>

            <div className={styles.faqItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700 }}>
                <AlertTriangle size={18} />
                <span>Ghalat Tareeqay Se Bacho</span>
              </div>
              <p className={styles.faqAnswer}>
                Khatarnak ghalti yeh hoti hai ke sub-meter ke 150 units ko alag se protected slab par calculate kiya jaye jabke
                main meter 700+ units ki wajah se non-protected high slab par chal raha hota hai. Is se Rs 10,000+ ka deficit
                paida hota hai jo landlord ko bharna parhta hai.
              </p>
            </div>
          </div>

          <h2 className={styles.contentH2}>Common Load (Pani Ki Motor) Ka Masla</h2>
          <p className={styles.contentP}>
            Pakistan ke har ghar mein pani ki motor (1 HP se 2 HP) rozana 2–4 units khinchti hai jo mahana 60 se 120 units
            banti hai. Agar water motor kisi aik tenant ke meter par lagi ho to doosra tenant usko notice nahi karta. Is
            calculator mein aap <strong>Common Load</strong> enter kar ke usko barabar ya proportional divide kar sakte
            hain.
          </p>

          <h2 className={styles.contentH2}>Aksar Poochay Janay Walay Sawalat (FAQs)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Q: Kya Read Meter ke zariye sub-meter ki photo scan kar sakte hain?
              </div>
              <div className={styles.faqAnswer}>
                Jee haan! Read Meter PWA camera OCR scanner ke zariye aap har sub-meter ki reading ko direct camera se capture
                kar ke secure digital ledger mein save kar sakte hain taake reading date aur digits par koi aitraz na ho.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Q: Sub-meters ki readings kis tareekh ko leni chahiye?
              </div>
              <div className={styles.faqAnswer}>
                Hamesha K-Electric ya WAPDA ke meter reader ke aane ke 24 ghante ke andar sub-meters ki reading lein taake billing
                cycle aur days ka exact match ho.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Q: WhatsApp invoice message kaise send hota hai?
              </div>
              <div className={styles.faqAnswer}>
                Upar diye gaye calculator mein details enter karne ke baad aik click par &ldquo;Copy Formatted WhatsApp Invoice&rdquo; button dabayein aur apne tenant ya family WhatsApp group mein paste kar dein.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
