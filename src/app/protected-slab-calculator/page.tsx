import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './calculator.module.css'
import ProtectedSlabCalculator from './ProtectedSlabCalculator'
import { Zap, ShieldCheck, ArrowRight, BookOpen, AlertOctagon, HelpCircle } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: '200 Unit Protected Slab Calculator 2026 | K-Electric, IESCO, LESCO Bill Check',
  description:
    'Free online 200 Unit Protected Slab Calculator for Pakistan. Calculate your electricity bill under NEPRA tariffs for K-Electric, IESCO, LESCO, FESCO, MEPCO and avoid the costly 201-unit penalty cliff.',
  keywords: [
    '200 unit protected slab calculator',
    'electricity bill calculator pakistan 2026',
    'k electric 200 unit protected slab',
    'protected vs unprotected electricity slab pakistan',
    'iesco protected slab calculator',
    'lesco meter reading bill calculator',
    'nepra electricity tariff 2026',
    'bijli bill calculation formula',
    '200 unit electricity bill kelectric',
    'meter reading check online',
  ],
  alternates: {
    canonical: `${siteUrl}/protected-slab-calculator`,
  },
  openGraph: {
    title: '200 Unit Protected Slab Calculator | Avoid Double Electricity Bills in Pakistan',
    description:
      'Check if your meter reading is in the 200-unit safe zone. Calculate your live bill under NEPRA tariffs for K-Electric, IESCO, LESCO, and FESCO.',
    url: `${siteUrl}/protected-slab-calculator`,
    siteName: 'Read Meter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '200 Unit Protected Slab Calculator Pakistan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '200 Unit Protected Slab Calculator | Read Meter',
    description:
      'Calculate electricity bill slabs, check protected status, and avoid the 201 unit cliff across all Pakistan DISCOs.',
    images: ['/og-image.png'],
  },
}

