'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './waterPumpCalculator.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Droplets,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Share2,
  Users,
  Sliders,
  HelpCircle,
  Gauge,
  Layers,
} from 'lucide-react'

type MotorPreset = '0.5' | '0.75' | '1.0' | '1.5' | '2.0' | 'custom'
type MotorType = 'suction' | 'borewell' | 'booster' | 'submersible'
type TariffTier = 'protected' | 'unprotected' | 'high' | 'peak' | 'custom'

interface MotorSpec {
  hp: string
  label: string
  gridWatts: number
  typicalFlowLpm: number
  desc: string
}

const MOTOR_SPECS: Record<MotorPreset, MotorSpec> = {
  '0.5': {
    hp: '0.5 HP',
    label: '0.5 HP (375W)',
    gridWatts: 550,
    typicalFlowLpm: 22,
    desc: 'Small booster / donkey pump for shallow ground tank',
  },
  '0.75': {
    hp: '0.75 HP',
    label: '0.75 HP (560W)',
    gridWatts: 800,
    typicalFlowLpm: 30,
    desc: 'Standard domestic suction pump for 1-2 story homes',
  },
  '1.0': {
    hp: '1.0 HP',
    label: '1.0 HP (750W)',
    gridWatts: 1050,
    typicalFlowLpm: 40,
    desc: 'Most common residential pump for overhead roof tank',
  },
  '1.5': {
    hp: '1.5 HP',
    label: '1.5 HP (1120W)',
    gridWatts: 1550,
    typicalFlowLpm: 60,
    desc: 'Deep borewell (100-200ft) or multi-story booster',
  },
  '2.0': {
    hp: '2.0 HP',
    label: '2.0 HP (1500W)',
    gridWatts: 2100,
    typicalFlowLpm: 90,
    desc: 'Deep submersible turbine or multi-tenant commercial',
  },
  custom: {
    hp: 'Custom',
    label: 'Custom Wattage',
    gridWatts: 1000,
    typicalFlowLpm: 40,
    desc: 'Specify exact wattage from pump motor nameplate',
  },
}

const TARIFF_RATES: Record<TariffTier, { label: string; rate: number; desc: string }> = {
  protected: {
    label: 'Protected Slab (<200 Units)',
    rate: 16.5,
    desc: 'Lifeline subsidized residential rate',
  },
  unprotected: {
    label: 'Unprotected Slab (201-300 Units)',
    rate: 38.5,
    desc: 'Standard non-protected slab with fuel surcharge',
  },
  high: {
    label: 'Higher Slab (301-700 Units)',
    rate: 44.5,
    desc: 'Higher tier residential tariff',
  },
  peak: {
    label: 'Peak Time (6 PM - 10 PM)',
    rate: 52.0,
    desc: 'TOU / Peak hour heavy penalty rate',
  },
  custom: {
    label: 'Custom Unit Rate (Rs/kWh)',
    rate: 45.0,
    desc: 'Enter custom tariff from your electricity bill',
  },
}

