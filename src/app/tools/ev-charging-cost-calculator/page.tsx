import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './evCalculator.module.css'
import EvChargingCostCalculator from './EvChargingCostCalculator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Camera,
} from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'EV & Electric Bike Charging Cost Calculator Pakistan (2026) | Read Meter',
  description:
    'Calculate exact electric car and e-bike charging costs in Pakistan. Compute units (kWh) consumed, cost per full charge, cost per kilometer vs petrol, and slab impact for K-Electric, LESCO, IESCO, and MEPCO.',
  keywords: [
    'ev charging cost calculator pakistan',
    'electric bike charging units consumed kwh electricity bill',
    'e bike charging cost per km vs petrol pakistan',
    'yadea metro e bike charging units electricity bill',
    'deepal mg4 byd electric car charging cost k electric iesco lesco',
    'home ev charger 7kw peak off-peak units calculation',
    'solar charging cost ev pakistan',
    'electric scooter charging time and bill calculator',
    'honri ve gigi ev charging cost pakistan',
    'read meter ev calculator',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/ev-charging-cost-calculator`,
  },
  openGraph: {
    title: 'EV & Electric Bike Charging Cost Calculator Pakistan | Read Meter',
    description:
      'Stop guessing your vehicle charging bill. Calculate precise units, cost per KM, and fuel savings for E-bikes (Yadea, Crown) and EVs (Deepal, BYD, Honri Ve) under NEPRA tariffs.',
    url: `${siteUrl}/tools/ev-charging-cost-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EV & Electric Bike Charging Cost Calculator Pakistan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV & Electric Bike Charging Cost Calculator Pakistan | Read Meter',
    description:
      'Calculate exact charging units, cost per KM, and monthly petrol savings for E-bikes and EVs across Pakistani power companies.',
    images: ['/og-image.png'],
  },
}

