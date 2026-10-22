import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './batteryCalculator.module.css'
import BatteryBackupCalculator from './BatteryBackupCalculator'
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  BatteryCharging,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Camera,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'UPS & Inverter Battery Backup Time Calculator (2026) | Read Meter',
  description:
    'Calculate exact UPS and solar inverter battery backup time in hours and minutes. Works for 12V, 24V, 48V tall tubular (AGS, Phoenix, Volta), lead-acid, and LiFePO4 batteries with appliance load selection.',
  keywords: [
    'ups battery backup calculator',
    'inverter battery backup time calculator',
    'battery backup formula pakistan',
    '200ah tubular battery backup time',
    'how long does 200ah battery last',
    'ups battery backup time on 2 fans 4 lights',
    'solar battery runtime calculator',
    '12v 200ah battery watt hours',
    'ups battery recharge units kwh',
    'tubular battery dod pakistan',
    'k-electric ups electricity consumption',
    'read meter battery calculator',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/battery-backup-calculator`,
  },
  openGraph: {
    title: 'UPS & Inverter Battery Backup Time Calculator | Read Meter',
    description:
      'Stop guessing your battery backup. Calculate precise hours & minutes based on battery Ah, DoD, inverter efficiency, and real appliance load in Pakistan.',
    url: `${siteUrl}/tools/battery-backup-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UPS and Solar Inverter Battery Backup Calculator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPS & Inverter Battery Backup Time Calculator | Read Meter',
    description:
      'Calculate exact battery backup hours and recharge electricity costs for 100Ah, 150Ah, 180Ah, 200Ah tubular batteries in Pakistan.',
    images: ['/og-image.png'],
  },
}

