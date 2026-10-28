import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './oilCalculator.module.css'
import CarOilChangeCalculator from './CarOilChangeCalculator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Wrench,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Car Oil Change & Odometer Interval Calculator | Read Meter',
  description:
    'Calculate exactly when your vehicle oil change is due by mileage, oil grade, and daily driving conditions. Snap your odometer to auto-track intervals on Read Meter PWA.',
  keywords: [
    'car oil change calculator',
    'engine oil change interval calculator',
    'oil change due date by mileage',
    'odometer oil change tracker',
    'gari ka oil kab change karna chahiye',
    'car engine oil change km in pakistan',
    'synthetic oil change interval pakistan',
    'bike engine oil change km',
    'vehicle maintenance tracker',
    'odometer camera scanner',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/car-oil-change-calculator`,
  },
  openGraph: {
    title: 'Car Oil Change & Odometer Interval Calculator | Read Meter',
    description:
      'Stop guessing your oil change. Calculate remaining KM, projected service date, and severe city driving impact with Read Meter.',
    url: `${siteUrl}/tools/car-oil-change-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Car Oil Change and Odometer Interval Calculator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Oil Change & Odometer Interval Calculator | Read Meter',
    description:
      'Calculate exactly when your car or bike oil change is due. Auto-track odometer intervals with AI camera scanning.',
    images: ['/og-image.png'],
  },
}

