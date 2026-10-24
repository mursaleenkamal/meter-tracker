'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './solarSizing.module.css'
import {
  Sun,
  Zap,
  Layers,
  Home,
  CheckCircle2,
  Share2,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react'

export default function SolarSystemSizingCalculator() {
  const [calculationMode, setCalculationMode] = useState<'units' | 'bill'>('units')
  const [monthlyUnits, setMonthlyUnits] = useState<number>(650)
  const [monthlyBill, setMonthlyBill] = useState<number>(35000)
  const [peakSunHours, setPeakSunHours] = useState<number>(4.8) // standard for Pakistan
  const [panelWattage, setPanelWattage] = useState<number>(585) // standard 580W-585W bifacial
  const [copied, setCopied] = useState<boolean>(false)

  const calculations = useMemo(() => {
    // If bill mode, approximate units based on average Rs 52/unit tariff with taxes
    const units = calculationMode === 'units' ? monthlyUnits : Math.round(monthlyBill / 52)
    const dailyKwhNeeded = units / 30

    // Solar system size in kW = Daily kWh / Peak Sun Hours / 0.8 (system efficiency factor)
    const rawKw = dailyKwhNeeded / (peakSunHours * 0.8)
    const recommendedKw = Math.ceil(rawKw * 2) / 2 // round to nearest 0.5 kW

    // Number of panels
    const totalWattsNeeded = recommendedKw * 1000
    const panelsCount = Math.ceil(totalWattsNeeded / panelWattage)
    const actualDcKw = Number(((panelsCount * panelWattage) / 1000).toFixed(2))

    // Inverter size
    const inverterKw = Math.ceil(actualDcKw)

    // Roof space required: ~28 sq ft per panel
    const roofSpaceSqFt = panelsCount * 28

    // Expected monthly solar generation
    const dailyGeneration = actualDcKw * peakSunHours * 0.8
    const monthlyGeneration = Math.round(dailyGeneration * 30)

    // Estimated monthly bill reduction
    const monthlySavings = Math.round(monthlyGeneration * 50)

    return {
      units,
      recommendedKw,
      actualDcKw,
      panelsCount,
      inverterKw,
      roofSpaceSqFt,
      monthlyGeneration,
      monthlySavings,
    }
  }, [calculationMode, monthlyUnits, monthlyBill, peakSunHours, panelWattage])

  const copyBreakdown = () => {
    const text = `☀️ Read Meter - Solar System Sizing Proposal:
Target Consumption: ${calculations.units} kWh / month
Recommended Solar System: ${calculations.actualDcKw} kW DC (${calculations.inverterKw} kW Inverter)
Solar Panels Needed: ${calculations.panelsCount} x ${panelWattage}W Mono PERC / Bifacial Panels
Roof Space Required: ~${calculations.roofSpaceSqFt} sq. ft (Shadow-Free)
Estimated Generation: ~${calculations.monthlyGeneration} kWh / month
Estimated Monthly Savings: ~Rs. ${calculations.monthlySavings.toLocaleString()}
Calculate free at: https://www.readmeter.online/tools/solar-system-sizing-calculator`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Zap size={24} color="#00f0ff" />
          Read<span>Meter</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/tools" className={styles.navBtn}>
            ← All Tools
          </Link>
          <Link href="/tools/solar-net-metering-calculator" className={styles.navBtn}>
            Net Metering ROI
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sun size={14} /> Solar Sizing &amp; Capacity 2026
        </div>
        <h1 className={styles.title}>
          Solar System Sizing &amp; <span className={styles.titleHighlight}>Inverter Calculator</span>
        </h1>
        <p className={styles.subtitle}>
          Calculate exactly how many kilowatts (kW), 585W bifacial solar panels, and roof space you need to offset your home electricity bill.
        </p>
      </section>

      <main className={styles.mainContent}>
        {/* Left Inputs */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Sun size={20} color="#fbbf24" />
              <span>Electricity Consumption</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Calculate Based On:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                style={{
                  background: calculationMode === 'units' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                  border: calculationMode === 'units' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: calculationMode === 'units' ? '#fbbf24' : '#94a3b8',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => setCalculationMode('units')}
              >
                Monthly Units (kWh)
              </button>
              <button
                type="button"
                style={{
                  background: calculationMode === 'bill' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                  border: calculationMode === 'bill' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: calculationMode === 'bill' ? '#fbbf24' : '#94a3b8',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => setCalculationMode('bill')}
              >
                Monthly Bill (PKR)
              </button>
            </div>
          </div>

          {calculationMode === 'units' ? (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Monthly Units Consumed (kWh)</label>
              <input
                type="number"
                min={100}
                max={15000}
                className={styles.input}
                value={monthlyUnits}
                onChange={(e) => setMonthlyUnits(Math.max(50, Number(e.target.value) || 0))}
              />
              <span className={styles.helperText}>Average monthly units from your utility bill</span>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Average Monthly Bill (PKR)</label>
              <input
                type="number"
                min={5000}
                max={500000}
                step={1000}
                className={styles.input}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Math.max(1000, Number(e.target.value) || 0))}
              />
              <span className={styles.helperText}>Equivalent to ~{calculations.units} monthly units</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Panel Wattage</label>
              <select
                className={styles.select}
                value={panelWattage}
                onChange={(e) => setPanelWattage(Number(e.target.value))}
              >
                <option value={550}>550W Mono PERC</option>
                <option value={585}>585W N-Type / Bifacial (Most Common)</option>
                <option value={600}>600W Tier-1 Panel</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Daily Peak Sun Hours</label>
              <input
                type="number"
                min={3}
                max={7}
                step={0.1}
                className={styles.input}
                value={peakSunHours}
                onChange={(e) => setPeakSunHours(Number(e.target.value) || 4.5)}
              />
              <span className={styles.helperText}>Average 4.8 hrs in Pakistan</span>
            </div>
          </div>
        </div>

        {/* Right Output Results */}
        <div className={styles.resultCard}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Recommended Solar Specs
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Offset 100% of Units
              </span>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Recommended Capacity</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  {calculations.actualDcKw}
                  <span className={styles.statUnit}>kW DC</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Solar Panels Needed</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  {calculations.panelsCount}
                  <span className={styles.statUnit}>Panels</span>
                </div>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Inverter Size</div>
                <div className={styles.statNumber}>
                  {calculations.inverterKw}
                  <span className={styles.statUnit}>kW Hybrid/On-Grid</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Roof Space Needed</div>
                <div className={styles.statNumber}>
                  {calculations.roofSpaceSqFt}
                  <span className={styles.statUnit}>sq. ft</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', color: '#fef3c7', fontSize: '0.85rem' }}>
              ⚡ Expected Generation: <strong>~{calculations.monthlyGeneration} units/mo</strong>. Estimated bill savings: <strong>Rs. {calculations.monthlySavings.toLocaleString()}/month</strong>.
            </div>
          </div>

          <div>
            <button type="button" className={styles.actionBtn} onClick={copyBreakdown}>
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied Solar Specs to Clipboard!
                </>
              ) : (
                <>
                  <Share2 size={18} /> Copy / Share Sizing Proposal
                </>
              )}
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                href="/tools/solar-net-metering-calculator"
                style={{ color: '#fbbf24', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Calculate Net Metering Green Meter ROI <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
