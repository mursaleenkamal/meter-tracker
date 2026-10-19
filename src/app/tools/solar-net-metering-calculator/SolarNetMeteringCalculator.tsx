'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './solarCalculator.module.css'
import {
  Sun,
  Zap,
  TrendingUp,
  DollarSign,
  Calendar,
  Leaf,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

interface CitySunProfile {
  name: string
  peakSunHours: number
}

const CITY_PROFILES: CitySunProfile[] = [
  { name: 'Karachi (Sindh)', peakSunHours: 4.8 },
  { name: 'Lahore (Punjab)', peakSunHours: 4.4 },
  { name: 'Islamabad / Rawalpindi', peakSunHours: 4.5 },
  { name: 'Multan (South Punjab)', peakSunHours: 5.0 },
  { name: 'Peshawar (KPK)', peakSunHours: 4.4 },
  { name: 'Quetta (Balochistan)', peakSunHours: 5.2 },
]

const SYSTEM_CAPACITY_PRESETS = [3, 5, 7, 10, 12, 15, 20]

export default function SolarNetMeteringCalculator() {
  const [capacityKw, setCapacityKw] = useState<number>(5)
  const [selectedCity, setSelectedCity] = useState<string>('Karachi (Sindh)')
  const [monthlyGridUnits, setMonthlyGridUnits] = useState<number>(750)
  const [selfConsumptionPercent, setSelfConsumptionPercent] = useState<number>(50)
  const [gridRetailRate, setGridRetailRate] = useState<number>(44)
  const [exportBuybackRate, setExportBuybackRate] = useState<number>(21)
  const [customCostOverride, setCustomCostOverride] = useState<number | null>(null)

  // Calculations
  const calculations = useMemo(() => {
    const city = CITY_PROFILES.find((c) => c.name === selectedCity) || CITY_PROFILES[0]
    const sunHours = city.peakSunHours
    // Typical real-world system performance ratio in Pakistan (dust, heat derating, inverter efficiency) ~ 80%
    const performanceRatio = 0.80

    const dailyUnits = capacityKw * sunHours * performanceRatio
    const monthlyUnits = Math.round(dailyUnits * 30)
    const annualUnits = Math.round(monthlyUnits * 12)

    // Capital cost estimate: ~Rs 165,000 per kW (Tier 1 bifacial + on-grid inverter + net meter approval fees)
    const defaultTotalCost = capacityKw * 165000
    const totalCost = customCostOverride !== null ? customCostOverride : defaultTotalCost

    // Daytime consumption vs Export
    const selfConsumedUnits = Math.min(monthlyGridUnits, Math.round(monthlyUnits * (selfConsumptionPercent / 100)))
    const exportedUnits = Math.max(0, monthlyUnits - selfConsumedUnits)

    // Financials
    const selfConsumptionSavings = Math.round(selfConsumedUnits * gridRetailRate)
    const exportCredit = Math.round(exportedUnits * exportBuybackRate)
    const totalMonthlySavings = selfConsumptionSavings + exportCredit
    const annualSavings = totalMonthlySavings * 12

    // Bill comparison
    const oldMonthlyBill = Math.round(monthlyGridUnits * gridRetailRate)
    const gridImportNeeded = Math.max(0, monthlyGridUnits - selfConsumedUnits)
    const grossImportCost = Math.round(gridImportNeeded * gridRetailRate)
    const newNetMonthlyBill = Math.max(0, grossImportCost - exportCredit)

    // Payback & ROI
    const paybackYearsRaw = totalCost > 0 && annualSavings > 0 ? totalCost / annualSavings : 0
    const paybackYears = Math.floor(paybackYearsRaw)
    const paybackMonths = Math.round((paybackYearsRaw - paybackYears) * 12)
    const fiveYearNetProfit = Math.round((annualSavings * 5) - totalCost)

    // Environmental metrics
    const annualCo2Kg = Math.round(annualUnits * 0.82)
    const treesEquivalent = Math.round(annualCo2Kg / 22)

    return {
      sunHours,
      dailyUnits: dailyUnits.toFixed(1),
      monthlyUnits,
      annualUnits,
      totalCost,
      selfConsumedUnits,
      exportedUnits,
      selfConsumptionSavings,
      exportCredit,
      totalMonthlySavings,
      annualSavings,
      oldMonthlyBill,
      newNetMonthlyBill,
      paybackYears,
      paybackMonths,
      fiveYearNetProfit,
      annualCo2Kg,
      treesEquivalent,
    }
  }, [
    capacityKw,
    selectedCity,
    monthlyGridUnits,
    selfConsumptionPercent,
    gridRetailRate,
    exportBuybackRate,
    customCostOverride,
  ])

  return (
    <div className={styles.calculatorCard}>
      {/* Control Inputs */}
      <div>
        <div className={styles.cardSectionTitle}>
          <Sun size={20} color="#fbbf24" />
          <span>1. Solar System & Site Parameters</span>
        </div>

        <div className={styles.controlGrid} style={{ marginTop: '1.25rem' }}>
          {/* Capacity Slider & Presets */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <div className={styles.label}>
              <span>⚡ Solar System Capacity</span>
              <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>
                {capacityKw} kW System
              </span>
            </div>
            <div className={styles.quickPills}>
              {SYSTEM_CAPACITY_PRESETS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  className={`${styles.quickPill} ${capacityKw === kw ? styles.quickPillActive : ''}`}
                  onClick={() => setCapacityKw(kw)}
                >
                  {kw} kW
                </button>
              ))}
            </div>
            <div className={styles.sliderContainer} style={{ marginTop: '0.5rem' }}>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={capacityKw}
                onChange={(e) => setCapacityKw(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          {/* City / Location */}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="solar-city">
              <span>📍 City / Solar Irradiance</span>
              <span className={styles.labelHint}>{calculations.sunHours} peak sun hrs/day</span>
            </label>
            <select
              id="solar-city"
              className={styles.select}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITY_PROFILES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} (~{city.peakSunHours} hrs)
                </option>
              ))}
            </select>
          </div>

          {/* Current Grid Consumption */}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="grid-units">
              <span>🔌 Current Grid Consumption</span>
              <span className={styles.labelHint}>Monthly units (kWh)</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="grid-units"
                type="number"
                className={styles.inputField}
                value={monthlyGridUnits === 0 ? '' : monthlyGridUnits}
                onChange={(e) => setMonthlyGridUnits(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 750"
                min="0"
              />
              <span className={styles.unitSuffix}>Units</span>
            </div>
          </div>

          {/* Grid Retail Tariff */}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="retail-rate">
              <span>💡 DISCO Retail Tariff</span>
              <span className={styles.labelHint}>Off-peak blended</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="retail-rate"
                type="number"
                className={styles.inputField}
                value={gridRetailRate === 0 ? '' : gridRetailRate}
                onChange={(e) => setGridRetailRate(Math.max(1, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 44"
                min="1"
              />
              <span className={styles.unitSuffix}>Rs / Unit</span>
            </div>
          </div>

          {/* NEPRA Buyback Rate */}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="export-rate">
              <span>🔄 NEPRA Export Buyback Rate</span>
              <span className={styles.labelHint}>National basket rate</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="export-rate"
                type="number"
                className={styles.inputField}
                value={exportBuybackRate === 0 ? '' : exportBuybackRate}
                onChange={(e) => setExportBuybackRate(Math.max(1, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 21"
                min="1"
              />
              <span className={styles.unitSuffix}>Rs / Unit</span>
            </div>
          </div>

          {/* Daytime Self Consumption % Slider */}
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <div className={styles.label}>
              <span>☀️ Daytime Self-Consumption vs Grid Export</span>
              <span style={{ color: '#00f0ff', fontWeight: 700 }}>
                {selfConsumptionPercent}% Used Direct / {100 - selfConsumptionPercent}% Exported
              </span>
            </div>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={selfConsumptionPercent}
                onChange={(e) => setSelfConsumptionPercent(parseInt(e.target.value, 10))}
                className={styles.slider}
                style={{ accentColor: '#00f0ff' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results & Payback Section */}
      <div className={styles.resultPanel}>
        {/* Payback Banner */}
        <div className={styles.paybackHighlight}>
          <div>
            <div className={styles.paybackTitle}>
              🚀 Estimated Payback: {calculations.paybackYears} Years {calculations.paybackMonths} Months
            </div>
            <div className={styles.paybackDesc}>
              System pays for itself in ~{calculations.paybackYears} years. Expected 5-year net profit: Rs{' '}
              {calculations.fiveYearNetProfit.toLocaleString()} PKR.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.paybackYears}>
              {calculations.paybackYears}.{Math.round((calculations.paybackMonths / 12) * 10)}
            </div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6ee7b7', fontWeight: 700 }}>
              Years to Breakeven
            </span>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Monthly Generation</span>
            <span className={styles.kpiValue} style={{ color: '#fbbf24' }}>
              {calculations.monthlyUnits.toLocaleString()}
            </span>
            <span className={styles.kpiSub}>kWh / Units (~{calculations.dailyUnits} / day)</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Monthly Bill Savings</span>
            <span className={styles.kpiValue} style={{ color: '#10b981' }}>
              Rs {calculations.totalMonthlySavings.toLocaleString()}
            </span>
            <span className={styles.kpiSub}>Annual: Rs {calculations.annualSavings.toLocaleString()}</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Old vs New Bill</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: '#64748b' }}>
                Rs {calculations.oldMonthlyBill.toLocaleString()}
              </span>
              <span className={styles.kpiValue} style={{ color: '#00f0ff', fontSize: '1.35rem' }}>
                Rs {calculations.newNetMonthlyBill.toLocaleString()}
              </span>
            </div>
            <span className={styles.kpiSub}>Estimated net utility invoice</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Carbon Offset</span>
            <span className={styles.kpiValue} style={{ color: '#34d399' }}>
              {calculations.annualCo2Kg.toLocaleString()} kg
            </span>
            <span className={styles.kpiSub}>~{calculations.treesEquivalent} mature trees planted/yr</span>
          </div>
        </div>

        {/* Unit Flow Table */}
        <div className={styles.breakdownTableWrapper}>
          <table className={styles.breakdownTable}>
            <thead>
              <tr>
                <th>Generation Metric</th>
                <th>Units (kWh)</th>
                <th>Rate Applied</th>
                <th>Monthly Financial Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>☀️ Daytime Self-Consumption</td>
                <td>{calculations.selfConsumedUnits} Units</td>
                <td>Rs {gridRetailRate} / unit</td>
                <td style={{ color: '#10b981', fontWeight: 700 }}>
                  Rs {calculations.selfConsumptionSavings.toLocaleString()} (Direct Saving)
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>🔄 Green Meter Export (NEPRA)</td>
                <td>{calculations.exportedUnits} Units</td>
                <td>Rs {exportBuybackRate} / unit</td>
                <td style={{ color: '#fbbf24', fontWeight: 700 }}>
                  Rs {calculations.exportCredit.toLocaleString()} (Bill Credit)
                </td>
              </tr>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', fontWeight: 800 }}>
                <td>Total Monthly Benefit</td>
                <td>{calculations.monthlyUnits} Units</td>
                <td>Blended</td>
                <td style={{ color: '#00f0ff', fontSize: '1.1rem' }}>
                  Rs {calculations.totalMonthlySavings.toLocaleString()} / month
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PWA Tracking Conversion CTA */}
        <div className={styles.pwaCtaBanner}>
          <div className={styles.ctaTextContent}>
            <div className={styles.ctaTitle}>
              📸 Track your Green Net Meter readings with Read Meter Camera Scanner
            </div>
            <div className={styles.ctaDescription}>
              DISCO meter readers often make errors on Import vs Export solar dials. Snap your bidirectional meter
              monthly on Read Meter PWA to keep photographic audit trails and verify your solar credits!
            </div>
          </div>
          <Link href="/guest" className={styles.ctaButton}>
            <Camera size={18} />
            <span>Try Camera OCR (Guest)</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
