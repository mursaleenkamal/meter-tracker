'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './batteryCalculator.module.css'
import {
  Battery,
  Zap,
  Clock,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Camera,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
} from 'lucide-react'

type BatteryType = 'tall_tubular' | 'lead_acid' | 'lithium' | 'agm_gel'

interface BatterySpec {
  name: string
  dod: number // Depth of discharge percentage
  efficiency: number // Inverter efficiency
  description: string
}

const BATTERY_TYPES: Record<BatteryType, BatterySpec> = {
  tall_tubular: {
    name: 'Tall Tubular Deep-Cycle (AGS / Phoenix / Volta)',
    dod: 70,
    efficiency: 85,
    description: 'Most common in Pakistan for UPS. Tolerates 70% depth of discharge with 1,200+ cycles.',
  },
  lead_acid: {
    name: 'Standard Lead-Acid / Liquid Automotive',
    dod: 50,
    efficiency: 82,
    description: 'Automotive plates. Should never be discharged below 50% to prevent plate sulfation.',
  },
  lithium: {
    name: 'Lithium Iron Phosphate (LiFePO4)',
    dod: 90,
    efficiency: 95,
    description: 'Modern solar hybrid storage. Safe up to 90% DoD with 4,000+ lifecycle cycles.',
  },
  agm_gel: {
    name: 'Gel / AGM VRLA (Sealed Maintenance Free)',
    dod: 60,
    efficiency: 85,
    description: 'Sealed dry batteries. Safe up to 60% DoD, clean indoor installation.',
  },
}

const AH_PRESETS = [100, 150, 180, 200, 230, 250, 300]

interface Appliance {
  id: string
  name: string
  watts: number
  category: string
}

const APPLIANCES: Appliance[] = [
  { id: 'fans', name: 'Ceiling Fans (Standard AC)', watts: 80, category: 'Comfort' },
  { id: 'invFans', name: 'Inverter BLDC Fans (12V/220V)', watts: 35, category: 'Comfort' },
  { id: 'lights', name: 'LED Bulbs / Tube Lights', watts: 12, category: 'Lighting' },
  { id: 'tv', name: 'LED TV (43"–55") + Setup Box', watts: 90, category: 'Entertainment' },
  { id: 'router', name: 'WiFi Fiber Router / ONT', watts: 15, category: 'Electronics' },
  { id: 'laptop', name: 'Laptop / Work Station', watts: 65, category: 'Electronics' },
  { id: 'fridge', name: 'Inverter Refrigerator (Duty Cycle)', watts: 180, category: 'Appliances' },
  { id: 'inverterAc', name: '1-Ton Inverter AC (Low / Eco Mode)', watts: 750, category: 'Heavy Load' },
]