export default function EvChargingCostCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/tools/ev-charging-cost-calculator#app`,
        name: 'EV & Electric Bike Charging Cost Calculator Pakistan',
        url: `${siteUrl}/tools/ev-charging-cost-calculator`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Free online EV and Electric Bike charging cost calculator for Pakistan. Computes units consumed from the meter, total charge cost, cost per kilometer, and comparison with petrol vehicles under NEPRA domestic and peak/off-peak tariffs.',
      },
      {
        '@type': 'HowTo',
        '@id': `${siteUrl}/tools/ev-charging-cost-calculator#howto`,
        name: 'How to Calculate EV & E-Bike Charging Cost & Units in Pakistan',
        description:
          'Step-by-step mathematical formula to calculate electric vehicle charging units and electricity bill cost taking charger losses into account.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Identify Battery Pack Capacity in Kilowatt-Hours (kWh)',
            text: 'For electric bikes, multiply battery Voltage by Ampere-hours and divide by 1,000 (e.g. 72V × 20Ah = 1,440 Wh = 1.44 kWh). For electric cars, read the battery pack rating (e.g. 18.6 kWh for Honri Ve, 66.8 kWh for Deepal S07).',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Factor In AC-to-DC Charger Conversion Losses',
            text: 'Home chargers are not 100% efficient due to heat and power factor. Slow portable chargers operate at ~84-88% efficiency, while 7 kW AC wallboxes operate at ~90-92% efficiency. Divide required battery kWh by the charger efficiency (e.g. 1.44 kWh / 0.85 = 1.69 units consumed from your utility meter).',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Multiply by Your Utility Tariff Rate (PKR / kWh)',
            text: 'Multiply total units consumed from the meter by your domestic tariff slab or TOU rate (e.g. 1.69 units × Rs 35/unit = Rs 59.15 for a full charge).',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Calculate Per-Kilometer Driving Cost',
            text: 'Divide the full charge cost by the real-world driving range (e.g. Rs 59.15 / 60 km = Rs 0.98 per kilometer).',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/tools/ev-charging-cost-calculator#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Electric bike (E-bike) full charge karne me kitne units bijli lagti hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pakistan me aam tor par chalne wali E-bikes (jaise Yadea, Metro, Crown, Super Star) me 60V 20Ah ya 72V 20Ah ki battery hoti hai jo takreeban 1.2 se 1.44 kWh banti hai. Charger ki 15% conversion heat loss ko shamil kar ke, ek mukammal (0% se 100%) charge par sirf 1.4 se 1.7 units (kWh) bijli kharch hoti hai. Agar aapka rate Rs 35/unit hai to ek full charge sirf Rs 50 se 60 me ho jata hai jo 50-60 km chalti hai!',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does it cost to charge an electric car (EV) at home in Pakistan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Compact city electric cars (jaise Honri Ve ya GiGi EV - 18.6 kWh battery) ko ghar par full charge karne me approx 20 units bijli lagti hai jiski cost Rs 700 se Rs 850 aati hai (180 km range). Badi passenger EVs (jaise Deepal S07 ya BYD Atto 3 - 60 to 66 kWh battery) ko full charge karne me 66 se 73 units lagte hain jiski cost off-peak hours me Rs 2,500 se Rs 2,800 aati hai (400+ km range).',
            },
          },
          {
            '@type': 'Question',
            name: 'Does charging an EV or e-bike at home breach NEPRA protected slab?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Haan! Yeh bohot eham nuqta hai. Agar aapka ghar abhi protected slab (<200 units/mahina) me hai, to ek e-bike charge karne se mahana 35 se 50 units add hote hain, aur electric car se 250 se 500 units add hote hain. Agar total reading 200 units se 1 unit bhi upar gayi, to aglay 6 mahine ke liye protected status khatam ho jata hai aur ghar ke tamam units ka rate Rs 22 se jump karke Rs 35-43 ho jata hai. Isliye EV charging ke liye dedicated sub-meter lagana aur Read Meter camera scanner se track karna zaroori hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'Electric bike vs 70cc Petrol Bike: Cost per kilometer me kitna farq hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Petrol Rs 260/liter par 70cc bike 45 km/L deti hai, jiski cost Rs 5.78 per kilometer aati hai. Jabkay E-Bike par per kilometer cost sirf Rs 0.80 se Rs 1.10 aati hai! Yaani har 1 kilometer par approx Rs 4.80 ki seedhi bachat hoti hai. Mahana 1,000 km commute par E-bike Rs 4,800 se Rs 5,500 tak petrol ke paise bachati hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'Should I charge my EV during peak hours or off-peak hours on a 3-phase meter?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Always charge during off-peak hours (rat 10 baje se agle din sham 6 baje tak). 3-phase meters par peak hours (sham 6 se rat 10 baje) ka rate Rs 58/unit se zyada hota hai, jabkay off-peak rate ~Rs 38/unit hota hai. Raat ko charge karne se aapko har unit par Rs 20 ki bachat hoti hai jo badi EV ke liye mahana Rs 6,000 se Rs 12,000 ki bachat banti hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I accurately track EV charging units separately from household appliances?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Apne vehicle charger point par ek digital sub-meter install karwayein. Phir Read Meter PWA (readmeter.online) ka camera scanner use kar ke regular readings snap karein. Read Meter OCR automatically units calculate karta hai taake aapko pata rahe ke vehicle ne kitne units kharch kiye aur ghar ka normal load kitna raha.',
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

      {/* Navigation Header */}
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '1rem' }}>
        <Navbar maxWidth="1100px" />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Vehicle Energy Engine 2026</span>
        </div>
        <h1 className={styles.heroTitle}>
          EV & E-Bike <span>Charging Cost</span> Calculator
        </h1>
        <p className={styles.heroSubtitle}>
          Calculate exact electricity units (kWh) consumed, cost per full charge, per-kilometer running expense,
          and monthly fuel savings vs petrol for electric bikes and cars in Pakistan.
        </p>
      </section>

      {/* Main Interactive Calculator */}
      <main className={styles.mainContent}>
        <EvChargingCostCalculator />

        {/* Deep SEO & Educational Guide Section */}
        <section className={styles.guideSection}>
          <h2>Electric Vehicle Charging Math in Pakistan: Complete 2026 Guide</h2>
          <p>
            With petrol hovering at <strong>Rs 260–280 per liter</strong>, electric two-wheelers (Yadea, Metro, Crown,
            Road Prince) and passenger electric vehicles (Honri Ve, GiGi EV, Deepal S07, BYD Atto 3, MG4) offer
            game-changing savings for Pakistani commuters.
          </p>
          <p>
            However, calculating the true running cost requires understanding <strong>AC-to-DC conversion efficiency</strong>,
            <strong>NEPRA domestic tariff slabs</strong>, and the dreaded <strong>200-unit protected slab penalty cliff</strong>.
          </p>

          <div className={styles.formulaBox}>
            Units Billed at Meter (kWh) = Battery Energy Added (kWh) ÷ Charger AC-to-DC Efficiency
            <br />
            Cost Per Kilometer (PKR) = (Total Units Consumed × Tariff Rate) ÷ Real-World Range (km)
          </div>

          <h3>Why Charger Efficiency Matters: The 15% Heat Loss</h3>
          <p>
            When you plug an electric bike or EV into a 220V wall socket, the on-board charger or external adapter must
            rectify AC alternating grid current into DC direct current to fill the chemical battery cells.
          </p>
          <ul>
            <li>
              <strong>Slow Portable Adapters (E-Bikes):</strong> Operate at roughly <strong>82% to 86% efficiency</strong>.
              If your battery requires 1.20 kWh of direct energy, the meter actually records approximately <strong>1.41 to 1.46 kWh</strong>.
            </li>
            <li>
              <strong>Home Wallbox AC Chargers (7.0 kW):</strong> High-grade Level 2 wallboxes achieve <strong>90% to 92% efficiency</strong>.
            </li>
            <li>
              <strong>DC Fast Chargers (Motorway Stations):</strong> Provide direct high-voltage DC to the battery, achieving <strong>93% to 95% efficiency</strong>, but at a premium commercial tariff (~Rs 75/kWh).
            </li>
          </ul>

          <h3>Side-by-Side Comparison: Electric vs Petrol Running Costs (Pakistan)</h3>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Vehicle Type</th>
                <th>Energy Capacity</th>
                <th>Real Range</th>
                <th>Cost Per Full Tank / Charge</th>
                <th>Running Cost / KM</th>
                <th>Monthly Fuel Cost (1,000 km)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>70cc Petrol Bike</strong></td>
                <td>9 Liter Tank (Rs 260/L)</td>
                <td>~45 km / Liter</td>
                <td>Rs 2,340</td>
                <td><strong>Rs 5.78 / km</strong></td>
                <td>Rs 5,780</td>
              </tr>
              <tr>
                <td><strong>E-Bike (Yadea / Metro)</strong></td>
                <td>1.44 kWh Battery</td>
                <td>~60 km</td>
                <td>Rs 59 (at Rs 35/unit)</td>
                <td><strong style={{ color: '#00f0ff' }}>Rs 0.98 / km</strong></td>
                <td><strong style={{ color: '#10b981' }}>Rs 980 (Save Rs 4,800!)</strong></td>
              </tr>
              <tr>
                <td><strong>1.3L Petrol Sedan / Hatch</strong></td>
                <td>35 Liter Tank (Rs 260/L)</td>
                <td>~12 km / Liter</td>
                <td>Rs 9,100</td>
                <td><strong>Rs 21.67 / km</strong></td>
                <td>Rs 21,670</td>
              </tr>
              <tr>
                <td><strong>Honri Ve / Mini EV</strong></td>
                <td>18.6 kWh LFP</td>
                <td>~180 km</td>
                <td>Rs 723 (at Rs 35/unit)</td>
                <td><strong style={{ color: '#00f0ff' }}>Rs 4.02 / km</strong></td>
                <td><strong style={{ color: '#10b981' }}>Rs 4,020 (Save Rs 17,650!)</strong></td>
              </tr>
              <tr>
                <td><strong>Deepal S07 / BYD Atto 3</strong></td>
                <td>60.5–66.8 kWh</td>
                <td>~420 km</td>
                <td>Rs 2,540 (at Rs 38 off-peak)</td>
                <td><strong style={{ color: '#00f0ff' }}>Rs 6.05 / km</strong></td>
                <td><strong style={{ color: '#10b981' }}>Rs 6,050 (Save Rs 15,620!)</strong></td>
              </tr>
            </tbody>
          </table>

          <h3>The NEPRA 200-Unit Protected Slab Trap</h3>
          <p>
            Under NEPRA regulations, households consuming under 200 units enjoy the subsidized protected tariff (~Rs 22/kWh
            including taxes). If your monthly home consumption is 170 units and you purchase an electric bike that adds 40
            units of charging per month, your total reaches <strong>210 units</strong>.
          </p>
          <p>
            <strong>The consequence is severe:</strong> Breaching 200 units by just 10 units terminates your protected status
            for <strong>6 consecutive months</strong>, forcing every single kilowatt-hour in your home to be billed at
            unprotected rates (Rs 35–43/unit), inflating your bill by <strong>Rs 4,000 to Rs 8,000+</strong>!
          </p>
          <p>
            <strong>Solution:</strong> If you live in a protected household, install a separate dedicated utility connection
            or digital sub-meter for vehicle charging, or utilize daytime solar generation.
          </p>

          {/* FAQ Accordion */}
          <div className={styles.faqSection}>
            <h2>Frequently Asked Questions (FAQs)</h2>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={20} color="#00f0ff" />
                <span>Electric bike full charge hone me kitne units bijli leti hai?</span>
              </div>
              <div className={styles.faqAnswer}>
                Pakistan me regular 72V 20Ah ya 60V 20Ah E-bikes (Yadea, Metro, Crown) full charge hone me sirf 1.4 se 1.7 units
                (kWh) bijli leti hain. Rs 35/unit ke hisab se yeh kharcha sirf Rs 50 se Rs 60 banta hai, aur bike 50 se 60 km chal jati hai.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={20} color="#00f0ff" />
                <span>Can I charge my electric car with a normal 3-pin 15A home socket?</span>
              </div>
              <div className={styles.faqAnswer}>
                Yes, mini EVs (Honri Ve, GiGi EV) and most full-size EVs come with a portable emergency charger (10A to 15A,
                delivering 2.2 kW to 3.3 kW) that plugs into a standard 15A wall socket with proper earthing. However, for
                safety and faster charging (6 to 8 hours), installing a dedicated 7.0 kW AC wallbox with separate copper wiring
                and circuit breaker is strongly recommended.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={20} color="#00f0ff" />
                <span>What are the best hours to charge an EV on a 3-phase meter?</span>
              </div>
              <div className={styles.faqAnswer}>
                Always charge during <strong>Off-Peak Hours (10:00 PM to 6:00 PM next day)</strong>. Peak evening hours
                (6:00 PM to 10:00 PM in winter / 7:00 PM to 11:00 PM in summer) carry heavy penalty tariffs (~Rs 58/unit).
                Setting your car charger timer for midnight saves over 35% on every charging session.
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={20} color="#00f0ff" />
                <span>How can I charge my electric vehicle for free with Solar Net Metering?</span>
              </div>
              <div className={styles.faqAnswer}>
                If you have a 5kW to 10kW on-grid solar system with net metering, set your EV to charge during peak sunlight
                hours (10:00 AM to 3:00 PM). The solar panels directly power the charger without pulling from the grid,
                effectively giving you zero-cost driving!
              </div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                <HelpCircle size={20} color="#00f0ff" />
                <span>How can I monitor EV charging units so it doesn&apos;t mix with home consumption?</span>
              </div>
              <div className={styles.faqAnswer}>
                Install an inexpensive DIN-rail digital sub-meter on your charger circuit. You can then use the{' '}
                <strong>Read Meter PWA camera scanner</strong> to snap the sub-meter once a week to monitor exact units
                consumed without any manual logbook keeping.
              </div>
            </div>
          </div>

          {/* PWA Feature Banner */}
          <div className={styles.pwaBox}>
            <div style={{ maxWidth: '620px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <ShieldCheck size={18} />
                <span>On-Device Camera Scanner</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '0.4rem 0' }}>
                Track Your Electric Sub-Meter with 1-Click OCR
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Never guess your vehicle charging consumption. Point your phone camera at your digital sub-meter or main
                utility meter, and Read Meter automatically records the kWh count and calculates running monthly costs.
              </p>
            </div>
            <Link
              href="/guest"
              className={styles.navBtnPrimary}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.6rem',
                fontSize: '1rem',
              }}
            >
              <Camera size={20} />
              <span>Launch Camera Scanner</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