export default function WaterPumpCostCalculator() {
  const [motorPreset, setMotorPreset] = useState<MotorPreset>('1.0')
  const [motorType, setMotorType] = useState<MotorType>('suction')
  const [customWatts, setCustomWatts] = useState<number>(1000)
  const [calcMode, setCalcMode] = useState<'runtime' | 'tank'>('runtime')
  const [dailyMinutes, setDailyMinutes] = useState<number>(60)
  const [tankCapacity, setTankCapacity] = useState<number>(1000)
  const [dailyFills, setDailyFills] = useState<number>(1)
  const [tariffTier, setTariffTier] = useState<TariffTier>('unprotected')
  const [customRate, setCustomRate] = useState<number>(45)
  const [sharedPortions, setSharedPortions] = useState<number>(1)
  const [copied, setCopied] = useState<boolean>(false)

  const calculations = useMemo(() => {
    const spec = MOTOR_SPECS[motorPreset]
    const effectiveWatts = motorPreset === 'custom' ? customWatts : spec.gridWatts
    const flowLpm = spec.typicalFlowLpm

    // Fill calculation for 1 tank
    const minutesPerFill = Math.max(1, Math.round(tankCapacity / flowLpm))
    
    // Total daily minutes
    const effectiveDailyMinutes =
      calcMode === 'tank' ? minutesPerFill * dailyFills : dailyMinutes

    const dailyHours = effectiveDailyMinutes / 60
    const dailyKwh = (effectiveWatts * dailyHours) / 1000
    const monthlyKwh = dailyKwh * 30

    const unitRate = tariffTier === 'custom' ? customRate : TARIFF_RATES[tariffTier].rate
    const monthlyCost = Math.round(monthlyKwh * unitRate)
    const costPerFill = Math.round((effectiveWatts * (minutesPerFill / 60) / 1000) * unitRate)

    // Shared portions
    const costPerPortion = Math.round(monthlyCost / sharedPortions)
    const unitsPerPortion = Number((monthlyKwh / sharedPortions).toFixed(1))

    // Protected slab threat
    const protectedImpactPercent = Math.min(100, Math.round((monthlyKwh / 200) * 100))
    const slabThreat =
      monthlyKwh >= 60 ? 'HIGH' : monthlyKwh >= 30 ? 'MODERATE' : 'LOW'

    // Compare with Peak Hours vs Off-Peak
    const offPeakCost = Math.round(monthlyKwh * 38.5)
    const peakCost = Math.round(monthlyKwh * 52.0)
    const peakPenaltyLoss = Math.max(0, peakCost - offPeakCost)

    return {
      effectiveWatts,
      effectiveDailyMinutes,
      minutesPerFill,
      dailyKwh: Number(dailyKwh.toFixed(2)),
      monthlyKwh: Number(monthlyKwh.toFixed(1)),
      unitRate,
      monthlyCost,
      costPerFill,
      costPerPortion,
      unitsPerPortion,
      protectedImpactPercent,
      slabThreat,
      peakPenaltyLoss,
    }
  }, [
    motorPreset,
    customWatts,
    calcMode,
    dailyMinutes,
    tankCapacity,
    dailyFills,
    tariffTier,
    customRate,
    sharedPortions,
  ])

  const copyBreakdown = () => {
    const text = `💧 Read Meter - Water Pump Electricity Cost Audit:
Motor: ${MOTOR_SPECS[motorPreset].hp} (${calculations.effectiveWatts}W actual draw)
Daily Run: ${calculations.effectiveDailyMinutes} mins/day (${calcMode === 'tank' ? `${tankCapacity}L tank × ${dailyFills} fill/day` : 'Direct run'})
Monthly Consumption: ${calculations.monthlyKwh} kWh (Units)
Electricity Rate: Rs. ${calculations.unitRate}/kWh (${TARIFF_RATES[tariffTier].label})
Monthly Electricity Cost: Rs. ${calculations.monthlyCost.toLocaleString()}
${sharedPortions > 1 ? `Shared Division (${sharedPortions} Portions): Rs. ${calculations.costPerPortion.toLocaleString()} / portion (${calculations.unitsPerPortion} units)` : ''}
200-Unit Slab Impact: Uses ${calculations.protectedImpactPercent}% of the 200-unit lifeline limit!
Calculate free at: https://www.readmeter.online/tools/water-pump-electricity-calculator`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '1rem' }}>
        <Navbar maxWidth="1100px" />
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Droplets size={14} /> Water Motor & Borewell Audit
        </div>
        <h1 className={styles.title}>
          Water Pump Electricity <span className={styles.titleHighlight}>Cost & Units</span> Calculator
        </h1>
        <p className={styles.subtitle}>
          Calculate exact electricity units (kWh) and bill cost for 0.5 HP, 1 HP, 1.5 HP, and 2 HP
          water motors, suction pumps, and submersible borewells. See overhead tank fill expenses and
          prevent the 200-unit protected slab penalty.
        </p>
      </section>

      {/* Main Grid */}
      <div className={styles.mainContent}>
        {/* Input Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>
              <Sliders size={20} color="#2dd4bf" /> Motor & Usage Settings
            </span>
            <span className={styles.helperText}>2026 NEPRA Tariffs</span>
          </div>

          {/* Motor Power HP Presets */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Motor Rating (Horsepower / HP)</label>
            <div className={styles.presetGrid}>
              {(['0.5', '0.75', '1.0', '1.5', '2.0', 'custom'] as MotorPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMotorPreset(preset)}
                  className={`${styles.presetBtn} ${
                    motorPreset === preset ? styles.presetBtnActive : ''
                  }`}
                >
                  <span>{MOTOR_SPECS[preset].hp}</span>
                  <span className={styles.presetSub}>
                    {preset === 'custom' ? 'Manual' : `~${MOTOR_SPECS[preset].gridWatts}W`}
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.helperText}>{MOTOR_SPECS[motorPreset].desc}</p>
          </div>

          {/* Custom Wattage if selected */}
          {motorPreset === 'custom' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Actual Grid Power Draw (Watts)</label>
              <input
                type="number"
                min={200}
                max={5000}
                step={50}
                value={customWatts}
                onChange={(e) => setCustomWatts(Math.max(100, Number(e.target.value)))}
                className={styles.input}
              />
              <p className={styles.helperText}>
                Note: An electric motor draws 25-35% more watts from the grid than its mechanical output (746W = 1 HP).
              </p>
            </div>
          )}

          {/* Motor Type */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Pump / Installation Type</label>
            <select
              value={motorType}
              onChange={(e) => setMotorType(e.target.value as MotorType)}
              className={styles.select}
            >
              <option value="suction">Donkey Pump / Suction Pump (Underground tank to roof)</option>
              <option value="borewell">Submersible Deep Borewell (100–300 ft underground)</option>
              <option value="booster">Automatic Water Pressure Booster Pump</option>
              <option value="submersible">Drainage / Sump Submersible Pump</option>
            </select>
          </div>

          {/* Calculation Mode Toggle */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Calculate By</label>
            <div className={styles.tabButtons}>
              <button
                type="button"
                onClick={() => setCalcMode('runtime')}
                className={`${styles.tabBtn} ${calcMode === 'runtime' ? styles.tabBtnActive : ''}`}
              >
                Daily Running Hours
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('tank')}
                className={`${styles.tabBtn} ${calcMode === 'tank' ? styles.tabBtnActive : ''}`}
              >
                Water Tank Capacity (Liters)
              </button>
            </div>
          </div>

          {/* Mode A: Daily Runtime */}
          {calcMode === 'runtime' ? (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Daily Running Time</label>
              <div className={styles.rangeWrap}>
                <input
                  type="range"
                  min={10}
                  max={240}
                  step={5}
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className={styles.slider}
                />
                <span className={styles.rangeValue}>
                  {dailyMinutes >= 60
                    ? `${(dailyMinutes / 60).toFixed(1)} hrs`
                    : `${dailyMinutes} mins`}
                </span>
              </div>
              <p className={styles.helperText}>
                Average household run: 45–75 mins daily for single family; 90–150 mins for multi-story.
              </p>
            </div>
          ) : (
            <>
              {/* Mode B: Tank Size */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Overhead Water Tank Capacity</label>
                <div className={styles.rangeWrap}>
                  <input
                    type="range"
                    min={500}
                    max={4000}
                    step={250}
                    value={tankCapacity}
                    onChange={(e) => setTankCapacity(Number(e.target.value))}
                    className={styles.slider}
                  />
                  <span className={styles.rangeValue}>{tankCapacity} L</span>
                </div>
                <p className={styles.helperText}>
                  Standard tanks: 1000L (~220 gal, 3-bed house), 2000L (~440 gal, double story).
                </p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tanks Filled Per Day</label>
                <select
                  value={dailyFills}
                  onChange={(e) => setDailyFills(Number(e.target.value))}
                  className={styles.select}
                >
                  <option value={1}>1 Fill Per Day (Standard family)</option>
                  <option value={1.5}>1.5 Fills Per Day (Large family / washing day)</option>
                  <option value={2}>2 Fills Per Day (Joint family / two portions)</option>
                  <option value={3}>3 Fills Per Day (High consumption)</option>
                </select>
                <p className={styles.helperText}>
                  Estimated fill time: ~{calculations.minutesPerFill} minutes per fill at ~
                  {MOTOR_SPECS[motorPreset].typicalFlowLpm} L/min flow rate.
                </p>
              </div>
            </>
          )}

          {/* Tariff Selection */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Electricity Tariff Slab</label>
            <select
              value={tariffTier}
              onChange={(e) => setTariffTier(e.target.value as TariffTier)}
              className={styles.select}
            >
              {(Object.keys(TARIFF_RATES) as TariffTier[]).map((tier) => (
                <option key={tier} value={tier}>
                  {TARIFF_RATES[tier].label} — Rs. {TARIFF_RATES[tier].rate}/unit
                </option>
              ))}
            </select>
            <p className={styles.helperText}>{TARIFF_RATES[tariffTier].desc}</p>
          </div>

          {tariffTier === 'custom' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Custom Rate per Unit (PKR)</label>
              <input
                type="number"
                min={5}
                max={100}
                step={0.5}
                value={customRate}
                onChange={(e) => setCustomRate(Math.max(1, Number(e.target.value)))}
                className={styles.input}
              />
            </div>
          )}

          {/* Sub-Meter Shared Portions */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Users size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Shared
              Portions / Tenants on This Pump
            </label>
            <select
              value={sharedPortions}
              onChange={(e) => setSharedPortions(Number(e.target.value))}
              className={styles.select}
            >
              <option value={1}>Single Household (1 Family)</option>
              <option value={2}>Shared by 2 Portions (50% Split)</option>
              <option value={3}>Shared by 3 Portions (33.3% Split)</option>
              <option value={4}>Shared by 4 Portions (25% Split)</option>
            </select>
            <p className={styles.helperText}>
              Divides water motor electricity cost equally across tenants or floors.
            </p>
          </div>
        </div>

        {/* Results Card */}
        <div className={styles.resultCard}>
          <div>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>
                <Gauge size={20} color="#2dd4bf" /> Monthly Cost Breakdown
              </span>
              <span className={styles.badge}>
                {calculations.effectiveWatts}W Real Draw
              </span>
            </div>

            {/* Hero Monthly Cost */}
            <div className={styles.heroStat}>
              <div className={styles.heroStatLabel}>Estimated Monthly Electricity Bill</div>
              <div className={styles.heroStatValue}>
                Rs. {calculations.monthlyCost.toLocaleString()}
              </div>
              <div className={styles.heroStatSub}>
                Based on {calculations.monthlyKwh} kWh / month at Rs. {calculations.unitRate}/unit
              </div>
            </div>

            {/* Stat Grid */}
            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Units Consumed</div>
                <div className={styles.statNumber}>
                  {calculations.dailyKwh} <span className={styles.statUnit}>kWh / day</span>
                </div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Cost Per Tank Fill</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  Rs. {calculations.costPerFill}
                </div>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Monthly Units (kWh)</div>
                <div className={styles.statNumber}>
                  {calculations.monthlyKwh} <span className={styles.statUnit}>Units</span>
                </div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Motor Runtime</div>
                <div className={styles.statNumber}>
                  {calculations.effectiveDailyMinutes} <span className={styles.statUnit}>min/day</span>
                </div>
              </div>
            </div>

            {/* Protected Slab Threat Banner */}
            <div className={styles.slabThreatBox}>
              <ShieldAlert size={24} className={styles.threatIcon} />
              <div>
                <div className={styles.threatTitle}>
                  200-Unit Protected Slab Threat: {calculations.slabThreat}
                </div>
                <div className={styles.threatText}>
                  This motor alone consumes <strong>{calculations.protectedImpactPercent}%</strong> of
                  your entire 200-unit monthly lifeline quota. If your other appliances use 160 units,
                  this pump will push you to {Math.round(160 + calculations.monthlyKwh)} units,
                  instantly doubling your entire bill for 6 consecutive months!
                </div>
              </div>
            </div>

            {/* Shared Portion Split */}
            {sharedPortions > 1 && (
              <div className={styles.splitBox}>
                <div className={styles.splitHeader}>
                  <span>Shared Split ({sharedPortions} Portions)</span>
                  <span>{calculations.unitsPerPortion} Units / Portion</span>
                </div>
                <div className={styles.splitValue}>
                  Rs. {calculations.costPerPortion.toLocaleString()}{' '}
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>per tenant / month</span>
                </div>
              </div>
            )}
          </div>

          {/* Action / Share */}
          <div>
            <button type="button" onClick={copyBreakdown} className={styles.actionBtn}>
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Share2 size={18} /> Copy WhatsApp Bill Breakdown
                </>
              )}
            </button>
            <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <Link
                href="/protected-slab-calculator"
                style={{ color: '#2dd4bf', fontSize: '0.82rem', textDecoration: 'none' }}
              >
                Check 200-Unit Cliff Risk with Full Bill Calculator →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Savings Tips */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionHeader}>
          💡 4 Proven Ways to Cut Water Motor Electricity Bills in Pakistan
        </h2>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <div className={styles.tipTitle}>
              <CheckCircle2 size={18} color="#2dd4bf" /> 1. Install Automatic Float Switch
            </div>
            <div className={styles.tipText}>
              Water tanks overflowing for just 15 minutes a day waste 300+ liters of water and 15–25 units
              of electricity every month. A Rs. 1,200 float sensor pays for itself in less than 45 days.
            </div>
          </div>

          <div className={styles.tipCard}>
            <div className={styles.tipTitle}>
              <CheckCircle2 size={18} color="#2dd4bf" /> 2. Avoid Peak Hours (6 PM – 10 PM)
            </div>
            <div className={styles.tipText}>
              Running a 1.5 HP motor during peak hours costs up to Rs. 52/unit under NEPRA TOU tariffs.
              Schedule your water filling during morning hours or afternoon to save Rs. 800–1,500/month.
            </div>
          </div>

          <div className={styles.tipCard}>
            <div className={styles.tipTitle}>
              <CheckCircle2 size={18} color="#2dd4bf" /> 3. Test Motor Starting Capacitor
            </div>
            <div className={styles.tipText}>
              A degraded 25µF or 30µF capacitor forces the motor to pull up to 40% higher amperage, causing
              motor overheating and rapid meter spinning. Replace weak capacitors every 18–24 months.
            </div>
          </div>

          <div className={styles.tipCard}>
            <div className={styles.tipTitle}>
              <CheckCircle2 size={18} color="#2dd4bf" /> 4. Fix Suction Pipe Air Leaks
            </div>
            <div className={styles.tipText}>
              A leaking foot valve or micro-crack in the PVC suction pipe causes the pump to lose its prime,
              doubling the time needed to fill your overhead tank and inflating bill units.
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQs */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionHeader}>Frequently Asked Questions (Water Motor Units)</h2>

        <div className={styles.faqItem}>
          <div className={styles.faqQuestion}>
            1 HP water pump 1 ghante me kitne unit bijli leti hai?
          </div>
          <div className={styles.faqAnswer}>
            1 Horsepower (HP) theoretical roop se 746 Watts hota hai. Lekin induction motor ki electrical
            efficiency aur mechanical load ki wajah se ek standard 1 HP suction pump grid se lagbhag 1,000 se
            1,100 Watts draw karta hai. Iska matlab hai ke 1 HP motor 1 ghante chalne par taqreeban{' '}
            <strong>1.05 se 1.10 units (kWh)</strong> bijli kharch karti hai.
          </div>
        </div>

        <div className={styles.faqItem}>
          <div className={styles.faqQuestion}>
            Overhead tank bharne me kitne unit bijli lagti hai?
          </div>
          <div className={styles.faqAnswer}>
            Ek aam 1,000 liters (taqreeban 220 gallons) ka overhead tank 1 HP motor ke zariye bharne me 25 se 35
            minute lagte hain. Is dauran taqreeban <strong>0.45 se 0.65 units</strong> bijli kharch hoti hai. Agar
            aapka tariff Rs. 38.5/unit hai, toh ek dafa tanki bharne ka kharcha taqreeban Rs. 18 se Rs. 25 aata
            hai.
          </div>
        </div>

        <div className={styles.faqItem}>
          <div className={styles.faqQuestion}>
            Kya pani ki motor chalane se 200 unit protected slab toot sakta hai?
          </div>
          <div className={styles.faqAnswer}>
            Haan! Agar aap 1 HP ki motor rozana 1.5 ghante chalate hain, toh yeh akele mahine ke 48 se 52 units
            consume karti hai. Agar aapka baaqi ghar 160 units par chal raha hai, toh yeh motor aapko 210 units par
            le jaayegi, jis se aapka protected slab khatam ho kar agle 6 mahine ke liye bill dugna ho jayega.
          </div>
        </div>

        <div className={styles.faqItem}>
          <div className={styles.faqQuestion}>
            Sub-meter par shared water motor ka bill kaise divide karna chahiye?
          </div>
          <div className={styles.faqAnswer}>
            Shared water motor ke liye ek sub-meter ya digital kWh timer lagana behtareen tareeqa hai. Agar direct
            meter nahi hai, toh total family members ya portions ke hisaab se 50-50 ya equal proportion me units
            divide karke current average tariff rate se multiply karke bill receipt banayi ja sakti hai.
          </div>
        </div>
      </section>

      <Footer maxWidth="1100px" />
    </div>
  )
}