export default function CarOilChangeCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/car-oil-change-calculator#app`,
        name: 'Car Oil Change & Odometer Interval Calculator',
        url: `${siteUrl}/tools/car-oil-change-calculator`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Free online vehicle oil change calculator. Calculates remaining kilometers, projected service due date based on commute, oil grade (mineral, semi-synthetic, synthetic), and severe city driving adjustments.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/car-oil-change-calculator#howto`,
        name: 'How to Calculate Your Vehicle Oil Change Due Date and Remaining KM',
        description:
          'Step-by-step procedure to determine the exact remaining kilometers and due date for your vehicle engine oil service.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Check Your Current Odometer Reading',
            text: 'Look at your vehicle dashboard dial or trip computer and record the total accumulated kilometers.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Enter Last Oil Change Mileage',
            text: 'Retrieve the mileage written on your service sticker or lube center receipt from your previous oil service.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Select Engine Oil Grade and Driving Condition',
            text: 'Choose between Mineral (3,500 km), Semi-Synthetic (5,000 km), or Fully Synthetic (9,000 km), and specify if you commute in heavy stop-and-go city traffic.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Review Remaining KM and Projected Date',
            text: 'The calculator outputs your remaining safe distance, estimated service date, and traffic light status gauge.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/car-oil-change-calculator#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Gari ka engine oil kitne kilometers (KM) par change karna chahiye?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mineral oil aam tor par 3,000 se 4,000 km par, Semi-Synthetic oil 5,000 km par, aur Fully Synthetic oil 8,000 se 10,000 km par badalna chahiye. Agar aap rozana heavy city traffic (jaise Karachi ya Lahore ke rush hours) mein drive karte hain to 15% pehle oil change karwana behtar hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does severe stop-and-go city driving impact engine oil life?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In stop-and-go city traffic, the engine spends substantial time idling without generating odometer mileage. Idle engines operate with rich fuel mixtures, accumulating unburnt hydrocarbons, condensation, and heat cycles, which degrades engine oil 15% to 20% faster than highway cruising.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I track my vehicle odometer using Read Meter camera OCR?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Read Meter provides on-device AI camera OCR that scans your mechanical or digital odometer directly from your mobile camera, automatically recording readings and computing remaining interval distance without manual typing.',
            },
          },
          {
            '@type': 'Question',
            name: 'What happens if I delay an oil change beyond the recommended interval?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Exceeding the oil interval causes oil viscosity breakdown, thermal degradation, and engine sludge accumulation. Over time, this leads to increased friction, reduced fuel efficiency, valve train wear, and in severe cases, costly engine seizure.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className={styles.pageContainer}>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '1rem' }}>
        <Navbar maxWidth="1100px" />
      </div>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Compass size={16} />
          <span>Vehicle Odometer & Interval Tool</span>
        </div>
        <h1 className={styles.heroTitle}>
          Car Oil Change & <span>Odometer Interval</span> Calculator
        </h1>
        <p className={styles.heroSubtitle}>
          Know precisely when your vehicle service is due based on actual odometer mileage, engine oil grade, and
          Pakistani city traffic conditions. Avoid engine wear before it begins.
        </p>
      </div>

      {/* Calculator Interactive Widget */}
      <CarOilChangeCalculator />

      {/* Educational & SEO Content Blocks */}
      <div className={styles.contentWrapper}>
        {/* Interval Comparison Table */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <Wrench size={24} style={{ color: '#00f0ff' }} />
            Engine Oil Change Interval Guidelines
          </h2>
          <p className={styles.sectionText}>
            Every engine oil category behaves differently under thermal load and shear friction. Here is the breakdown
            of standard intervals versus severe driving conditions (stop-and-go traffic, extreme summer heat, and short
            trips):
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Oil Type</th>
                  <th>Standard Interval</th>
                  <th>Severe City Traffic (-15%)</th>
                  <th>Common Grades</th>
                  <th>Best Suited For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Mineral Oil</strong></td>
                  <td>3,500 – 4,000 KM</td>
                  <td>3,000 KM</td>
                  <td>20W-50, 10W-40</td>
                  <td>Older vehicles, motorcycles, high mileage engines</td>
                </tr>
                <tr>
                  <td><strong>Semi-Synthetic</strong></td>
                  <td>5,000 KM</td>
                  <td>4,250 KM</td>
                  <td>10W-40, 5W-30</td>
                  <td>Everyday family sedans, hatchbacks, mixed commuting</td>
                </tr>
                <tr>
                  <td><strong>Fully Synthetic</strong></td>
                  <td>8,000 – 10,000 KM</td>
                  <td>7,500 – 8,000 KM</td>
                  <td>0W-20, 5W-20, 5W-30</td>
                  <td>Modern turbocharged engines, hybrids, luxury vehicles</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Severe Driving Context */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
            Why Stop-and-Go Traffic Cuts Oil Life in Pakistan
          </h2>
          <p className={styles.sectionText}>
            If you drive in cities like <strong>Karachi, Lahore, Rawalpindi, or Peshawar</strong>, your engine spends up
            to 40% of its operating hours idling at red lights or crawling in 1st and 2nd gear. During idle:
          </p>
          <ul style={{ color: '#94a3b8', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>
              <strong>Uncounted Engine Hours:</strong> The odometer does not advance while idling, yet the engine oil
              continues to circulate, absorb heat, and break down chemically.
            </li>
            <li>
              <strong>Fuel Dilution & Carbon Buildup:</strong> Sub-optimal combustion during frequent stops leaves soot
              and unburnt petrol particles that dilute the oil film on cylinder walls.
            </li>
            <li>
              <strong>Ambient Summer Temperatures:</strong> Road surfaces in summer regularly exceed 45°C, subjecting
              engine lubricants to thermal oxidation far faster than European highway driving.
            </li>
          </ul>
          <p className={styles.sectionText}>
            This is why automotive manufacturers recommend applying the <strong>Severe Service Schedule</strong> (a 15%
            to 20% interval deduction) for urban city vehicles.
          </p>
        </section>

        {/* FAQs Section */}
        <section className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            <HelpCircle size={24} style={{ color: '#00f0ff' }} />
            Frequently Asked Questions (FAQs)
          </h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Gari ka oil kab change karwayen — Roman Urdu guide?
              </h3>
              <p className={styles.faqAnswer}>
                Agar aap standard mineral oil istemal kar rahe hain to har 3,000 se 3,500 km par oil aur oil filter
                badalna zaroori hai. Semi-synthetic oil 5,000 km tak chalta hai, jabke full synthetic oil (jaise 0W-20 ya
                5W-30) 8,000 se 10,000 km tak chalaya ja sakta hai. Hamesha dashboard odometer aur trip meter dono note
                karein.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Should I replace the oil filter at every oil change?
              </h3>
              <p className={styles.faqAnswer}>
                Yes, always replace the oil filter simultaneously with the engine oil. An old oil filter holds trapped
                sludge and up to 300ml of degraded oil, which immediately contaminates your fresh oil batch and restricts
                lubrication pressure.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                How does Read Meter help with odometer tracking?
              </h3>
              <p className={styles.faqAnswer}>
                Read Meter is built as an offline-first Progressive Web App (PWA). Instead of searching for pen and
                paper or reading blurry windshield oil change stickers, simply open Read Meter, snap your dashboard
                odometer using our on-device OCR camera scanner, and let the app log intervals and alert you when your
                next service is due.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer maxWidth="1100px" />
    </div>
  )
}
