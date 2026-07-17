import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from '../dashboard.module.css'
import OnboardingModal from '@/components/OnboardingModal'
import LimitEditor from '@/components/LimitEditor'
import DeleteReadingBtn from '@/components/DeleteReadingBtn'
import AddReadingButton from '@/components/AddReadingButton'
import ReadingDateEditor from '@/components/ReadingDateEditor'
import MeterSelector from '@/components/MeterSelector'
import ShareWhatsAppBtn from '@/components/ShareWhatsAppBtn'
import {
  Zap,
  TrendingUp,
  Plus,
  LogOut,
  AlertTriangle,
  Calendar,
  Gauge,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Activity,
  CheckCircle,
} from 'lucide-react'

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

export default async function DashboardPage(props: {
  searchParams: Promise<{ meterId?: string }>
}) {
  const searchParams = await props.searchParams
  const meterId = searchParams.meterId

  const supabase = await createClient()

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Fetch User Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Fetch User Meters
  const { data: meters, error: metersError } = await supabase
    .from('meters')
    .select('*')
    .eq('profile_id', user.id)

  // 4. Onboarding flow: If no meters exist, render Onboarding Setup Overlay
  if (!meters || meters.length === 0) {
    return <OnboardingModal />
  }

  const activeMeter = (meterId && meters.find((m) => m.id === meterId)) || meters[0]
  const limit = Number(activeMeter.max_usage_limit) || 400

  // 5. Fetch Readings for Active Meter (sorted desc)
  const { data: readings } = await supabase
    .from('readings')
    .select('*')
    .eq('meter_id', activeMeter.id)
    .order('created_at', { ascending: false })

  // 6. Calculate Billing Cycle Stats
  // Find the baseline reading (latest reading with is_billing_reset = true)
  const baselineReading = readings?.find((r) => r.is_billing_reset === true)

  let billingCycleStart: Date
  if (baselineReading) {
    billingCycleStart = new Date(baselineReading.created_at)
  } else {
    // Fallback to fixed day setting
    billingCycleStart = getBillingCycleStart(activeMeter.billing_cycle_start_day)
  }
  
  // Calculate next reset date (Expected last date of reading)
  let nextReset: Date
  if (activeMeter.next_reading_date) {
    const [year, month, day] = activeMeter.next_reading_date.split('-').map(Number)
    nextReset = new Date(year, month - 1, day, 23, 59, 59, 999)
  } else {
    nextReset = new Date(billingCycleStart)
    nextReset.setMonth(nextReset.getMonth() + 1)
  }
  const diffTime = nextReset.getTime() - new Date().getTime()
  const daysRemaining = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0)

  // Filter readings inside the current cycle
  const currentCycleReadings = readings?.filter((r) => {
    const rDate = new Date(r.created_at)
    return rDate >= billingCycleStart && (!baselineReading || r.id !== baselineReading.id)
  }) || []

  const latestReading = readings?.[0]

  let currentUsage = 0
  let isFirstReading = true

  if (latestReading) {
    isFirstReading = readings.length <= 1
    if (baselineReading) {
      currentUsage = Number(latestReading.reading_value) - Number(baselineReading.reading_value)
    } else if (readings.length > 1) {
      // Fallback: If no readings from previous cycles, use the difference between latest and oldest readings in the active month
      const oldestReading = readings[readings.length - 1]
      currentUsage = Number(latestReading.reading_value) - Number(oldestReading.reading_value)
    }
  }

  // Ensure usage is not negative (e.g. if database has data entry issues)
  currentUsage = Math.max(currentUsage, 0)

  // Calculate daily average consumption based on days elapsed in the current cycle
  const daysElapsed = (new Date().getTime() - billingCycleStart.getTime()) / (1000 * 60 * 60 * 24)
  const durationDays = Math.max(daysElapsed, 1.0) // Minimum 1 day to prevent division-by-zero or spikes
  const dailyAverage = currentUsage / durationDays

  // Calculate usage percentages & limits
  const remainingUnits = limit - currentUsage
  const projectedUsage = currentUsage + (dailyAverage * daysRemaining)
  const targetDailyRate = daysRemaining > 0 ? Math.max((limit - currentUsage) / daysRemaining, 0) : 0

  const usagePercentage = limit > 0 ? (currentUsage / limit) * 100 : 0
  const isWarning = usagePercentage >= 80 && usagePercentage < 100
  const isCritical = usagePercentage >= 100

  // K-Electric Protected Slab metrics (strictly thresholded at 200 units)
  const keThreshold = 200
  const isKeBreached = currentUsage >= keThreshold
  const isKeWarning = projectedUsage >= keThreshold && !isKeBreached
  const keRemainingUnits = Math.max(keThreshold - currentUsage, 0)
  const keTargetDailyRate = daysRemaining > 0 ? Math.max((keThreshold - currentUsage) / daysRemaining, 0) : 0

  // SVG Gauge calculations
  const radius = 75
  const circumference = 2 * Math.PI * radius // ~471.2
  const progressPct = Math.min(usagePercentage / 100, 1)
  const strokeDashoffset = circumference - progressPct * circumference

  let gaugeColor = 'var(--primary)'
  if (isWarning) gaugeColor = 'var(--warning)'
  if (isCritical) gaugeColor = 'var(--error)'

  // 7. Render SVG Trend Chart Data
  // We sort current cycle readings chronologically (ascending) to plot the trend
  const sortedCycleReadings = [...currentCycleReadings].reverse()
  
  // Format data points for the trend chart: (date, cumulative_usage)
  const chartPoints: { label: string; usage: number; dateStr: string }[] = []
  
  // Start from baseline (0 usage)
  if (baselineReading) {
    chartPoints.push({
      label: new Date(baselineReading.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      usage: 0,
      dateStr: new Date(baselineReading.created_at).toLocaleDateString(),
    })
  }

  let accumulated = 0
  sortedCycleReadings.forEach((r, idx) => {
    let pointUsage = 0
    if (baselineReading) {
      pointUsage = Number(r.reading_value) - Number(baselineReading.reading_value)
    } else if (sortedCycleReadings.length > 0) {
      // Diff against the first reading in the cycle
      pointUsage = Number(r.reading_value) - Number(sortedCycleReadings[0].reading_value)
    }
    chartPoints.push({
      label: new Date(r.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      usage: Math.max(pointUsage, 0),
      dateStr: new Date(r.created_at).toLocaleDateString(),
    })
  })

  // Build the SVG elements for the Trend Chart
  const svgWidth = 600
  const svgHeight = 220
  const paddingX = 40
  const paddingY = 30
  const plotWidth = svgWidth - paddingX * 2 // 520
  const plotHeight = svgHeight - paddingY * 2 // 160

  const maxVal = Math.max(limit, currentUsage, 100) // Ensure scale doesn't clip
  const maxYScale = maxVal * 1.1 // Add 10% breathing room

  // Map coordinates
  const points = chartPoints.map((pt, idx) => {
    const xPct = chartPoints.length > 1 ? idx / (chartPoints.length - 1) : 0.5
    const x = paddingX + xPct * plotWidth
    const yPct = pt.usage / maxYScale
    const y = svgHeight - paddingY - yPct * plotHeight
    return { x, y, label: pt.label, usage: pt.usage }
  })

  // SVG Line path construction
  let linePath = ''
  let areaPath = ''
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} `
    for (let i = 1; i < points.length; i++) {
      linePath += `L ${points[i].x} ${points[i].y} `
    }

    // Connect to bottom for area gradient
    areaPath =
      linePath +
      `L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${
        points[0].x
      } ${svgHeight - paddingY} Z`
  }

  // Limit line Y position
  const limitYPct = limit / maxYScale
  const limitY = svgHeight - paddingY - limitYPct * plotHeight

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Zap className={styles.logoIcon} size={22} fill="var(--primary)" />
          <span className={styles.logoText}>
            Volt<span>Track</span>
          </span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>
            Welcome, <strong>{profile?.full_name || user.email}</strong>
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="glow-btn-accent"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '8px 16px',
                fontSize: '0.9rem',
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.welcomeSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className={styles.greeting}>Dashboard</h1>
            <p className={styles.subGreeting}>
              Monitoring Meter ID:{' '}
              <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                {activeMeter.meter_number}
              </span>
            </p>
          </div>
          <MeterSelector meters={meters} activeMeterId={activeMeter.id} />
        </div>

        {/* Warning Banner Alerts */}
        {isCritical && (
          <div className={`${styles.alertBanner} ${styles.alertBannerCritical}`}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 className={styles.alertTitle}>Critical Usage Warning</h4>
              <p className={styles.alertText}>
                You have exceeded your monthly limit of {limit} Units. Current usage is{' '}
                {currentUsage.toFixed(1)} Units ({usagePercentage.toFixed(0)}%). Consider
                reducing high-power appliances to avoid peak charges.
              </p>
            </div>
          </div>
        )}

        {isWarning && (
          <div className={`${styles.alertBanner} ${styles.alertBannerWarning}`}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 className={styles.alertTitle}>Limit Threshold Approaching</h4>
              <p className={styles.alertText}>
                You have consumed {currentUsage.toFixed(0)} Units. You are at{' '}
                {usagePercentage.toFixed(0)}% of your monthly limit ({limit} Units).
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Left Side: Stats, SVG Gauge, SVG Chart */}
          <div className={styles.leftColumn}>
            {/* Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Cumulative Reading</span>
                <span className={styles.statValue}>
                  {latestReading ? Number(latestReading.reading_value).toFixed(0) : '0'}
                  <span className={styles.statValueUnit}>Units</span>
                </span>
                <div className={styles.statTrend}>
                  <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Last logged:{' '}
                    {latestReading
                      ? new Date(latestReading.created_at).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Billing Period Usage</span>
                <span className={styles.statValue}>
                  {currentUsage.toFixed(0)}
                  <span className={styles.statValueUnit}>Units</span>
                </span>
                <div className={styles.statTrend}>
                  {isFirstReading ? (
                    <span className={styles.trendStable}>Initial baseline</span>
                  ) : usagePercentage > 100 ? (
                    <span className={`${styles.trendUp} ${styles.statTrend}`}>
                      Over budget
                    </span>
                  ) : (
                    <span className={`${styles.trendDown} ${styles.statTrend}`}>
                      Under budget
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Daily Average</span>
                <span className={styles.statValue}>
                  {dailyAverage.toFixed(0)}
                  <span className={styles.statValueUnit}>Units/d</span>
                </span>
                <div className={styles.statTrend}>
                  <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {daysRemaining} days left in cycle
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Usage Chart */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <TrendingUp size={18} /> Usage Trend Curve
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  This Billing Cycle (Started on {billingCycleStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})
                </span>
              </div>

              {points.length <= 1 ? (
                <div
                  style={{
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    gap: '0.5rem',
                  }}
                >
                  <Activity size={32} style={{ color: 'var(--text-muted)' }} />
                  <p>Insufficient data points to map trend line.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Add at least two readings to populate the chart.
                  </p>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%' }}>
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    width="100%"
                    height="100%"
                    style={{ background: 'rgba(6,9,19,0.3)', borderRadius: '12px' }}
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line
                      x1={paddingX}
                      y1={svgHeight - paddingY}
                      x2={svgWidth - paddingX}
                      y2={svgHeight - paddingY}
                      stroke="var(--border-color)"
                      strokeWidth="1"
                    />
                    <line
                      x1={paddingX}
                      y1={paddingY}
                      x2={paddingX}
                      y2={svgHeight - paddingY}
                      stroke="var(--border-color)"
                      strokeWidth="1"
                    />

                    {/* Limit Line */}
                    {limitY > paddingY && limitY < svgHeight - paddingY && (
                      <>
                        <line
                          x1={paddingX}
                          y1={limitY}
                          x2={svgWidth - paddingX}
                          y2={limitY}
                          stroke="var(--error)"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          strokeOpacity="0.7"
                        />
                        <text
                          x={svgWidth - paddingX - 10}
                          y={limitY - 6}
                          fill="var(--error)"
                          fontSize="9"
                          textAnchor="end"
                          fontWeight="600"
                        >
                          BUDGET LIMIT ({limit} Units)
                        </text>
                      </>
                    )}

                    {/* Area path */}
                    {areaPath && (
                      <path d={areaPath} fill="url(#chartGradient)" />
                    )}

                    {/* Line path */}
                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 4px var(--primary-glow))' }}
                      />
                    )}

                    {/* Data Points */}
                    {points.map((pt, idx) => (
                      <g key={idx} className="chart-dot">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="#060913"
                          stroke="var(--primary)"
                          strokeWidth="2"
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="2"
                          fill="var(--primary)"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          fill="#fff"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="var(--font-mono)"
                          fontWeight="600"
                        >
                          {pt.usage.toFixed(0)}
                        </text>
                        <text
                          x={pt.x}
                          y={svgHeight - paddingY + 15}
                          fill="var(--text-secondary)"
                          fontSize="8"
                          textAnchor="middle"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Limit Gauge, Quick Actions, History */}
          <div className={styles.rightColumn}>
            {/* SVG Circular Gauge */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>
                <Gauge size={18} /> Budget Allocation
              </h3>

              <div className={styles.gaugeContainer}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <defs>
                    <radialGradient id="gaugeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="70%" stopColor="#060913" stopOpacity="1" />
                      <stop offset="100%" stopColor={gaugeColor} stopOpacity="0.15" />
                    </radialGradient>
                  </defs>
                  
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="url(#gaugeGlow)"
                    stroke="var(--border-color)"
                    strokeWidth="12"
                  />

                  {/* Progress Arc */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    style={{
                      transition: 'stroke-dashoffset var(--transition-slow)',
                      filter: `drop-shadow(0 0 6px ${gaugeColor})`,
                    }}
                  />
                </svg>

                <div className={styles.gaugeTextContainer}>
                  <span className={styles.gaugeNumber}>{currentUsage.toFixed(0)}</span>
                  <span className={styles.gaugeMax}>of {limit} Units</span>
                  <span className={styles.gaugeLabel} style={{ color: gaugeColor }}>
                    {usagePercentage.toFixed(0)}% Used
                  </span>
                </div>
              </div>

              {/* Inline Limits Editor */}
              <LimitEditor meterId={activeMeter.id} currentLimit={limit} />
            </div>

            {/* K-Electric Slab Analyzer Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                <Activity size={18} /> K-Electric Slab Analyzer
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: isKeBreached 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : isKeWarning 
                      ? 'rgba(245, 158, 11, 0.1)' 
                      : 'rgba(16, 185, 129, 0.1)',
                  border: `1px solid ${
                    isKeBreached 
                      ? 'rgba(239, 68, 68, 0.2)' 
                      : isKeWarning 
                        ? 'rgba(245, 158, 11, 0.2)' 
                        : 'rgba(16, 185, 129, 0.2)'
                  }`,
                  color: isKeBreached 
                    ? '#fca5a5' 
                    : isKeWarning 
                      ? '#fef3c7' 
                      : '#a7f3d0',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    Slab Status:{' '}
                    {isKeBreached ? (
                      <span style={{ color: 'var(--error)' }}>UNPROTECTED (Breached)</span>
                    ) : isKeWarning ? (
                      <span style={{ color: 'var(--warning)' }}>AT RISK (Projected Breach)</span>
                    ) : (
                      <span style={{ color: 'var(--success)' }}>PROTECTED (Subsidized)</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Billing Period Usage:</span>
                    <strong style={{ color: '#fff' }}>{currentUsage.toFixed(0)} / 200 Units</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Remaining KE Budget:</span>
                    <strong style={{ color: currentUsage < 200 ? '#fff' : 'var(--error)' }}>
                      {keRemainingUnits.toFixed(0)} Units
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Projected Month End:</span>
                    <strong style={{ color: projectedUsage >= 200 ? 'var(--error)' : 'var(--success)' }}>
                      {projectedUsage.toFixed(0)} Units
                    </strong>
                  </div>
                  {daysRemaining > 0 && keRemainingUnits > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <span>Recommended Daily Cap:</span>
                      <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {keTargetDailyRate.toFixed(0)} Units/day
                      </strong>
                    </div>
                  )}
                </div>

                <ReadingDateEditor meterId={activeMeter.id} currentDate={activeMeter.next_reading_date} />

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {isKeBreached ? (
                    "⚠️ You have exceeded the 200 units K-Electric protected slab. You will be billed at standard, non-subsidized rates for all units this cycle."
                  ) : isKeWarning ? (
                    `⚠️ At your current daily average of ${dailyAverage.toFixed(1)} Units/day, you are projected to breach the 200 unit slab. Limit remaining usage to ${keTargetDailyRate.toFixed(1)} Units/day to stay protected.`
                  ) : (
                    `✅ You are on track to stay within the 200 unit protected slab. Keep daily usage under ${keTargetDailyRate.toFixed(1)} Units/day for the remaining ${daysRemaining} days.`
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <AddReadingButton
                  meterId={activeMeter.id}
                  meterNumber={activeMeter.meter_number}
                  className="glow-btn-solid"
                  style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                />
                <ShareWhatsAppBtn
                  type="status"
                  meterNumber={activeMeter.meter_number}
                  currentUsage={currentUsage}
                  limit={limit}
                  dailyAverage={dailyAverage}
                  daysRemaining={daysRemaining}
                  projectedUsage={projectedUsage}
                  slabStatus={
                    isKeBreached
                      ? 'UNPROTECTED (Breached)'
                      : isKeWarning
                      ? 'AT RISK (Projected Breach)'
                      : 'PROTECTED (Subsidized)'
                  }
                  style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reading History Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <FileText size={18} /> Reading Logs
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Logged records ({readings?.length || 0})
            </span>
          </div>

          {!readings || readings.length === 0 ? (
            <div className={styles.noReadings}>
              No readings recorded yet. Click "Add New Reading" to begin tracking!
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Reading (Units)</th>
                    <th>Consumption (Diff)</th>
                    <th>Date logged</th>
                    <th className={styles.actionCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((reading, index) => {
                    // Calculate increment against the next oldest reading in the array
                    const nextOldest = readings[index + 1]
                    const increment = nextOldest
                      ? Number(reading.reading_value) - Number(nextOldest.reading_value)
                      : null

                    return (
                      <tr key={reading.id}>
                        <td>
                          <div className={styles.valueCell}>
                            {Number(reading.reading_value).toFixed(0)}
                          </div>
                        </td>
                        <td>
                          {reading.is_billing_reset ? (
                            <span className={styles.incrementBadge} style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)', display: 'inline-block' }}>
                              Billing Reset (Baseline)
                            </span>
                          ) : increment !== null && increment >= 0 ? (
                            <span className={styles.incrementBadge} style={{ display: 'inline-block' }}>
                              +{increment.toFixed(0)} Units
                            </span>
                          ) : index === readings.length - 1 ? (
                            <span className={styles.incrementBadge} style={{ background: 'rgba(0, 240, 255, 0.08)', color: 'var(--primary)', borderColor: 'var(--primary-glow)', display: 'inline-block' }}>
                              Initial Baseline
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                        <td className={styles.dateCell}>
                          <div>{new Date(reading.created_at).toLocaleDateString()}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className={styles.actionCell}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <ShareWhatsAppBtn
                              type="reading"
                              meterNumber={activeMeter.meter_number}
                              value={Number(reading.reading_value)}
                              date={new Date(reading.created_at).toLocaleString()}
                              increment={increment}
                              notes={reading.notes}
                            />
                            <DeleteReadingBtn readingId={reading.id} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
