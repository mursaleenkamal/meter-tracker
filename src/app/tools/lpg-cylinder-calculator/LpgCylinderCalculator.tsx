'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './lpgCalculator.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Flame,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  Share2,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react'

const CYLINDER_PRESETS = [
  { label: '11.8 kg (Standard Domestic)', capacity: 11.8 },
  { label: '45.4 kg (Commercial Plaza / Hotel)', capacity: 45.4 },
  { label: '5.0 kg (Compact / Camping / Student)', capacity: 5.0 },
]

export default function LpgCylinderCalculator() {
  const [cylinderCapacity, setCylinderCapacity] = useState<number>(11.8)
  const [burnerCount, setBurnerCount] = useState<number>(2)
  const [stoveHoursDaily, setStoveHoursDaily] = useState<number>(3)
  const [geyserHoursDaily, setGeyserHoursDaily] = useState<number>(0.5) // instant water heater
  const [refillCost, setRefillCost] = useState<number>(3200)
  const [copied, setCopied] = useState<boolean>(false)

  const calculations = useMemo(() => {
    // Average domestic burner consumes ~0.15 kg LPG per hour on medium flame
    const stoveDailyKg = burnerCount * stoveHoursDaily * 0.15

    // Instant gas geyser consumes ~0.50 kg LPG per hour of active hot water flow
    const geyserDailyKg = geyserHoursDaily * 0.5

    const totalDailyKg = Number((stoveDailyKg + geyserDailyKg).toFixed(2))
    const daysRemaining = totalDailyKg > 0 ? Number((cylinderCapacity / totalDailyKg).toFixed(1)) : 999

    const dailyCost = totalDailyKg > 0 ? Math.round((refillCost / cylinderCapacity) * totalDailyKg) : 0
    const monthlyCost = dailyCost * 30

    // Projected exhaustion date
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + Math.floor(daysRemaining))
    const dateFormatted = expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    return {
      totalDailyKg,
      daysRemaining,
      dailyCost,
      monthlyCost,
      dateFormatted,
    }
  }, [cylinderCapacity, burnerCount, stoveHoursDaily, geyserHoursDaily, refillCost])

  const copyBreakdown = () => {
    const text = `🔥 Read Meter - LPG Gas Cylinder Duration Audit:
Cylinder Size: ${cylinderCapacity} kg
Daily Consumption: ~${calculations.totalDailyKg} kg/day (${burnerCount} burners + ${geyserHoursDaily}h geyser)
Expected Duration: ~${calculations.daysRemaining} Days
Projected Refill Date: ${calculations.dateFormatted}
Estimated Daily Expense: Rs. ${calculations.dailyCost.toLocaleString()}/day
Estimated Monthly Gas Budget: Rs. ${calculations.monthlyCost.toLocaleString()}/mo
Calculate free at: https://www.readmeter.online/tools/lpg-cylinder-calculator`

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
          <Flame size={14} /> LPG Gas Cylinder Management 2026
        </div>
        <h1 className={styles.title}>
          LPG Cylinder Days &amp; <span className={styles.titleHighlight}>Consumption Calculator</span>
        </h1>
        <p className={styles.subtitle}>
          Calculate exactly how many days your 11.8 kg domestic cylinder will last based on stove burner hours and geyser usage, with automatic refill date forecasting.
        </p>
      </section>

      <main className={styles.mainContent}>
        {/* Left Inputs */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Flame size={20} color="#f43f5e" />
              <span>Cylinder &amp; Burner Usage</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Select Cylinder Size</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {CYLINDER_PRESETS.map((p) => (
                <button
                  key={p.capacity}
                  type="button"
                  style={{
                    background: cylinderCapacity === p.capacity ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                    border: cylinderCapacity === p.capacity ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: cylinderCapacity === p.capacity ? '#f43f5e' : '#94a3b8',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                  onClick={() => setCylinderCapacity(p.capacity)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Active Stove Burners</label>
              <input
                type="number"
                min={1}
                max={10}
                className={styles.input}
                value={burnerCount}
                onChange={(e) => setBurnerCount(Math.max(1, Number(e.target.value) || 1))}
              />
              <span className={styles.helperText}>Number of active burners</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Daily Stove Usage (Hours)</label>
              <input
                type="number"
                min={0.5}
                max={24}
                step={0.5}
                className={styles.input}
                value={stoveHoursDaily}
                onChange={(e) => setStoveHoursDaily(Math.max(0.5, Number(e.target.value) || 1))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Gas Geyser Usage (Hours/Day)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.25}
                className={styles.input}
                value={geyserHoursDaily}
                onChange={(e) => setGeyserHoursDaily(Math.max(0, Number(e.target.value) || 0))}
              />
              <span className={styles.helperText}>Hot water shower &amp; washing</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Cylinder Refill Cost (Rs.)</label>
              <input
                type="number"
                min={1000}
                max={30000}
                step={100}
                className={styles.input}
                value={refillCost}
                onChange={(e) => setRefillCost(Math.max(500, Number(e.target.value) || 1000))}
              />
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className={styles.resultCard}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                LPG Duration Forecast
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                ~{calculations.totalDailyKg} kg / day
              </span>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Expected Days Left</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  {calculations.daysRemaining}
                  <span className={styles.statUnit}>Days</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Projected Refill Date</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`} style={{ fontSize: '1.25rem' }}>
                  {calculations.dateFormatted}
                </div>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Gas Cost</div>
                <div className={styles.statNumber}>
                  Rs. {calculations.dailyCost.toLocaleString()}
                  <span className={styles.statUnit}>/day</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Monthly Gas Expense</div>
                <div className={styles.statNumber}>
                  Rs. {calculations.monthlyCost.toLocaleString()}
                  <span className={styles.statUnit}>/mo</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', color: '#fecdd3', fontSize: '0.85rem' }}>
              💡 Smart Tip: A typical domestic 11.8 kg cylinder lasts <strong>18 to 24 days</strong> in moderate Pakistani households. Always order your replacement 2 days before <strong>{calculations.dateFormatted}</strong> to avoid running out mid-cooking.
            </div>
          </div>

          <div>
            <button type="button" className={styles.actionBtn} onClick={copyBreakdown}>
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied LPG Audit to Clipboard!
                </>
              ) : (
                <>
                  <Share2 size={18} /> Copy / Share Duration Summary
                </>
              )}
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                href="/tools/read-gas-meter"
                style={{ color: '#00f0ff', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Need to read an SSGC / SNGPL meter? Try Gas Roller OCR <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer maxWidth="1100px" />
    </div>
  )
}
