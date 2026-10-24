'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './generatorCalculator.module.css'
import {
  Flame,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Fuel,
} from 'lucide-react'

type FuelType = 'petrol' | 'diesel' | 'lpg'

interface FuelSpec {
  name: string
  defaultPrice: number
  unit: string
  burnRatePerKwHour: number // liters or kg per kW generated
}

const FUEL_SPECS: Record<FuelType, FuelSpec> = {
  petrol: {
    name: 'Petrol (Gasoline)',
    defaultPrice: 280,
    unit: 'Liters',
    burnRatePerKwHour: 0.38, // ~0.38L per kWh at 75% load
  },
  diesel: {
    name: 'High Speed Diesel (HSD)',
    defaultPrice: 285,
    unit: 'Liters',
    burnRatePerKwHour: 0.28, // ~0.28L per kWh (more efficient thermal density)
  },
  lpg: {
    name: 'LPG / Gas Kit',
    defaultPrice: 250,
    unit: 'Kg',
    burnRatePerKwHour: 0.34, // ~0.34 kg per kWh
  },
}

export default function GeneratorFuelCostCalculator() {
  const [generatorCapacityKva, setGeneratorCapacityKva] = useState<number>(3.5)
  const [fuelType, setFuelType] = useState<FuelType>('petrol')
  const [fuelPrice, setFuelPrice] = useState<number>(280)
  const [dailyHours, setDailyHours] = useState<number>(3)
  const [loadPercentage, setLoadPercentage] = useState<number>(75)
  const [copied, setCopied] = useState<boolean>(false)

  const calculations = useMemo(() => {
    // Power factor ~ 0.8: kW = kVA * 0.8
    const maxKw = generatorCapacityKva * 0.8
    const runningKw = maxKw * (loadPercentage / 100)

    const spec = FUEL_SPECS[fuelType]
    const hourlyFuelBurn = Number((runningKw * spec.burnRatePerKwHour).toFixed(2))
    const hourlyCost = Math.round(hourlyFuelBurn * fuelPrice)

    const dailyFuelBurn = Number((hourlyFuelBurn * dailyHours).toFixed(1))
    const dailyCost = Math.round(dailyFuelBurn * fuelPrice)
    const monthlyCost = Math.round(dailyCost * 30)

    // Cost per kWh generated
    const effectiveCostPerUnit = Math.round(hourlyCost / (runningKw || 1))

    return {
      runningKw: Number(runningKw.toFixed(1)),
      hourlyFuelBurn,
      dailyFuelBurn,
      hourlyCost,
      dailyCost,
      monthlyCost,
      effectiveCostPerUnit,
    }
  }, [generatorCapacityKva, fuelType, fuelPrice, dailyHours, loadPercentage])

  const copyBreakdown = () => {
    const spec = FUEL_SPECS[fuelType]
    const text = `⛽ Read Meter - Generator Fuel Expense Audit:
Generator: ${generatorCapacityKva} kVA (~${calculations.runningKw} kW load) running on ${spec.name}
Fuel Burn: ${calculations.hourlyFuelBurn} ${spec.unit}/hour (~${calculations.dailyFuelBurn} ${spec.unit}/day for ${dailyHours} hrs)
Hourly Cost: Rs. ${calculations.hourlyCost.toLocaleString()}/hr
Daily Fuel Cost: Rs. ${calculations.dailyCost.toLocaleString()}/day
Monthly Out-of-Pocket Expense: Rs. ${calculations.monthlyCost.toLocaleString()}/month
Effective Cost per Unit (kWh): Rs. ${calculations.effectiveCostPerUnit}/unit (vs Grid Tariff ~Rs 45/unit)
Calculate free at: https://www.readmeter.online/tools/generator-fuel-cost-calculator`

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
          <Link href="/tools/battery-backup-calculator" className={styles.navBtn}>
            UPS Battery Backup
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <Fuel size={14} /> Generator Fuel &amp; Load-Shedding 2026
        </div>
        <h1 className={styles.title}>
          Generator Fuel Cost &amp; <span className={styles.titleHighlight}>Backup Calculator</span>
        </h1>
        <p className={styles.subtitle}>
          Calculate hourly fuel burn in liters or kg, daily load shedding expenses, and effective cost per unit (kWh) for petrol, diesel, and gas generators.
        </p>
      </section>

      <main className={styles.mainContent}>
        {/* Left Inputs */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Fuel size={20} color="#f97316" />
              <span>Generator &amp; Fuel Settings</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Fuel Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(['petrol', 'diesel', 'lpg'] as FuelType[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  style={{
                    background: fuelType === f ? 'rgba(249, 115, 22, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                    border: fuelType === f ? '1px solid #f97316' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: fuelType === f ? '#f97316' : '#94a3b8',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                  onClick={() => {
                    setFuelType(f)
                    setFuelPrice(FUEL_SPECS[f].defaultPrice)
                  }}
                >
                  {FUEL_SPECS[f].name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Generator Size (kVA)</label>
              <input
                type="number"
                min={0.8}
                max={50}
                step={0.5}
                className={styles.input}
                value={generatorCapacityKva}
                onChange={(e) => setGeneratorCapacityKva(Math.max(0.5, Number(e.target.value) || 1))}
              />
              <span className={styles.helperText}>Rated capacity (e.g. 1kVA, 3.5kVA, 7kVA)</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Fuel Price (Rs. per {FUEL_SPECS[fuelType].unit})</label>
              <input
                type="number"
                min={50}
                max={500}
                className={styles.input}
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Load Percentage (%)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {[50, 75, 90].map((l) => (
                <button
                  key={l}
                  type="button"
                  style={{
                    background: loadPercentage === l ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: loadPercentage === l ? '1px solid #f97316' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: loadPercentage === l ? '#f97316' : '#cbd5e1',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setLoadPercentage(l)}
                >
                  {l}% Load
                </button>
              ))}
            </div>
            <input
              type="range"
              min={25}
              max={100}
              className={styles.input}
              value={loadPercentage}
              onChange={(e) => setLoadPercentage(Number(e.target.value))}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Daily Run Time (Hours)</label>
            <input
              type="number"
              min={0.5}
              max={24}
              step={0.5}
              className={styles.input}
              value={dailyHours}
              onChange={(e) => setDailyHours(Math.max(0.5, Number(e.target.value) || 1))}
            />
            <span className={styles.helperText}>Average daily load-shedding duration</span>
          </div>
        </div>

        {/* Right Results */}
        <div className={styles.resultCard}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Generator Running Cost Forecast
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {calculations.runningKw} kW effective load
              </span>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Hourly Consumption</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  {calculations.hourlyFuelBurn}
                  <span className={styles.statUnit}>{FUEL_SPECS[fuelType].unit}/hr</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Hourly Expense</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  Rs. {calculations.hourlyCost.toLocaleString()}
                  <span className={styles.statUnit}>/hr</span>
                </div>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Fuel Cost</div>
                <div className={styles.statNumber}>
                  Rs. {calculations.dailyCost.toLocaleString()}
                  <span className={styles.statUnit}>/day</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Monthly Expense</div>
                <div className={styles.statNumber}>
                  Rs. {calculations.monthlyCost.toLocaleString()}
                  <span className={styles.statUnit}>/mo</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.85rem' }}>
              ⚠️ Effective Electricity Cost: <strong>Rs. {calculations.effectiveCostPerUnit} per unit (kWh)</strong>. This is ~2.5x more expensive than grid power! Installing a solar/inverter battery backup can recover its cost in under 8 months.
            </div>
          </div>

          <div>
            <button type="button" className={styles.actionBtn} onClick={copyBreakdown}>
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied Fuel Audit to Clipboard!
                </>
              ) : (
                <>
                  <Share2 size={18} /> Copy / Share Fuel Audit
                </>
              )}
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                href="/tools/battery-backup-calculator"
                style={{ color: '#00f0ff', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Compare With UPS Battery Backup Hours <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