export default function BatteryBackupCalculator() {
  const [systemVoltage, setSystemVoltage] = useState<number>(12)
  const [batteryType, setBatteryType] = useState<BatteryType>('tall_tubular')
  const [batteryAh, setBatteryAh] = useState<number>(200)
  const [customAhInput, setCustomAhInput] = useState<string>('')
  const [inverterEfficiency, setInverterEfficiency] = useState<number>(85)
  const [customWatts, setCustomWatts] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  // Appliance counts
  const [counts, setCounts] = useState<Record<string, number>>({
    fans: 2,
    invFans: 0,
    lights: 4,
    tv: 1,
    router: 1,
    laptop: 1,
    fridge: 0,
    inverterAc: 0,
  })

  const updateCount = (id: string, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }))
  }

  // Active Capacity
  const activeAh = useMemo(() => {
    if (customAhInput && !isNaN(parseFloat(customAhInput)) && parseFloat(customAhInput) > 0) {
      return parseFloat(customAhInput)
    }
    return batteryAh
  }, [batteryAh, customAhInput])

  // Active Wattage
  const activeWatts = useMemo(() => {
    if (customWatts && !isNaN(parseFloat(customWatts)) && parseFloat(customWatts) > 0) {
      return parseFloat(customWatts)
    }
    return APPLIANCES.reduce((sum, item) => sum + (counts[item.id] || 0) * item.watts, 0)
  }, [customWatts, counts])

  // Calculations
  const calc = useMemo(() => {
    const spec = BATTERY_TYPES[batteryType]
    const dodPercent = spec.dod
    const effPercent = inverterEfficiency

    // Total Nominal Stored Energy (Wh)
    const nominalWh = systemVoltage * activeAh
    const nominalKwh = nominalWh / 1000

    // Safe Usable Energy (Wh)
    const usableWh = nominalWh * (dodPercent / 100)
    const usableKwh = usableWh / 1000

    // Effective continuous power draw from battery taking inverter efficiency into account
    const effectiveLoadWatts = activeWatts > 0 ? activeWatts / (effPercent / 100) : 0

    // Backup Time in Hours
    const backupHoursRaw = effectiveLoadWatts > 0 ? usableWh / effectiveLoadWatts : 0
    const hours = Math.floor(backupHoursRaw)
    const minutes = Math.round((backupHoursRaw - hours) * 60)

    // DC Current Drawn from Battery (Amps)
    const dcCurrentAmps = systemVoltage > 0 ? effectiveLoadWatts / systemVoltage : 0

    // C-Rate Discharge Stress
    const cRate = activeAh > 0 ? dcCurrentAmps / activeAh : 0

    // Recharge stats
    // Recharging takes ~15% extra energy due to internal resistance and chemical conversion loss
    const rechargeUnitsKwh = (usableWh * 1.15) / 1000
    const rechargeTime15A = (activeAh * (dodPercent / 100) * 1.15) / 15
    const rechargeTime25A = (activeAh * (dodPercent / 100) * 1.15) / 25

    // Recharging Cost (PKR) at NEPRA protected (Rs 16.5) vs unprotected slab (Rs 42)
    const costProtectedPkr = Math.round(rechargeUnitsKwh * 16.5)
    const costUnprotectedPkr = Math.round(rechargeUnitsKwh * 42.0)

    return {
      nominalWh,
      nominalKwh,
      usableWh,
      usableKwh,
      effectiveLoadWatts,
      backupHoursRaw,
      hours,
      minutes,
      dcCurrentAmps,
      cRate,
      rechargeUnitsKwh,
      rechargeTime15A: rechargeTime15A.toFixed(1),
      rechargeTime25A: rechargeTime25A.toFixed(1),
      costProtectedPkr,
      costUnprotectedPkr,
    }
  }, [systemVoltage, activeAh, activeWatts, batteryType, inverterEfficiency])

  // Share message
  const handleShare = () => {
    const text = `⚡ Read Meter UPS & Battery Backup Calculation:\n• Battery: ${activeAh}Ah (${systemVoltage}V, ${BATTERY_TYPES[batteryType].name})\n• Connected Load: ${activeWatts}W\n• Estimated Backup: ${calc.hours}h ${calc.minutes}m\n• DC Draw: ${calc.dcCurrentAmps.toFixed(1)}A\nCalculate yours free: https://www.readmeter.online/tools/battery-backup-calculator`
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div className={styles.calculatorCard}>
      {/* LEFT COLUMN: Input Configuration */}
      <div>
        {/* System Voltage */}
        <div className={styles.sectionHeader}>
          <Battery size={20} color="#2563eb" />
          <h3>1. Battery Bank Setup</h3>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>System DC Voltage (UPS / Inverter)</label>
          <div className={styles.radioGroup}>
            {[12, 24, 48].map((v) => (
              <button
                key={v}
                type="button"
                className={`${styles.radioBtn} ${systemVoltage === v ? styles.radioBtnActive : ''}`}
                onClick={() => setSystemVoltage(v)}
              >
                {v}V {v === 12 ? '(Single 12V Battery)' : v === 24 ? '(2 Batteries in Series)' : '(4 Batteries / Solar Inverter)'}
              </button>
            ))}
          </div>
        </div>

        {/* Battery Chemistry */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Battery Chemistry & Technology</label>
          <select
            className={styles.selectField}
            value={batteryType}
            onChange={(e) => setBatteryType(e.target.value as BatteryType)}
          >
            {Object.entries(BATTERY_TYPES).map(([key, spec]) => (
              <option key={key} value={key}>
                {spec.name} — {spec.dod}% Safe DoD
              </option>
            ))}
          </select>
          <div className={styles.hintText}>{BATTERY_TYPES[batteryType].description}</div>
        </div>

        {/* Battery Capacity (Ah) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Battery Capacity (Ampere Hours - Ah)</label>
          <div className={styles.radioGroup} style={{ marginBottom: '0.6rem' }}>
            {AH_PRESETS.map((ah) => (
              <button
                key={ah}
                type="button"
                className={`${styles.radioBtn} ${activeAh === ah && !customAhInput ? styles.radioBtnActive : ''}`}
                onClick={() => {
                  setBatteryAh(ah)
                  setCustomAhInput('')
                }}
              >
                {ah} Ah
              </button>
            ))}
          </div>
          <input
            type="number"
            className={styles.inputField}
            placeholder="Or enter custom Ah (e.g. 175, 220, 400)"
            value={customAhInput}
            onChange={(e) => setCustomAhInput(e.target.value)}
          />
        </div>

        {/* Inverter Efficiency Slider */}
        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className={styles.label} style={{ margin: 0 }}>Inverter Conversion Efficiency</label>
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.9rem' }}>{inverterEfficiency}%</span>
          </div>
          <input
            type="range"
            min={75}
            max={95}
            step={1}
            value={inverterEfficiency}
            onChange={(e) => setInverterEfficiency(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
          />
          <div className={styles.hintText}>Standard Desi / Chinese UPS = 78%–82%, Modern Pure Sine Wave Hybrid = 85%–90%.</div>
        </div>

        {/* SECTION 2: Load Selection */}
        <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
          <Zap size={20} color="#2563eb" />
          <h3>2. Connected Household Load</h3>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Direct Wattage Override (Optional)</label>
          <input
            type="number"
            className={styles.inputField}
            placeholder="Enter total measured Watts directly (e.g. 350)"
            value={customWatts}
            onChange={(e) => setCustomWatts(e.target.value)}
          />
          {customWatts && (
            <div className={styles.hintText} style={{ color: '#2563eb' }}>
              ✓ Using direct custom load of {customWatts}W (appliance counters below bypassed).
            </div>
          )}
        </div>

        {!customWatts && (
          <div className={styles.applianceList}>
            {APPLIANCES.map((app) => (
              <div key={app.id} className={styles.applianceRow}>
                <div className={styles.applianceInfo}>
                  <span className={styles.applianceName}>{app.name}</span>
                  <span className={styles.applianceWatt}>{app.watts} Watts each</span>
                </div>
                <div className={styles.counterControls}>
                  <button
                    type="button"
                    className={styles.counterBtn}
                    onClick={() => updateCount(app.id, -1)}
                    disabled={(counts[app.id] || 0) <= 0}
                  >
                    -
                  </button>
                  <span className={styles.counterValue}>{counts[app.id] || 0}</span>
                  <button
                    type="button"
                    className={styles.counterBtn}
                    onClick={() => updateCount(app.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Output Dashboard */}
      <div className={styles.resultsContainer}>
        {/* Main Backup Hero Card */}
        <div className={styles.heroResultCard}>
          <div className={styles.resultPill}>
            <Clock size={14} />
            <span>Projected Backup Duration</span>
          </div>

          <div className={styles.mainBackupValue}>
            {activeWatts > 0 ? (
              <>
                {calc.hours}
                <span style={{ fontSize: '1.4rem', color: '#2563eb', fontWeight: 600 }}>h </span>
                {calc.minutes}
                <span style={{ fontSize: '1.4rem', color: '#2563eb', fontWeight: 600 }}>m</span>
              </>
            ) : (
              '0h 0m'
            )}
          </div>

          <div className={styles.mainBackupSubtext}>
            Continuous running time until safe cut-off limit ({BATTERY_TYPES[batteryType].dod}% DoD)
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Active Continuous Load</span>
            <span className={styles.metricValue}>{activeWatts} W</span>
            <span className={styles.metricSub}>Gross Draw: {Math.round(calc.effectiveLoadWatts)} W</span>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>DC Battery Current</span>
            <span className={styles.metricValue}>{calc.dcCurrentAmps.toFixed(1)} A</span>
            <span className={styles.metricSub}>At {systemVoltage}V DC bus</span>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Safe Usable Energy</span>
            <span className={styles.metricValue}>{calc.usableKwh.toFixed(2)} kWh</span>
            <span className={styles.metricSub}>{calc.usableWh.toLocaleString()} Wh of {calc.nominalWh.toLocaleString()} Wh</span>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Full Recharge Units</span>
            <span className={styles.metricValue}>{calc.rechargeUnitsKwh.toFixed(2)} kWh</span>
            <span className={styles.metricSub}>From K-Electric / WAPDA</span>
          </div>
        </div>

        {/* Battery Health & C-Rating Analysis */}
        <div
          className={`${styles.healthCard} ${
            calc.cRate <= 0.15
              ? styles.healthGood
              : calc.cRate <= 0.30
              ? styles.healthWarn
              : styles.healthBad
          }`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {calc.cRate <= 0.15 ? (
              <CheckCircle2 size={18} />
            ) : calc.cRate <= 0.30 ? (
              <AlertTriangle size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <span>
              {calc.cRate <= 0.15
                ? 'Optimal Gentle Discharge (C/7 or slower)'
                : calc.cRate <= 0.30
                ? 'Moderate Load Stress (C/4 to C/3)'
                : 'Heavy Plate Strain (> C/2 discharge)'}
            </span>
          </div>
          <div>
            {calc.cRate <= 0.15
              ? 'Your battery is operating in the sweet spot! Discharge rate is gentle, ensuring maximum cycle lifespan (3–4+ years without early plate degradation).'
              : calc.cRate <= 0.30
              ? 'Standard discharge rate for residential UPS. Ensure electrolyte water levels are maintained monthly.'
              : 'Heavy load warning! Discharging over 50% capacity per hour increases internal heat and shortens tubular battery life. Consider adding a second battery in parallel or reducing AC/Fridge loads.'}
          </div>
        </div>

        {/* Recharging Speed & Cost */}
        <div className={styles.metricBox} style={{ background: 'rgba(0, 240, 255, 0.04)', borderColor: 'rgba(0, 240, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <RefreshCw size={16} />
            <span>Recharge Time & Electricity Bill Impact</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            • <strong>15A Standard Charger:</strong> Approx. <strong>{calc.rechargeTime15A} hours</strong> to 100% full.<br />
            • <strong>25A Fast Charger:</strong> Approx. <strong>{calc.rechargeTime25A} hours</strong> to 100% full.<br />
            • <strong>Recharge Cost:</strong> ~<strong>Rs {calc.costProtectedPkr}</strong> (Protected slab @ Rs 16.5) to <strong>Rs {calc.costUnprotectedPkr}</strong> (Unprotected @ Rs 42).
          </div>
        </div>

        {/* Share Button */}
        <button type="button" className={styles.shareBtn} onClick={handleShare}>
          <Share2 size={18} />
          <span>{copied ? '✓ Calculation Copied to Clipboard!' : 'Share WhatsApp Summary'}</span>
        </button>

        {/* Deep link to OCR Scanner */}
        <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          <Link
            href="/guest"
            style={{
              color: '#2563eb',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Camera size={15} />
            <span>Snap your digital meter with Read Meter OCR to monitor recharge units</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