export default function BatteryBackupCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/battery-backup-calculator#app`,
        name: 'UPS & Solar Inverter Battery Backup Time Calculator',
        url: `${siteUrl}/tools/battery-backup-calculator`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Free online UPS and solar inverter battery backup calculator. Computes exact backup duration in hours and minutes for 12V, 24V, and 48V tall tubular, lead-acid, and lithium batteries, taking inverter efficiency and safe depth of discharge into account.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/battery-backup-calculator#howto`,
        name: 'How to Calculate UPS Battery Backup Time in Hours and Minutes',
        description:
          'Step-by-step mathematical guide to calculating battery backup duration for home UPS and solar inverter systems.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Determine Total Battery Capacity in Watt-Hours (Wh)',
            text: 'Multiply battery DC voltage by Ampere-hour rating (e.g. 12V × 200Ah = 2,400 Watt-hours).',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Apply Safe Depth of Discharge (DoD)',
            text: 'Tall tubular batteries should only be discharged to 70% (0.70 × 2,400 Wh = 1,680 Wh safe usable energy).',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Factor In Inverter Conversion Efficiency',
            text: 'Standard inverters convert DC to AC at 80% to 88% efficiency. Multiply usable Wh by inverter efficiency (e.g. 1,680 Wh × 0.85 = 1,428 net Wh).',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Divide Net Usable Watt-Hours by Total Connected Watts',
            text: 'Divide the net usable Watt-hours by your running appliances wattage (e.g. 1,428 Wh / 250 Watts = 5.71 hours or ~5 hours 42 minutes).',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/battery-backup-calculator#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How many hours will a 200Ah battery run on 2 fans and 4 lights in Pakistan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A 12V 200Ah Tall Tubular battery running 2 standard ceiling fans (80W each = 160W) and 4 LED bulbs (12W each = 48W) has a total load of ~208 Watts. Accounting for 70% safe depth of discharge and 85% inverter efficiency (1,428 usable Wh), the battery will last approximately 6 hours and 50 minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the battery backup calculation formula?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The standard formula is: Backup Time (Hours) = [Battery Voltage (V) × Capacity (Ah) × Safe Depth of Discharge (%) × Inverter Efficiency (%)] / Total Connected Load (Watts). For a 12V 200Ah tubular battery: (12 × 200 × 0.70 × 0.85) / Load in Watts = 1,428 / Load.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many electricity units (kWh) does a 200Ah battery consume to recharge?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Recharging a 200Ah 12V tubular battery from a 70% discharged state draws approximately 1.9 to 2.2 kWh (units) of electricity from K-Electric or WAPDA, accounting for internal chemical conversion and heat losses.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why should I never discharge my UPS tubular battery below 70%?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Discharging a lead-acid or tubular battery below 70% Depth of Discharge (DoD) causes rapid lead sulfate crystallization on the plates (sulfation), irreversibly degrading battery capacity and cutting its lifespan from 3–4 years down to under 12 months.',
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
            All Calculators
          </Link>
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
          <span>Programmatic Energy Utility</span>
        </div>
        <h1 className={styles.heroTitle}>
          UPS & Inverter Battery <span>Backup Calculator</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Calculate exact backup hours and minutes for 100Ah, 150Ah, 180Ah, and 200Ah batteries. Factor in inverter
          efficiency, safe depth of discharge (DoD), and full recharge electricity units.
        </p>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Interactive Calculator */}
        <BatteryBackupCalculator />

        {/* Educational Deep Dive & Guide */}
        <article className={styles.guideSection}>
          <h2>UPS Battery Backup Time Calculation Formula (2026 Edition)</h2>
          <p>
            Pakistan mein load-shedding aur solar hybrid installations ke doran sab se ahem sawal yeh hota hai:{' '}
            <strong>&quot;Meri 200Ah battery par fans aur lights kitni dair chalain ge?&quot;</strong> Aksar electricians
            aur shopkeepers seedha battery voltage aur capacity ko multiply kar ke theoretical figure de dete hain, jo
            real-world mein 40% tak inaccurate hoti hai.
          </p>
          <p>
            Real-world mein accurate backup time janne ke liye chaar (4) ahem awamil ka hisab lagana zaroori hai:
          </p>
          <ol>
            <li><strong>Battery Nominal Storage (Watt-Hours):</strong> DC Voltage (V) × Capacity (Ah).</li>
            <li><strong>Safe Depth of Discharge (DoD):</strong> Battery ko mukammal zero (0V) tak discharge karne se plates damage ho jati hain. Tall tubular batteries ke liye 70% safe limit hai.</li>
            <li><strong>Inverter Conversion Efficiency:</strong> DC current ko 220V AC mein convert karne ke doran 12%–18% energy heat mein zaya hoti hai.</li>
            <li><strong>Active Appliance Load (Watts):</strong> Fans, LED lights, routers, aur electronics ka majmooi load.</li>
          </ol>

          <div className={styles.formulaBox}>
            Backup Time (Hours) = [Voltage (V) × Capacity (Ah) × Safe DoD (%) × Inverter Efficiency (%)] / Connected Load (Watts)
          </div>

          <h3>Practical Example: 12V 200Ah Tall Tubular Battery</h3>
          <p>
            Agar aapke pas ek <strong>12V 200Ah Tall Tubular Battery</strong> (maslan AGS SP-2000, Phoenix TX-1800/2500, ya Volta T-1800) hai:
          </p>
          <ul>
            <li><strong>Nominal Capacity:</strong> 12V × 200Ah = <strong>2,400 Watt-hours (Wh)</strong></li>
            <li><strong>Safe Usable Capacity (70% DoD):</strong> 2,400 Wh × 0.70 = <strong>1,680 Wh</strong></li>
            <li><strong>Net Inverter Output (85% Efficiency):</strong> 1,680 Wh × 0.85 = <strong>1,428 usable Wh</strong></li>
          </ul>
          <p>
            Agar aap is par <strong>2 Ceiling Fans (160W) + 4 LED Bulbs (48W) + 1 WiFi Router (15W) = 223 Watts</strong> chalate hain:
          </p>
          <div className={styles.formulaBox}>
            Backup = 1,428 Wh / 223 Watts = 6.40 Hours (~6 Hours 24 Minutes)
          </div>

          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

          <h2>Battery Runtime Comparison Table (Pakistani Household Loads)</h2>
          <p>
            Neeche diye gaye table mein standard 12V Tall Tubular batteries ke real-world backup times ka mawazna diya gaya hai (assuming 70% DoD &amp; 85% Inverter Efficiency):
          </p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Battery Capacity</th>
                <th>Safe Usable (Wh)</th>
                <th>Light Load (150W)<br /><small>1 Fan + 3 Lights + WiFi</small></th>
                <th>Medium Load (300W)<br /><small>2 Fans + 6 Lights + TV</small></th>
                <th>Heavy Load (600W)<br /><small>3 Fans + Fridge/Desktop</small></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>100 Ah (12V)</strong></td>
                <td>714 Wh</td>
                <td>4 hrs 45 mins</td>
                <td>2 hrs 20 mins</td>
                <td>1 hr 10 mins</td>
              </tr>
              <tr>
                <td><strong>150 Ah (12V)</strong></td>
                <td>1,071 Wh</td>
                <td>7 hrs 05 mins</td>
                <td>3 hrs 30 mins</td>
                <td>1 hr 45 mins</td>
              </tr>
              <tr>
                <td><strong>180 Ah (12V)</strong></td>
                <td>1,285 Wh</td>
                <td>8 hrs 30 mins</td>
                <td>4 hrs 15 mins</td>
                <td>2 hrs 08 mins</td>
              </tr>
              <tr>
                <td><strong>200 Ah (12V)</strong></td>
                <td>1,428 Wh</td>
                <td>9 hrs 30 mins</td>
                <td>4 hrs 45 mins</td>
                <td>2 hrs 22 mins</td>
              </tr>
              <tr>
                <td><strong>230 Ah (12V)</strong></td>
                <td>1,642 Wh</td>
                <td>10 hrs 55 mins</td>
                <td>5 hrs 28 mins</td>
                <td>2 hrs 44 mins</td>
              </tr>
            </tbody>
          </table>

          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

          <h2>NEPRA Protected Slab Warning: UPS Recharge Units Ka Asar</h2>
          <p>
            K-Electric aur WAPDA distribution companies (LESCO, IESCO, MEPCO) ke sarfeen ke liye sab se bara khatra{' '}
            <strong>200-Unit Protected Slab Cliff</strong> hai.
          </p>
          <p>
            Agar aapki 200Ah battery din mein do martaba charge hoti hai (2 load shedding cycles), to yeh rozana taqreeban{' '}
            <strong>2.0 se 2.5 units (kWh)</strong> bijli consume karti hai. Mahana hisab se yeh{' '}
            <strong>60 se 75 units</strong> bante hain!
          </p>
          <p>
            Agar aapka aam consumption 170 units hai, to UPS ki recharge units aapko seedha <strong>235 units</strong> par pohancha
            degi. Iska nateeja yeh hoga ke aapka meter protected slab (Rs 16.5/unit) se nikal kar unprotected slab (Rs 42+/unit) mein
            chala jaye ga, aur bill foran Rs 3,000 se barh kar Rs 11,000+ ho jaye ga!
          </p>

          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

          <h2>Frequently Asked Questions (FAQs)</h2>
          <div className={styles.faqSection}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={18} color="#00f0ff" />
                <span>Q1: 200Ah battery par 1.5 ton ya 1 ton Inverter AC chal sakta hai?</span>
              </div>
              <div className={styles.faqAnswer}>
                Ek single 12V 200Ah battery par 1-Ton Inverter AC chalana munasib nahi hai. Inverter AC eco mode mein bhi 700W–900W DC
                current draw karta hai (taqreeban 70 to 80 Amperes from 12V battery). Itne bhari current se battery sirf 1 se 1.5 ghanta chalegi
                aur plate overheating aur rapid degradation ka shikar ho jaye gi. AC chalane ke liye kam az kam 48V solar hybrid bank (4 batteries ya Lithium pack) zaroori hai.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={18} color="#00f0ff" />
                <span>Q2: Tall Tubular battery vs Normal Liquid Lead-Acid mein kia faraq hai?</span>
              </div>
              <div className={styles.faqAnswer}>
                Normal car/automotive batteries mein flat thin plates hoti hain jo short high-cranking current ke liye design hoti hain; deep discharge se unke plates warp ho jati hain. Tall tubular batteries mein gauntlet tubes ke andar active material pack hota hai, jo 70% deep discharge aur 1,200+ cycles bardasht karta hai, is liye yeh Pakistani load-shedding ke liye best hain.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={18} color="#00f0ff" />
                <span>Q3: Battery ko full charge hone mein kitne ghante lagte hain?</span>
              </div>
              <div className={styles.faqAnswer}>
                Agar aapka UPS charger 15 Amperes current deta hai, to 70% discharged 200Ah battery ko mukammal recharge hone mein taqreeban 10 se 11 ghante lagte hain (chemical efficiency aur trickle absorption charge ke sath). Agar 25A fast charger ho, to taqreeban 6.5 se 7 ghante lagte hain.
              </div>
            </div>
          </div>

          {/* PWA Integration CTA */}
          <div className={styles.pwaBox}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <ShieldCheck size={18} />
                <span>Camera OCR Verification</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.4rem 0' }}>
                Track Recharge Units with Read Meter AI Scanner
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Do not let UPS recharge push your meter past the 200-unit protected threshold. Snap your digital or analog electric meter with Read Meter&apos;s camera scanner to track daily kWh burn rate.
              </p>
            </div>
            <Link
              href="/guest"
              className={styles.navBtnPrimary}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.8rem 1.4rem',
                fontSize: '0.95rem',
              }}
            >
              <Camera size={18} />
              <span>Launch Free Scanner</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}