export default function ProtectedSlabCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/protected-slab-calculator#app`,
        name: '200 Unit Protected Slab Calculator',
        url: `${siteUrl}/protected-slab-calculator`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Online utility calculator for Pakistani domestic electricity consumers to calculate bills under NEPRA protected and unprotected slab rates.',
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/protected-slab-calculator#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Pakistan mein 200 Unit Protected Slab Rule kia hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'NEPRA ke qawaneen ke mutabiq agar aap ka gharelu bijli meter lagataar pichle 6 maheeno tak 200 units ya is se kam rehta hai, to aap ko Protected Consumer ka darja milta hai jismein subsidized rate (Rs 7.74 se Rs 14.95/unit) laagu hota hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'Agar meter 201 units par chala jaye to kitna bill barh jata hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Agar kisi aik maheene bhi aap ka meter 200 units cross kar ke 201 units par pohanch jaye, to aap Protected status se nikal kar Unprotected status mein chale jate hain. Bill foran taqreeban Rs 4,200 se barh kar Rs 8,850+ ho jata hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'Protected status dobara kaise haasil hota hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Dobara Protected status haasil karne ke liye aap ko lagataar aglay 6 maheeno tak apna mahana consumption 200 units ke andar rakhna parhta hai.',
            },
          },
          {
            '@type': 'Question',
            name: 'K-Electric, IESCO, aur LESCO ke protected slabs mein kia farq hai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Base tariff NEPRA ki taraf se poore Pakistan (K-Electric, IESCO, LESCO, FESCO, MEPCO) ke liye aik jaisa hota hai, lekin Fuel Price Adjustment (FPA) aur local electricity duties mein mamooli farq hota hai.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className={styles.pageContainer}>
      {/* JSON-LD Rich Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Zap size={28} color="#00F0FF" />
          <span>READ METER</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navBtn}>
            Home
          </Link>
          <Link href="/blog" className={styles.navBtn}>
            📖 Blog
          </Link>
          <Link href="/guest" className={styles.navBtnPrimary}>
            ⚡ Instant Meter Scanner
          </Link>
        </nav>
      </header>

      {/* Hero Header */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <ShieldCheck size={16} />
          NEPRA 2026 TARIFF REGULATION
        </div>
        <h1 className={styles.heroTitle}>
          200 Unit <span>Protected Slab</span> Calculator
        </h1>
        <p className={styles.heroSubtitle}>
          K-Electric, IESCO, LESCO, FESCO aur MEPCO ke liye apna mahana bijli bill foran calculate karein aur 201 units ke double bill shock se bachein.
        </p>
      </section>

      {/* Interactive Calculator App */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ProtectedSlabCalculator />
      </main>

      {/* Deep Rich Content for Google SEO */}
      <article className={styles.contentSection}>
        {/* Section 1: The 200-Unit Cliff Explained */}
        <div className={styles.articleCard}>
          <h2 className={styles.sectionTitle}>
            ⚡ Pakistan Mein 200 Unit Protected Slab Rule Kia Hai?
          </h2>
          <p className={styles.paragraph}>
            Pakistan mein <strong>NEPRA (National Electric Power Regulatory Authority)</strong> ke naye tariff structure ke tehat gharelu (residential) bijli ke sarfeen ko do ahem hisson mein taqseem kiya gaya hai: <strong>Protected Consumers</strong> aur <strong>Unprotected Consumers</strong>.
          </p>
          <p className={styles.paragraph}>
            <strong>Protected Consumers:</strong> Woh gharelu sarfeen jinka bijli ka istemal pichle <strong>lagataar 6 maheeno</strong> tak har maheene 200 units ya is se kam raha ho. In sarfeen ko hakoomat ki taraf se bhari subsidy di jati hai jisse unka base unit rate sirf <strong>Rs 7.74 se Rs 14.95</strong> rehta hai.
          </p>
          <p className={styles.paragraph}>
            <strong>Unprotected Consumers:</strong> Agar kisi bhi maheene aap ka meter <strong>201 units</strong> par chala jata hai, to aap ki subsidy foran khatam ho jati hai aur aglay 6 maheeno ke liye aap unprotected category mein shift ho jate hain jahan unit rate <strong>Rs 34 se Rs 42+</strong> tak pohanch jata hai.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.tariffTable}>
              <thead>
                <tr>
                  <th>Slab Category</th>
                  <th>Units Range</th>
                  <th>Protected Base Rate</th>
                  <th>Unprotected Base Rate</th>
                  <th>Estimated Bill</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1 - 100 Units</strong></td>
                  <td>1 to 100 kWh</td>
                  <td style={{ color: '#34d399', fontWeight: 700 }}>Rs 7.74 / unit</td>
                  <td style={{ color: '#f87171' }}>Rs 16.48 / unit</td>
                  <td>~Rs 900 vs ~Rs 2,100</td>
                </tr>
                <tr>
                  <td><strong>101 - 200 Units</strong></td>
                  <td>101 to 200 kWh</td>
                  <td style={{ color: '#34d399', fontWeight: 700 }}>Rs 14.95 / unit</td>
                  <td style={{ color: '#f87171' }}>Rs 22.95 / unit</td>
                  <td>~Rs 4,200 vs ~Rs 6,800</td>
                </tr>
                <tr>
                  <td><strong>201 - 300 Units</strong></td>
                  <td>201 to 300 kWh</td>
                  <td style={{ color: '#94a3b8' }}>N/A (Subsidized Exit)</td>
                  <td style={{ color: '#f87171', fontWeight: 800 }}>Rs 34.26 / unit</td>
                  <td style={{ color: '#ef4444', fontWeight: 800 }}>~Rs 8,850+ (Cliff Jump)</td>
                </tr>
                <tr>
                  <td><strong>301 - 700+ Units</strong></td>
                  <td>Above 300 kWh</td>
                  <td style={{ color: '#94a3b8' }}>N/A</td>
                  <td style={{ color: '#f87171', fontWeight: 800 }}>Rs 39.15 - 42.10 / unit</td>
                  <td>~Rs 15,000 to Rs 35,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: 5 Actionable Tips to Stay Under 200 Units */}
        <div className={styles.articleCard}>
          <h2 className={styles.sectionTitle}>
            🛡️ 200 Units Ke Andar Rehne Ke 5 Asaan Tareeqay
          </h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7 }}>
            <li>
              <strong>1. Rozana Meter Dial Reading Record Karein:</strong> Mahana 200 units ka matlab hai rozana ka average <strong>6.6 units</strong> se kam hona chahiye. Read Meter ke zariye rozana subah camera se scan karke apna consumption track karein.
            </li>
            <li>
              <strong>2. Refrigerator Thermostat Setting:</strong> Fridge ka thermostat 3 ya 4 number par set karein. Zyada chilling par rakhne se fridge 2 se 3 units rozana faaltu leta hai.
            </li>
            <li>
              <strong>3. Inverter AC Temperature 26°C Par Rakhein:</strong> Har 1 degree temperature barhane se taqreeban 6% bijli ki bachat hoti hai.
            </li>
            <li>
              <strong>4. Iron (Istri) aur Washing Machine ka Time Manage Karein:</strong> In heavy appliances ko off-peak hours mein istemal karein.
            </li>
            <li>
              <strong>5. Standby Power (Phantom Load) Khatam Karein:</strong> TV, set-top boxes, chargers, aur microwaves ko switch se band karein jab istemal mein na hon.
            </li>
          </ul>
        </div>

        {/* Section 3: Frequently Asked Questions */}
        <div className={styles.articleCard}>
          <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HelpCircle size={28} color="#00F0FF" />
            <span>Aksar Poochay Janay Walay Sawalat (FAQs)</span>
          </h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Q1: Pakistan mein 200 unit protected slab ka faida kis tarah milta hai?
            </h3>
            <p className={styles.faqAnswer}>
              Agar aap ke ghar ka meter pichle 6 lagataar maheeno mein kisi bhi aik maheene bhi 200 units cross na kare to aap ko protected subsidy rate milta hai jisse aap ka mahana bill aam tor par Rs 4,200 se kam rehta hai.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Q2: Agar meter 201 units par chala jaye to kia dobara aglay maheene subsidy mil sakti hai?
            </h3>
            <p className={styles.faqAnswer}>
              Nahi. Agar kisi aik maheene bhi 200 units cross ho jayen to subsidy khatam ho jati hai. Dobara protected slab haasil karne ke liye aglay 6 maheeno tak lagataar har maheene 200 units ke andar rehna lazmi hai.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Q3: Read Meter website par meter reading scan kaise karein?
            </h3>
            <p className={styles.faqAnswer}>
              Aap hamari website par ja kar <Link href="/guest" style={{ color: '#00f0ff', textDecoration: 'underline' }}>Instant Meter Scanner</Link> par click karein, apne camera se meter ka dial photo lein, aur hamara AI foran units aur live bill compute kar ke screen par dikha dega.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Q4: Kya yeh calculator K-Electric aur WAPDA dono ke liye theek hai?
            </h3>
            <p className={styles.faqAnswer}>
              Jee haan! Yeh calculator K-Electric (Karachi), IESCO (Islamabad), LESCO (Lahore), FESCO (Faisalabad), aur MEPCO (Multan) ke current active NEPRA tariffs ke mutabiq design kiya gaya hai.
            </p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Read Meter (readmeter.online) — Pakistan&apos;s Smart Electricity & Sub-meter Tracking Platform.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          Tariff calculations are based on NEPRA gazette notifications and standard DISCO billing rules.
        </p>
      </footer>
    </div>
  )
}
