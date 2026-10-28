'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './acCalculator.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Zap,
  Wind,
  Thermometer,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Share2,
  ShieldAlert,
} from 'lucide-react'

type AcTechnology = 'inverter' | 'non_inverter'
type AcTonnage = '1.0' | '1.5' | '2.0'

interface TempPreset {
  temp: number
  label: string
  dutyMultiplier: number
  description: string
}

const TEMP_PRESETS: TempPreset[] = [
  { temp: 26, label: '26°C (Recommended Eco Mode)', dutyMultiplier: 0.65, description: 'Comfortable & saves up to 35% electricity' },
  { temp: 24, label: '24°C (Standard Comfort)', dutyMultiplier: 0.8, description: 'Standard cooling, balanced consumption' },
  { temp: 22, label: '22°C (Chilled)', dutyMultiplier: 0.95, description: 'High compressor runtime' },
  { temp: 18, label: '18°C (Extreme Continuous)', dutyMultiplier: 1.15, description: 'Compressor rarely throttles down, maximum unit burn' },
]

export default function AcElectricityCostCalculator() {
  const [tech, setTech] = useState<AcTechnology>('inverter')
  const [tonnage, setTonnage] = useState<AcTonnage>('1.5')
  const [selectedTemp, setSelectedTemp] = useState<number>(26)
  const [dailyHours, setDailyHours] = useState<number>(8)
  const [ratePerKwh, setRatePerKwh] = useState<number>(45)
  const [copied, setCopied] = useState<boolean>(false)

  const calculations = useMemo(() => {
    // Base nominal rated watts
    const baseWatts: Record<AcTonnage, { inverter: number; non_inverter: number }> = {
      '1.0': { inverter: 1000, non_inverter: 1250 },
      '1.5': { inverter: 1500, non_inverter: 1900 },
      '2.0': { inverter: 2000, non_inverter: 2500 },
    }

    const currentPreset = TEMP_PRESETS.find((p) => p.temp === selectedTemp) || TEMP_PRESETS[0]
    const nominal = baseWatts[tonnage][tech]

    // Inverters modulate down; non-inverters duty cycle on/off
    const effectiveAvgWatts = tech === 'inverter' 
      ? nominal * (currentPreset.dutyMultiplier * 0.72) // inverters drop down to 40-70% once set temp is reached
      : nominal * (currentPreset.dutyMultiplier * 0.9)  // non-inverters draw full power when compressor is on

    const dailyUnits = (effectiveAvgWatts * dailyHours) / 1000
    const monthlyUnits = dailyUnits * 30
    const monthlyBill = monthlyUnits * ratePerKwh

    // Comparison against running at 18°C
    const extremePreset = TEMP_PRESETS.find((p) => p.temp === 18)!
    const extremeAvgWatts = tech === 'inverter' 
      ? nominal * (extremePreset.dutyMultiplier * 0.72)
      : nominal * (extremePreset.dutyMultiplier * 0.9)
    const extremeMonthlyUnits = ((extremeAvgWatts * dailyHours) / 1000) * 30
    const extremeMonthlyBill = extremeMonthlyUnits * ratePerKwh
    const monthlySavings = Math.max(0, Math.round(extremeMonthlyBill - monthlyBill))

    // Comparison vs Non-inverter if inverter is picked
    const nonInvAvgWatts = baseWatts[tonnage]['non_inverter'] * (currentPreset.dutyMultiplier * 0.9)
    const nonInvMonthlyUnits = ((nonInvAvgWatts * dailyHours) / 1000) * 30
    const inverterTechSavings = Math.max(0, Math.round((nonInvMonthlyUnits - monthlyUnits) * ratePerKwh))

    return {
      effectiveAvgWatts: Math.round(effectiveAvgWatts),
      dailyUnits: Number(dailyUnits.toFixed(2)),
      monthlyUnits: Math.round(monthlyUnits),
      monthlyBill: Math.round(monthlyBill),
      monthlySavings,
      inverterTechSavings,
    }
  }, [tech, tonnage, selectedTemp, dailyHours, ratePerKwh])

  const copyBreakdown = () => {
    const text = `❄️ Read Meter - AC Electricity Cost & Savings Audit:
AC Model: ${tonnage} Ton ${tech === 'inverter' ? 'Inverter AC' : 'Conventional Non-Inverter AC'}
Thermostat Setting: ${selectedTemp}°C
Usage: ${dailyHours} hours/day
Monthly Electricity: ${calculations.monthlyUnits} kWh / month
Estimated Monthly Cost: Rs. ${calculations.monthlyBill.toLocaleString()} (at Rs. ${ratePerKwh}/unit)
Monthly Savings vs 18°C: Rs. ${calculations.monthlySavings.toLocaleString()} saved!
Calculate free at: https://www.readmeter.online/tools/ac-electricity-cost-calculator`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '1rem' }}>
        <Navbar maxWidth="1100px" />
      </div>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <Wind size={14} /> AC Energy &amp; Bill Optimizer 2026
        </div>
        <h1 className={styles.title}>
          AC Electricity Cost &amp; <span className={styles.titleHighlight}>Inverter Savings Calculator</span>
        </h1>
        <p className={styles.subtitle}>
          Calculate exact kWh consumption and discover how much money you save each month by setting your AC thermostat to 26°C instead of 18°C.
        </p>
      </section>

      <main className={styles.mainContent}>
        {/* Left Inputs */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Thermometer size={20} color="#38bdf8" />
              <span>AC Specifications &amp; Usage</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>AC Technology</label>
            <div className={styles.tabGroup}>
              <button
                type="button"
                className={`${styles.tabBtn} ${tech === 'inverter' ? styles.tabBtnActive : ''}`}
                onClick={() => setTech('inverter')}
              >
                DC Inverter AC
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${tech === 'non_inverter' ? styles.tabBtnActive : ''}`}
                onClick={() => setTech('non_inverter')}
              >
                Non-Inverter AC
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>AC Tonnage / Capacity</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(['1.0', '1.5', '2.0'] as AcTonnage[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.tabBtn} ${tonnage === t ? styles.tabBtnActive : ''}`}
                  onClick={() => setTonnage(t)}
                >
                  {t} Ton
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Thermostat Temperature Setting</label>
            <select
              className={styles.select}
              value={selectedTemp}
              onChange={(e) => setSelectedTemp(Number(e.target.value))}
            >
              {TEMP_PRESETS.map((p) => (
                <option key={p.temp} value={p.temp}>
                  {p.label}
                </option>
              ))}
            </select>
            <span className={styles.helperText}>
              {TEMP_PRESETS.find((p) => p.temp === selectedTemp)?.description}
            </span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Daily Running Hours</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min={1}
                max={24}
                className={styles.slider}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{dailyHours} hrs</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Electricity Tariff (Rs. per Unit)</label>
            <input
              type="number"
              min={1}
              max={200}
              className={styles.input}
              value={ratePerKwh}
              onChange={(e) => setRatePerKwh(Math.max(1, Number(e.target.value) || 1))}
            />
            <span className={styles.helperText}>Default Rs. 45/kWh (standard unprotected domestic tariff)</span>
          </div>
        </div>

        {/* Right Results */}
        <div className={styles.resultCard}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Monthly AC Cost Forecast
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                ~{calculations.effectiveAvgWatts}W avg load
              </span>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Monthly Units</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  {calculations.monthlyUnits}
                  <span className={styles.statUnit}>kWh</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Monthly Bill Cost</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  Rs. {calculations.monthlyBill.toLocaleString()}
                  <span className={styles.statUnit}>/mo</span>
                </div>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Units</div>
                <div className={styles.statNumber}>
                  {calculations.dailyUnits}
                  <span className={styles.statUnit}>kWh</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Expense</div>
                <div className={styles.statNumber}>
                  Rs. {Math.round(calculations.dailyUnits * ratePerKwh)}
                  <span className={styles.statUnit}>/day</span>
                </div>
              </div>
            </div>

            {selectedTemp >= 24 && (
              <div className={styles.savingsBox}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <TrendingDown size={18} color="#10b981" />
                  Eco-Temperature Savings:
                </div>
                By running at <strong>{selectedTemp}°C</strong> instead of chilled 18°C, you save approximately{' '}
                <strong>Rs. {calculations.monthlySavings.toLocaleString()} per month</strong> on this single AC!
              </div>
            )}

            {tech === 'inverter' && (
              <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                💡 Inverter Advantage: Saves approx <strong>Rs. {calculations.inverterTechSavings.toLocaleString()}/mo</strong> compared to an old non-inverter unit.
              </div>
            )}
          </div>

          <div>
            <button type="button" className={styles.actionBtn} onClick={copyBreakdown}>
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied AC Audit to Clipboard!
                </>
              ) : (
                <>
                  <Share2 size={18} /> Copy / Share AC Calculation
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
