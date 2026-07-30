import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import styles from './landing.module.css'
import dashboardStyles from './dashboard.module.css'
import { Zap, Camera, TrendingUp, Key, ChevronRight, FileText } from 'lucide-react'
import QuickReadingForm from '@/components/QuickReadingForm'
import DeleteReadingBtn from '@/components/DeleteReadingBtn'
import AddReadingButton from '@/components/AddReadingButton'
import OfflineReadingsList from '@/components/OfflineReadingsList'

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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let activeMeter = null
  let latestReadingValue: number | null = null
  let readings: any[] = []
  
  // K-Electric slab calculation variables
  let limit = 200
  let currentUsage = 0
  let daysRemaining = 30
  let dailyAverage = 0
  let projectedUsage = 0

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Zap className={styles.logoIcon} size={28} fill="var(--primary)" />
          <span className={styles.logoText}>
            Volt<span>Track</span>
          </span>
        </div>
        <div>
          {user ? (
            <Link href="/dashboard" className="glow-btn-accent" style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="glow-btn" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={`${styles.badge} fade-in`}>⚡ Real-Time Consumption Tracking</div>
        <h1 className={`${styles.title} fade-in`}>
          Take Control of Your <span>Electric Meter Units</span>
        </h1>
        <p className={`${styles.description} fade-in`}>
          VoltTrack helps you monitor, budget, and optimize your electrical unit consumption. Upload pictures of your meter dials for instant OCR readings or log usage manually.
        </p>

        {user && activeMeter && (
          <div className="fade-in" style={{ width: '100%', maxWidth: '800px', margin: '2rem auto 0 auto' }}>
            
            {/* Slab Status Alert on Landing Page */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              margin: '0 auto 1.25rem auto',
              maxWidth: '500px',
              background: currentUsage >= 200 
                ? 'rgba(239, 68, 68, 0.08)' 
                : projectedUsage >= 200 
                  ? 'rgba(245, 158, 11, 0.08)' 
                  : 'rgba(16, 185, 129, 0.08)',
              border: `1px solid ${
                currentUsage >= 200 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : projectedUsage >= 200 
                    ? 'rgba(245, 158, 11, 0.2)' 
                    : 'rgba(16, 185, 129, 0.2)'
              }`,
              color: currentUsage >= 200 
                ? '#fca5a5' 
                : projectedUsage >= 200 
                  ? '#fef3c7' 
                  : '#a7f3d0',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  K-Electric Status:{' '}
                  {currentUsage >= 200 ? (
                    'UNPROTECTED SLAB'
                  ) : projectedUsage >= 200 ? (
                    'BREACH PROJECTED'
                  ) : (
                    'PROTECTED (Subsidized)'
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.15rem' }}>
                  {currentUsage >= 200 ? (
                    `Exceeded 200 Units limit (Current: ${currentUsage.toFixed(0)} Units)`
                  ) : projectedUsage >= 200 ? (
                    `Tracking: ${currentUsage.toFixed(0)} Units (Projected: ${projectedUsage.toFixed(0)} Units)`
                  ) : (
                    `Safe at ${currentUsage.toFixed(0)} Units (Projected: ${projectedUsage.toFixed(0)} / 200 Units)`
                  )}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                {daysRemaining}d left
              </div>
            </div>

            <OfflineReadingsList meterId={activeMeter.id} />

            <QuickReadingForm
              meterId={activeMeter.id}
              meterNumber={activeMeter.meter_number}
              latestReadingValue={latestReadingValue}
            />

            {/* Reading History Table on Front Page */}
            <div className={dashboardStyles.card} style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div className={dashboardStyles.cardHeader}>
                <h3 className={dashboardStyles.cardTitle}>
                  <FileText size={18} /> Recent Meter Reading Logs
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Total logged ({readings.length})
                </span>
              </div>

              {readings.length === 0 ? (
                <div className={dashboardStyles.noReadings}>
                  No readings recorded yet. Log your first reading above!
                </div>
              ) : (
                <div className={dashboardStyles.tableContainer}>
                  <table className={dashboardStyles.historyTable}>
                    <thead>
                      <tr>
                        <th>Reading (Units)</th>
                        <th>Consumption (Diff)</th>
                        <th>Date logged</th>
                        <th className={dashboardStyles.actionCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.slice(0, 5).map((reading, index) => {
                        const nextOldest = readings[index + 1]
                        const increment = nextOldest
                          ? Number(reading.reading_value) - Number(nextOldest.reading_value)
                          : null

                        return (
                          <tr key={reading.id}>
                            <td>
                              <div className={dashboardStyles.valueCell}>
                                {Number(reading.reading_value).toFixed(0)}
                              </div>
                            </td>
                            <td>
                              {reading.is_billing_reset ? (
                                <span className={dashboardStyles.incrementBadge} style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)', display: 'inline-block' }}>
                                  Billing Reset (Baseline)
                                </span>
                              ) : increment !== null && increment >= 0 ? (
                                <span className={dashboardStyles.incrementBadge} style={{ display: 'inline-block' }}>
                                  +{increment.toFixed(0)} Units
                                </span>
                              ) : index === readings.length - 1 ? (
                                <span className={dashboardStyles.incrementBadge} style={{ background: 'rgba(0, 240, 255, 0.08)', color: 'var(--primary)', borderColor: 'var(--primary-glow)', display: 'inline-block' }}>
                                  Initial Baseline
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                              )}
                            </td>
                            <td className={dashboardStyles.dateCell}>
                              <div>{new Date(reading.created_at).toLocaleDateString()}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className={dashboardStyles.actionCell}>
                              <DeleteReadingBtn readingId={reading.id} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  
                  {readings.length > 5 && (
                    <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                      <Link href="/dashboard" className="glow-btn-accent" style={{ textDecoration: 'none', display: 'inline-flex', padding: '6px 16px', fontSize: '0.85rem' }}>
                        View All Logs in Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`${styles.ctaGroup} fade-in`}>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="glow-btn"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Go to Dashboard <ChevronRight size={20} />
              </Link>
              {activeMeter && (
                <AddReadingButton
                  meterId={activeMeter.id}
                  meterNumber={activeMeter.meter_number}
                  className="glow-btn-solid"
                  label="Log Reading (Manual / Scan)"
                />
              )}
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="glow-btn-solid"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Get Started <ChevronRight size={20} />
              </Link>
              <Link href="/login" className="glow-btn" style={{ textDecoration: 'none' }}>
                Existing Member Login
              </Link>
            </>
          )}
        </div>

        <section className={styles.featuresGrid}>
          <div className={`${styles.featureCard} fade-in`}>
            <div className={styles.featureIcon}>
              <Camera size={24} />
            </div>
            <h3 className={styles.featureTitle}>AI-Powered OCR scan</h3>
            <p className={styles.featureText}>
              Snap a picture of your physical meter dials using your phone's camera. Our browser-side OCR engine parses and extracts digits automatically.
            </p>
          </div>

          <div className={`${styles.featureCard} fade-in`}>
            <div className={`${styles.featureIcon} ${styles.featureIconAccent}`}>
              <TrendingUp size={24} />
            </div>
            <h3 className={styles.featureTitle}>Usage Limits & Alerts</h3>
            <p className={styles.featureText}>
              Set a monthly limit on units. Get visual warnings at 80% capacity and pulsing critical alerts once you breach your budget.
            </p>
          </div>

          <div className={`${styles.featureCard} fade-in`}>
            <div className={`${styles.featureIcon} ${styles.featureIconSuccess}`}>
              <Key size={24} />
            </div>
            <h3 className={styles.featureTitle}>Secure Dashboard</h3>
            <p className={styles.featureText}>
              Fully authenticated user profiles backed by Supabase. Your meter readings are protected by enterprise-grade Row Level Security.
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>&copy; {new Date().getFullYear()} VoltTrack Systems. All rights reserved.</div>
        <div>Designed for smart efficiency & electricity monitoring.</div>
      </footer>

      {/* JSON-LD Structured Data Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'VoltTrack',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://volttrack.app',
            description:
              'Smart electricity meter and unit consumption tracker with AI OCR photo scanning, sub-meter billing calculations, peak charge alerts, and Web Push notifications.',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </div>
  )
}

