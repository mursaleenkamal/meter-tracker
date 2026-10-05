'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './calculator.module.css'
import { Zap, Camera, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'

interface DiscoRates {
  name: string
  protectedRate100: number
  protectedRate200: number
  unprotectedRate100: number
  unprotectedRate200: number
  unprotectedRate300: number
  unprotectedRateAbove: number
  fixedCharge: number
  fpaPerUnit: number
}

const DISCOS: Record<string, DiscoRates> = {
  kelectric: {
    name: 'K-Electric (Karachi)',
    protectedRate100: 7.74,
    protectedRate200: 14.95,
    unprotectedRate100: 16.48,
    unprotectedRate200: 22.95,
    unprotectedRate300: 34.26,
    unprotectedRateAbove: 42.10,
    fixedCharge: 200,
    fpaPerUnit: 3.20,
  },
  iesco: {
    name: 'IESCO (Islamabad / Rawalpindi)',
    protectedRate100: 7.74,
    protectedRate200: 14.95,
    unprotectedRate100: 16.48,
    unprotectedRate200: 22.95,
    unprotectedRate300: 34.26,
    unprotectedRateAbove: 42.10,
    fixedCharge: 200,
    fpaPerUnit: 2.90,
  },
  lesco: {
    name: 'LESCO (Lahore / Punjab)',
    protectedRate100: 7.74,
    protectedRate200: 14.95,
    unprotectedRate100: 16.48,
    unprotectedRate200: 22.95,
    unprotectedRate300: 34.26,
    unprotectedRateAbove: 42.10,
    fixedCharge: 200,
    fpaPerUnit: 3.10,
  },
  fesco: {
    name: 'FESCO (Faisalabad)',
    protectedRate100: 7.74,
    protectedRate200: 14.95,
    unprotectedRate100: 16.48,
    unprotectedRate200: 22.95,
    unprotectedRate300: 34.26,
    unprotectedRateAbove: 42.10,
    fixedCharge: 200,
    fpaPerUnit: 3.00,
  },
  mepco: {
    name: 'MEPCO (Multan / South Punjab)',
    protectedRate100: 7.74,
    protectedRate200: 14.95,
    unprotectedRate100: 16.48,
    unprotectedRate200: 22.95,
    unprotectedRate300: 34.26,
    unprotectedRateAbove: 42.10,
    fixedCharge: 200,
    fpaPerUnit: 3.15,
  },
}

export default function ProtectedSlabCalculator() {
  const [selectedDisco, setSelectedDisco] = useState('kelectric')
  const [units, setUnits] = useState<number>(195)

  const disco = DISCOS[selectedDisco] || DISCOS.kelectric
  const isProtected = units <= 200

  // Calculation for Protected Status
  const calcProtected = (u: number) => {
    let energyCost = 0
    if (u <= 100) {
      energyCost = u * disco.protectedRate100
    } else {
      energyCost = 100 * disco.protectedRate100 + (u - 100) * disco.protectedRate200
    }
    const fpa = u * 1.5 // Subsidized FPA
    const fc = 50 // Minimal fixed charge for protected
    const tvFee = 35
    const ed = energyCost * 0.015 // 1.5% Electricity Duty
    const subtotal = energyCost + fpa + fc + tvFee + ed
    return {
      energyCost: Math.round(energyCost),
      fpa: Math.round(fpa),
      fc: Math.round(fc),
      tvFee,
      ed: Math.round(ed),
      total: Math.round(subtotal),
    }
  }

  // Calculation for Unprotected Status
  const calcUnprotected = (u: number) => {
    let energyCost = 0
    if (u <= 100) {
      energyCost = u * disco.unprotectedRate100
    } else if (u <= 200) {
      energyCost = 100 * disco.unprotectedRate100 + (u - 100) * disco.unprotectedRate200
    } else if (u <= 300) {
      energyCost =
        100 * disco.unprotectedRate100 +
        100 * disco.unprotectedRate200 +
        (u - 200) * disco.unprotectedRate300
    } else {
      energyCost =
        100 * disco.unprotectedRate100 +
        100 * disco.unprotectedRate200 +
        100 * disco.unprotectedRate300 +
        (u - 300) * disco.unprotectedRateAbove
    }
    const fpa = u * disco.fpaPerUnit
    const fc = disco.fixedCharge
    const tvFee = 35
    const ed = energyCost * 0.015
    const gst = (energyCost + fpa + fc) * 0.18 // 18% GST for commercial/unprotected
    const subtotal = energyCost + fpa + fc + tvFee + ed + gst
    return {
      energyCost: Math.round(energyCost),
      fpa: Math.round(fpa),
      fc: Math.round(fc),
      tvFee,
      ed: Math.round(ed),
      gst: Math.round(gst),
      total: Math.round(subtotal),
    }
  }

  const currentCalc = isProtected ? calcProtected(units) : calcUnprotected(units)
  const safeAt200 = calcProtected(Math.min(units, 200))
  const dangerAt201 = calcUnprotected(201)

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.controlGrid}>
        {/* DISCO Selector */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="disco-select">
            <span>⚡ Electricity Company (DISCO)</span>
            <span style={{ fontSize: '0.8rem', color: '#00f0ff' }}>2026 Active Tariffs</span>
          </label>
          <select
            id="disco-select"
            className={styles.select}
            value={selectedDisco}
            onChange={(e) => setSelectedDisco(e.target.value)}
          >
            {Object.entries(DISCOS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Units Input */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="units-input">
            <span>📊 Expected / Current Month Units</span>
            <span style={{ fontSize: '0.8rem', color: isProtected ? '#10b981' : '#ef4444' }}>
              {isProtected ? 'Protected Limit Active' : '⚠️ Slab Breached!'}
            </span>
          </label>
          <div className={styles.unitInputWrapper}>
            <input
              id="units-input"
              type="number"
              min="1"
              max="1000"
              className={styles.unitInput}
              value={units || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                setUnits(isNaN(val) ? 0 : Math.max(0, val))
              }}
            />
            <span className={styles.unitSuffix}>kWh (Units)</span>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min="1"
          max="400"
          value={units}
          onChange={(e) => setUnits(parseInt(e.target.value, 10))}
          className={styles.slider}
          aria-label="Electricity Units Slider"
        />
        <div className={styles.sliderMarks}>
          <span>0 Units</span>
          <span style={{ color: '#10b981', fontWeight: 800 }}>100 Units</span>
          <span style={{ color: '#00f0ff', fontWeight: 900 }}>| 200 Units (CLIFF) |</span>
          <span style={{ color: '#ef4444', fontWeight: 800 }}>300 Units</span>
          <span>400+ Units</span>
        </div>
      </div>

      {/* Dynamic Cliff Banner */}
      {isProtected ? (
        <div className={styles.slabCliffBannerSafe}>
          <div>
            <div className={styles.bannerTitle} style={{ color: '#10b981' }}>
              <CheckCircle2 size={24} />
              <span>Protected Slab Status Active (Safe Zone)</span>
            </div>
            <p className={styles.bannerText}>
              Aap <strong>200 Units</strong> ke andar hain. NEPRA subsidy ke tehat aap ka unit rate sirf{' '}
              <strong>Rs {disco.protectedRate200}/unit</strong> tak mahdood hai aur koi extra sales tax ya bhari fixed charge nahi lagega.
            </p>
          </div>
          <div style={{ textAlign: 'right', minWidth: '160px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Remaining Safe Units</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              {200 - units} Units
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.slabCliffBannerDanger}>
          <div>
            <div className={styles.bannerTitle} style={{ color: '#ef4444' }}>
              <AlertTriangle size={24} />
              <span>Warning: 200 Units Slab Breached! (Unprotected Rate Applied)</span>
            </div>
            <p className={styles.bannerText}>
              Jaise hi aap ka meter <strong>200 units se oopar</strong> gaya, NEPRA ki 6-month subsidy khatam ho jati hai.
              Aap par <strong>Rs {disco.unprotectedRate300}/unit</strong> commercial rate aur 18% GST laago ho gaya hai!
            </p>
          </div>
          <div style={{ textAlign: 'right', minWidth: '160px' }}>
            <div style={{ fontSize: '0.8rem', color: '#f87171' }}>Over Limit By</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
              +{units - 200} Units
            </div>
          </div>
        </div>
      )}

      {/* Comparison Cards */}
      <div className={styles.comparisonGrid}>
        {/* User Current Calculation */}
        <div className={`${styles.calcBox} ${isProtected ? styles.calcBoxSafe : styles.calcBoxDanger}`}>
          <div className={styles.boxHeader}>
            <span style={{ fontWeight: 800, color: '#ffffff' }}>Your Current Estimate ({units} Units)</span>
            <span className={`${styles.boxTag} ${isProtected ? styles.boxTagSafe : styles.boxTagDanger}`}>
              {isProtected ? 'PROTECTED TARIFF' : 'UNPROTECTED TARIFF'}
            </span>
          </div>
          <div className={`${styles.estimatedBill} ${isProtected ? styles.billSafe : styles.billDanger}`}>
            Rs {currentCalc.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Estimated Total Electricity Bill (Taxes Included)</div>

          <div className={styles.billDetailList}>
            <div className={styles.billDetailItem}>
              <span>Base Electricity Cost:</span>
              <strong style={{ color: '#ffffff' }}>Rs {currentCalc.energyCost.toLocaleString()}</strong>
            </div>
            <div className={styles.billDetailItem}>
              <span>Fuel Price Adjustment (FPA):</span>
              <span>Rs {currentCalc.fpa.toLocaleString()}</span>
            </div>
            <div className={styles.billDetailItem}>
              <span>Fixed Charges & Duty:</span>
              <span>Rs {(currentCalc.fc + currentCalc.ed + currentCalc.tvFee).toLocaleString()}</span>
            </div>
            {'gst' in currentCalc && (
              <div className={styles.billDetailItem}>
                <span style={{ color: '#ef4444' }}>Sales Tax (GST 18%):</span>
                <strong style={{ color: '#ef4444' }}>Rs {currentCalc.gst?.toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Cliff Comparison Box */}
        <div className={styles.calcBox}>
          <div className={styles.boxHeader}>
            <span style={{ fontWeight: 800, color: '#ffffff' }}>200 vs 201 Units Shock Difference</span>
            <span className={styles.boxTag} style={{ background: '#38bdf8', color: '#030712' }}>
              CLIFF IMPACT
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>200 UNITS (SAFE)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                Rs {safeAt200.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Subsidized Tariff</div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 800 }}>201 UNITS (BREACH)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                Rs {dangerAt201.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Double Penalty Bill</div>
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px dashed #f59e0b', borderRadius: '12px', padding: '0.9rem', fontSize: '0.85rem', color: '#fef3c7', lineHeight: 1.5 }}>
            ⚡ <strong>1 Unit Difference Rule:</strong> Sirf 1 extra unit istemal karne se aap ka bill seedha{' '}
            <strong style={{ color: '#f59e0b' }}>Rs {(dangerAt201.total - safeAt200.total).toLocaleString()} barh jata hai</strong> aur aglay 6 maheeno ke liye subsidy khatam ho jati hai!
          </div>
        </div>
      </div>

      {/* Direct AI OCR Camera CTA */}
      <div className={styles.ocrCtaStrip}>
        <div className={styles.ctaTextGroup}>
          <div className={styles.ctaHeading}>
            📸 Apne Meter ka Live Dial Scan Karein Aur Slabs Track Karein
          </div>
          <div className={styles.ctaSub}>
            Read Meter AI Camera Scanner aap ke bijli meter ka photo le kar foran units aur expected bill bata deta hai.
          </div>
        </div>
        <Link href="/guest" className={styles.ctaButton}>
          <Camera size={20} />
          <span>Scan Meter Dial Now</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
