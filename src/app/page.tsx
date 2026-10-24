import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import styles from './landing.module.css'
import { Zap, Camera, TrendingUp, Key, ChevronRight, Wrench } from 'lucide-react'
import InstantMeterCheckWidget from '@/components/InstantMeterCheckWidget'
import ToolsGrid from '@/app/tools/ToolsGrid'

// Helper function to calculate the start of the current billing cycle
function getBillingCycleStart(startDay: number): Date {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() // 0-indexed (Jan = 0)
  if (now.getDate() < startDay) {
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
  }
  return new Date(year, month, startDay, 0, 0, 0, 0)
}

export default async function LandingPage() {
  const cookieStore = await cookies()
  const hasAuthCookie = cookieStore.getAll().some(
    (c) => c.name.includes('-auth-token') || c.name.startsWith('sb-')
  )

  let user = null
  let activeMeter = null
  let latestReadingValue: number | null = null
  let readings: any[] = []
  
  // K-Electric slab calculation variables
  let limit = 200
  let currentUsage = 0
  let daysRemaining = 30
  let dailyAverage = 0
  let projectedUsage = 0

  if (hasAuthCookie) {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    if (user) {
    const { data: meters } = await supabase
      .from('meters')
      .select('*')
      .eq('profile_id', user.id)

    if (meters && meters.length > 0) {
      activeMeter = meters[0]
      limit = Number(activeMeter.max_usage_limit) || 200
      
      const { data: fetchedReadings } = await supabase
        .from('readings')
        .select('*')
        .eq('meter_id', activeMeter.id)
        .order('created_at', { ascending: false })

      readings = fetchedReadings || []
      const latestReading = readings[0]

      if (readings.length > 0) {
        latestReadingValue = Number(latestReading.reading_value)
      }

      // Calculate monthly slab metrics
      // 1. Search for the latest reading with is_billing_reset = true
      const baselineReading = readings.find((r) => r.is_billing_reset === true)
      
      let billingCycleStart: Date
      if (baselineReading) {
        billingCycleStart = new Date(baselineReading.created_at)
      } else {
        // Fallback to fixed day setting
        billingCycleStart = getBillingCycleStart(activeMeter.billing_cycle_start_day)
      }
      
      let nextReset: Date
      if (activeMeter.next_reading_date) {
        const [year, month, day] = activeMeter.next_reading_date.split('-').map(Number)
        nextReset = new Date(year, month - 1, day, 23, 59, 59, 999)
      } else {
        nextReset = new Date(billingCycleStart)
        nextReset.setMonth(nextReset.getMonth() + 1)
      }
      const diffTime = nextReset.getTime() - new Date().getTime()
      daysRemaining = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0)

      if (latestReading) {
        if (baselineReading) {
          currentUsage = Number(latestReading.reading_value) - Number(baselineReading.reading_value)
        } else if (readings.length > 1) {
          const oldestReading = readings[readings.length - 1]
          currentUsage = Number(latestReading.reading_value) - Number(oldestReading.reading_value)
        }
      }
      currentUsage = Math.max(currentUsage, 0)

      // Calculate daily average consumption based on days elapsed in the current cycle
      const daysElapsed = (new Date().getTime() - billingCycleStart.getTime()) / (1000 * 60 * 60 * 24)
      const durationDays = Math.max(daysElapsed, 1.0) // Minimum 1 day to prevent division-by-zero or spikes
      dailyAverage = currentUsage / durationDays

      projectedUsage = currentUsage + (dailyAverage * daysRemaining)
    }
  }
}

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Zap className={styles.logoIcon} size={28} fill="var(--primary)" />
          <span className={styles.logoText}>
            Read<span>Meter</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link
            href="/tools"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
            }}
          >
            <Wrench size={14} /> Tools Hub <span style={{ fontSize: '0.72rem', background: '#2563eb', color: '#ffffff', padding: '1px 6px', borderRadius: '999px', fontWeight: 800 }}>15</span>
          </Link>
          <Link
            href="/protected-slab-calculator"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
            }}
          >
            ⚡ Slab Calculator
          </Link>
          <Link
            href="/blog"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 500,
            }}
          >
            Blog
          </Link>
          {user ? (
            <Link href="/dashboard" className="glow-btn-solid" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.86rem' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/guest" className="glow-btn" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.86rem' }}>
                ⚡ Guest Sandbox
              </Link>
              <Link href="/login" className="glow-btn-accent" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.86rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={`${styles.badge} fade-in`}>⚡ The iLovePDF for Utilities • 15 Free In-Browser Tools</div>
        <h1 className={`${styles.title} fade-in`}>
          Every Utility Tool You Need, <span>In One Place</span>
        </h1>
        <p className={`${styles.description} fade-in`}>
          100% Free, Private &amp; In-Browser. Scan meters with AI camera OCR, calculate AC &amp; appliance power costs, split tenant bills, and size solar systems — zero signup required.
        </p>

        {user && activeMeter && (
          <div className="glass-panel fade-in" style={{
            width: '100%',
            maxWidth: '780px',
            margin: '0 auto',
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px', border: '1px solid #bfdbfe' }}>
                  Active Meter
                </span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  #{activeMeter.meter_number}
                </span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#475569' }}>
                Usage: <strong style={{ color: currentUsage >= 200 ? '#dc2626' : '#059669' }}>{currentUsage.toFixed(0)} kWh</strong> ({currentUsage >= 200 ? 'Unprotected Slab' : 'Protected 200 Slab'}) • <strong>{daysRemaining}d</strong> left in cycle
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/dashboard" className="glow-btn-solid" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.88rem' }}>
                Open Full Dashboard <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Primary Eye-Level Section: The 15 Utility Tools Hub (iLovePDF Style) */}
        <section style={{ width: '100%', margin: '0.5rem 0 1.5rem 0' }} aria-label="Free Utility Micro-Tools">
          <ToolsGrid initialCategory="all" showSearch={true} />
        </section>

        {/* Secondary Quick Action: Instant Single-Reading Check */}
        {!user && (
          <section style={{ width: '100%', maxWidth: '640px', margin: '1rem auto' }} aria-label="Instant Meter Reading & Slab Check">
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                ⚡ 1-Click Instant Check
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
                Quick Meter Reading &amp; Slab Check
              </h2>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Enter your current meter reading to calculate your K-Electric/LESCO 200-unit slab status in real time.
              </p>
            </div>
            <InstantMeterCheckWidget />
          </section>
        )}

        <section className={styles.featuresSection} aria-label="Core Capabilities">
          <h2 className={styles.sectionTitle}>Engineered for Real-Time Utility Intelligence</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} fade-in`}>
              <div className={styles.featureIcon}>
                <Camera size={24} />
              </div>
              <h3 className={styles.featureTitle}>In-Browser AI OCR</h3>
              <p className={styles.featureText}>
                Snap photos of digital LCDs, 5-dial clock meters, and gas odometers. Recognition runs 100% on your device with zero cloud uploads.
              </p>
            </div>

            <div className={`${styles.featureCard} fade-in`}>
              <div className={`${styles.featureIcon} ${styles.featureIconAccent}`}>
                <TrendingUp size={24} />
              </div>
              <h3 className={styles.featureTitle}>Tariff &amp; Slab Protection</h3>
              <p className={styles.featureText}>
                Live slab forecasting tracks daily run rates and warns you before crossing subsidized thresholds like the 200 units K-Electric / LESCO cap.
              </p>
            </div>

            <div className={`${styles.featureCard} fade-in`}>
              <div className={`${styles.featureIcon} ${styles.featureIconSuccess}`}>
                <Key size={24} />
              </div>
              <h3 className={styles.featureTitle}>Tamper-Proof Slips</h3>
              <p className={styles.featureText}>
                Generate cryptographically stamped slips for tenant sub-meter splits or disputing erroneous provider utility bills with verifiable proof.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.88rem' }}>
          <Link href="/tools" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>🧰 All Utility Tools Hub</Link>
          <Link href="/protected-slab-calculator" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>⚡ 200 Unit Slab Calculator</Link>
          <Link href="/blog" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>📖 Utility Blog</Link>
          <Link href="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms-of-service" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About Us</Link>
          <Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Us</Link>
          <Link href="/disclaimer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Disclaimer</Link>
        </div>
        <div>&copy; {new Date().getFullYear()} Read Meter Systems. All rights reserved.</div>
      </footer>

      {/* JSON-LD Structured Data Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Read Meter',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online',
              description:
                'Smart electricity meter and unit consumption tracker with AI OCR photo scanning, sub-meter billing calculations, peak charge alerts, and Web Push notifications.',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0.00',
                priceCurrency: 'USD',
              },
              featureList: [
                'AI OCR Camera Dial Scanning',
                'Real-Time Electricity Unit Calculation',
                'Sub-Meter Billing Split',
                'K-Electric Protected Slab Warning',
                'Browser Web Push Reading Reminders',
                'Offline Reading Queue Support',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Read Meter',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'}/favicon.ico`,
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'support@readmeter.online',
                contactType: 'customer support',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How does Read Meter calculate electricity units?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Read Meter tracks your meter dial values relative to your monthly billing cycle reset date. By comparing your latest logged reading against the baseline reading, it calculates exact units consumed, daily consumption rates, and projected month-end totals.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I scan my electricity meter with a camera?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Read Meter includes an in-browser AI OCR scanner. Simply snap or upload a clear photo of your meter dial, and the digits will be extracted automatically without sending raw photos to external servers.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does Read Meter support protected tariff slabs like K-Electric?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Read Meter provides built-in slab protection analytics that warn you before exceeding subsidized unit limits (such as the 200 units threshold for K-Electric/LESCO), helping you avoid non-protected rate surges.',
                  },
                },
              ],
            },
          ]),
        }}
      />
    </div>
  )
}

