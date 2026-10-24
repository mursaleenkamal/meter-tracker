'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import styles from './subMeterCalculator.module.css'
import { captureUtmParams, trackConversionEvent } from '@/lib/telemetry'
import {
  Users,
  Plus,
  Trash2,
  Copy,
  Check,
  Share2,
  AlertTriangle,
  Zap,
  Camera,
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react'

interface Portion {
  id: string
  name: string
  mode: 'units' | 'readings'
  units: number
  previousReading: number
  currentReading: number
}

export default function SubMeterBillCalculator() {
  const [mainBillAmount, setMainBillAmount] = useState<number>(35000)
  const [mainUnits, setMainUnits] = useState<number>(700)
  const [commonLoadUnits, setCommonLoadUnits] = useState<number>(50)
  const [commonLoadSplitMethod, setCommonLoadSplitMethod] = useState<'equal' | 'proportional'>('equal')
  const [copied, setCopied] = useState<boolean>(false)

  const [portions, setPortions] = useState<Portion[]>([
    {
      id: 'p1',
      name: 'Ground Floor (Owner)',
      mode: 'units',
      units: 300,
      previousReading: 12400,
      currentReading: 12700,
    },
    {
      id: 'p2',
      name: '1st Floor (Tenant A)',
      mode: 'units',
      units: 350,
      previousReading: 8500,
      currentReading: 8850,
    },
  ])

  useEffect(() => {
    captureUtmParams()
  }, [])

  // Handlers for portions
  const addPortion = () => {
    const nextIdx = portions.length + 1
    const newPortion: Portion = {
      id: `p_${Date.now()}`,
      name: `Portion ${nextIdx} / Unit ${nextIdx}`,
      mode: 'units',
      units: 100,
      previousReading: 0,
      currentReading: 100,
    }
    setPortions([...portions, newPortion])
  }

  const removePortion = (id: string) => {
    if (portions.length <= 1) return
    setPortions(portions.filter((p) => p.id !== id))
  }

  const updatePortion = (id: string, updates: Partial<Portion>) => {
    setPortions((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const updated = { ...p, ...updates }
        if (updated.mode === 'readings') {
          const diff = Math.max(0, updated.currentReading - updated.previousReading)
          updated.units = diff
        }
        return updated
      })
    )
  }

  // Calculations
  const calculations = useMemo(() => {
    const validMainUnits = Math.max(1, mainUnits)
    const effectiveUnitRate = mainBillAmount / validMainUnits

    // Calculate individual consumption
    const portionsWithConsumption = portions.map((p) => {
      let rawUnits = p.units
      if (p.mode === 'readings') {
        rawUnits = Math.max(0, p.currentReading - p.previousReading)
      }
      return {
        ...p,
        consumedUnits: rawUnits,
      }
    })

    const totalSubMeterUnits = portionsWithConsumption.reduce((acc, curr) => acc + curr.consumedUnits, 0)

    // Calculate common load per portion
    const numPortions = portions.length
    const portionsDetailed = portionsWithConsumption.map((p) => {
      let portionCommonShare = 0
      if (commonLoadUnits > 0) {
        if (commonLoadSplitMethod === 'equal' && numPortions > 0) {
          portionCommonShare = commonLoadUnits / numPortions
        } else if (commonLoadSplitMethod === 'proportional' && totalSubMeterUnits > 0) {
          portionCommonShare = (p.consumedUnits / totalSubMeterUnits) * commonLoadUnits
        }
      }

      const totalPortionUnits = p.consumedUnits + portionCommonShare
      const portionBill = Math.round(totalPortionUnits * effectiveUnitRate)
      const portionPercentage = mainBillAmount > 0 ? ((portionBill / mainBillAmount) * 100).toFixed(1) : '0'

      return {
        ...p,
        commonShareUnits: portionCommonShare,
        totalPortionUnits,
        portionBill,
        portionPercentage,
      }
    })

    const accountedUnits = totalSubMeterUnits + commonLoadUnits
    const unitsDiscrepancy = mainUnits - accountedUnits

    return {
      effectiveUnitRate,
      portionsDetailed,
      totalSubMeterUnits,
      accountedUnits,
      unitsDiscrepancy,
      hasDiscrepancy: Math.abs(unitsDiscrepancy) > 2,
    }
  }, [mainBillAmount, mainUnits, commonLoadUnits, commonLoadSplitMethod, portions])

  // WhatsApp Share Message Formatter
  const generateWhatsAppSummary = () => {
    const lines = [
      `⚡ *K-Electric / WAPDA Sub-Meter Bill Hisab*`,
      `----------------------------------------`,
      `📊 *Main Meter Summary:*`,
      `• Total Bill Amount: Rs ${mainBillAmount.toLocaleString()}`,
      `• Total Main Units: ${mainUnits.toLocaleString()} kWh`,
      `• Fair Effective Rate: Rs ${calculations.effectiveUnitRate.toFixed(2)} / unit`,
    ]

    if (commonLoadUnits > 0) {
      lines.push(`• Shared Common Load: ${commonLoadUnits} kWh (${commonLoadSplitMethod === 'equal' ? 'Split Equally' : 'Proportional'})`)
    }

    lines.push(`----------------------------------------`)
    lines.push(`🏢 *Portion-wise Payable Breakdown:*`)

    calculations.portionsDetailed.forEach((p, idx) => {
      const commonText = commonLoadUnits > 0 ? ` (+${p.commonShareUnits.toFixed(1)} common)` : ''
      lines.push(`${idx + 1}️⃣ *${p.name}:*`)
      lines.push(`   • Units: ${p.consumedUnits.toFixed(0)} kWh${commonText} = ${p.totalPortionUnits.toFixed(1)} kWh`)
      lines.push(`   • *Payable Amount: Rs ${p.portionBill.toLocaleString()}* (${p.portionPercentage}%)`)
    })

    lines.push(`----------------------------------------`)
    if (calculations.hasDiscrepancy) {
      lines.push(`⚠️ *Note:* Main meter units (${mainUnits}) vs counted units (${calculations.accountedUnits}) differ by ${calculations.unitsDiscrepancy} units (line loss / unmetered lights).`)
    }
    lines.push(`📲 *Calculated via Read Meter PWA:*`)
    lines.push(`https://www.readmeter.online/tools/sub-meter-bill-calculator`)

    return lines.join('\n')
  }

  const handleCopyWhatsApp = async () => {
    try {
      const text = generateWhatsAppSummary()
      await navigator.clipboard.writeText(text)
      trackConversionEvent('copy_whatsapp_submeter_invoice', {
        portionsCount: portions.length,
        totalBill: mainBillAmount,
      })
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  return (
    <div className={styles.calculatorCard}>
      {/* Main Bill Inputs */}
      <div>
        <div className={styles.cardSectionTitle}>
          <Building size={20} />
          <span>1. Main Meter Electricity Bill Details</span>
        </div>
        <div className={styles.controlGrid} style={{ marginTop: '1rem' }}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="main-bill">
              <span>💵 Total Main Bill Amount</span>
              <span className={styles.labelHint}>Total Rs Payable</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="main-bill"
                type="number"
                className={styles.inputField}
                value={mainBillAmount === 0 ? '' : mainBillAmount}
                onChange={(e) => setMainBillAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 35000"
                min="0"
              />
              <span className={styles.unitSuffix}>PKR</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="main-units">
              <span>⚡ Total Main Meter Units</span>
              <span className={styles.labelHint}>kWh on bill</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="main-units"
                type="number"
                className={styles.inputField}
                value={mainUnits === 0 ? '' : mainUnits}
                onChange={(e) => setMainUnits(Math.max(1, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 700"
                min="1"
              />
              <span className={styles.unitSuffix}>Units</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="common-units">
              <span>💡 Common / Shared Load (Optional)</span>
              <span className={styles.labelHint}>Motor, stairs, pump</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="common-units"
                type="number"
                className={styles.inputField}
                value={commonLoadUnits === 0 ? '' : commonLoadUnits}
                onChange={(e) => setCommonLoadUnits(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 50"
                min="0"
              />
              <span className={styles.unitSuffix}>Units</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <span>⚖️ Common Load Split Rule</span>
              <span className={styles.labelHint}>How to divide</span>
            </label>
            <div className={styles.toggleContainer}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${commonLoadSplitMethod === 'equal' ? styles.toggleBtnActive : ''}`}
                onClick={() => setCommonLoadSplitMethod('equal')}
              >
                <span>👥 Equal Split (Barabar)</span>
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${commonLoadSplitMethod === 'proportional' ? styles.toggleBtnActive : ''}`}
                onClick={() => setCommonLoadSplitMethod('proportional')}
              >
                <span>📊 Proportional (% Units)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portions / Sub-Meters Inputs */}
      <div>
        <div className={styles.cardSectionTitle} style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={20} />
            <span>2. Sub-Meters & Portions Breakdown</span>
          </div>
          <span className={styles.labelHint}>{portions.length} Portions Added</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          {portions.map((portion, idx) => (
            <div key={portion.id} className={styles.portionCard}>
              <div className={styles.portionHeader}>
                <input
                  type="text"
                  className={styles.portionTitleInput}
                  value={portion.name}
                  onChange={(e) => updatePortion(portion.id, { name: e.target.value })}
                  placeholder={`Portion ${idx + 1}`}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className={styles.toggleContainer} style={{ padding: '0.15rem' }}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${portion.mode === 'units' ? styles.toggleBtnActive : ''}`}
                      onClick={() => updatePortion(portion.id, { mode: 'units' })}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      Direct Units
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${portion.mode === 'readings' ? styles.toggleBtnActive : ''}`}
                      onClick={() => updatePortion(portion.id, { mode: 'readings' })}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      Readings Diff
                    </button>
                  </div>
                  {portions.length > 1 && (
                    <button
                      type="button"
                      className={styles.removePortionBtn}
                      onClick={() => removePortion(portion.id)}
                      title="Remove Portion"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {portion.mode === 'units' ? (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <span>Sub-Meter Consumed Units</span>
                    <span className={styles.labelHint}>Monthly units</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      className={styles.inputField}
                      value={portion.units === 0 ? '' : portion.units}
                      onChange={(e) => updatePortion(portion.id, { units: Math.max(0, parseFloat(e.target.value) || 0) })}
                      placeholder="e.g. 250"
                      min="0"
                    />
                    <span className={styles.unitSuffix}>Units</span>
                  </div>
                </div>
              ) : (
                <div className={styles.portionInputs}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <span>Previous Reading</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="number"
                        className={styles.inputField}
                        value={portion.previousReading === 0 ? '' : portion.previousReading}
                        onChange={(e) => updatePortion(portion.id, { previousReading: Math.max(0, parseFloat(e.target.value) || 0) })}
                        placeholder="e.g. 12000"
                      />
                      <span className={styles.unitSuffix}>kWh</span>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <span>Current Reading</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="number"
                        className={styles.inputField}
                        value={portion.currentReading === 0 ? '' : portion.currentReading}
                        onChange={(e) => updatePortion(portion.id, { currentReading: Math.max(0, parseFloat(e.target.value) || 0) })}
                        placeholder="e.g. 12350"
                      />
                      <span className={styles.unitSuffix}>kWh</span>
                    </div>
                  </div>
                  <div className={styles.inputGroup} style={{ justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Calculated Net Units:</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f0ff' }}>
                      {Math.max(0, portion.currentReading - portion.previousReading)} Units
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button type="button" className={styles.addPortionBtn} onClick={addPortion}>
            <Plus size={18} />
            <span>Add Another Sub-Meter Portion</span>
          </button>
        </div>
      </div>

      {/* Discrepancy Alert */}
      {calculations.hasDiscrepancy && (
        <div className={styles.alertBox}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Discrepancy / Line Loss Detected:</strong> Main bill has{' '}
            <strong style={{ color: '#ffffff' }}>{mainUnits} units</strong>, but sub-meters + common load total{' '}
            <strong style={{ color: '#ffffff' }}>{calculations.accountedUnits.toFixed(0)} units</strong> (Difference of{' '}
            <strong style={{ color: '#ef4444' }}>{calculations.unitsDiscrepancy.toFixed(0)} units</strong>). This is
            typically caused by unmetered staircase lighting, water pump motor, or mechanical line resistance.
          </div>
        </div>
      )}

      {/* Calculation Results Panel */}
      <div className={styles.resultPanel}>
        <div className={styles.summaryHeader}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              Fair Proportional Bill Calculation
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              All taxes, FPA, and surcharges distributed 100% mathematically fair
            </div>
          </div>
          <div className={styles.effectiveRateBadge}>
            <span className={styles.effectiveRateValue}>
              Rs {calculations.effectiveUnitRate.toFixed(2)}
            </span>
            <span className={styles.effectiveRateLabel}>Effective Blended Rate / Unit</span>
          </div>
        </div>

        {/* Portions Table */}
        <div className={styles.portionsTableWrapper}>
          <table className={styles.portionsTable}>
            <thead>
              <tr>
                <th>Portion / Tenant</th>
                <th>Meter Units</th>
                {commonLoadUnits > 0 && <th>Common Share</th>}
                <th>Total Units</th>
                <th>Share %</th>
                <th>Payable Bill (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {calculations.portionsDetailed.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.consumedUnits.toFixed(0)} kWh</td>
                  {commonLoadUnits > 0 && <td>+{p.commonShareUnits.toFixed(1)} kWh</td>}
                  <td style={{ fontWeight: 700 }}>{p.totalPortionUnits.toFixed(1)} kWh</td>
                  <td>{p.portionPercentage}%</td>
                  <td className={styles.portionBillCell}>Rs {p.portionBill.toLocaleString()}</td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td>Total Matched</td>
                <td>{calculations.totalSubMeterUnits.toFixed(0)} kWh</td>
                {commonLoadUnits > 0 && <td>{commonLoadUnits} kWh</td>}
                <td>{calculations.accountedUnits.toFixed(1)} kWh</td>
                <td>100%</td>
                <td style={{ color: '#10b981', fontSize: '1.25rem' }}>
                  Rs {mainBillAmount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* WhatsApp Share Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button type="button" className={styles.whatsappShareBtn} onClick={handleCopyWhatsApp}>
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copied ? 'Copied WhatsApp Invoice!' : 'Copy Formatted WhatsApp Invoice'}</span>
          </button>
          {copied && (
            <div className={styles.copySuccessMessage}>
              <Check size={14} /> Ready to paste into your landlord/tenant WhatsApp group!
            </div>
          )}
        </div>

        {/* Monetization Gate B: Commercial Pilot Trigger for 3+ Units */}
        {portions.length >= 3 && (
          <div className={styles.commercialPilotBanner}>
            <div className={styles.commercialPilotHeader}>
              <Building size={24} className={styles.commercialPilotIcon} />
              <div>
                <h4 className={styles.commercialPilotTitle}>
                  🏢 Managing 3+ Sub-Meters or Rental Units?
                </h4>
                <p className={styles.commercialPilotDesc}>
                  Eliminate monthly tenant disputes over utility math. Automatically generate branded
                  WhatsApp slips, track historical tenant payment ledgers, and automate billing splits
                  for $19/mo.
                </p>
              </div>
            </div>
            <div className={styles.commercialPilotActions}>
              <a
                href="mailto:support@readmeter.online?subject=Interested%20in%2014-Day%20Commercial%20Landlord%20Pilot"
                className={styles.commercialPilotBtn}
                onClick={() =>
                  trackConversionEvent('click_landlord_pilot', {
                    portionsCount: portions.length,
                    totalBill: mainBillAmount,
                    totalUnits: mainUnits,
                    source: 'submeter_splitter_gate',
                  })
                }
              >
                Start Free 14-Day Landlord Pilot <ArrowRight size={15} />
              </a>
              <span className={styles.commercialPilotBadge}>
                No credit card required • WhatsApp ready
              </span>
            </div>
          </div>
        )}

        {/* PWA Camera OCR Conversion CTA */}
        <div className={styles.pwaCtaBanner}>
          <div className={styles.ctaTextContent}>
            <div className={styles.ctaTitle}>
              📸 Snap sub-meters with Read Meter AI Camera — No manual reading errors
            </div>
            <div className={styles.ctaDescription}>
              Never argue over unclear mechanical dials. Scan every sub-meter with Read Meter camera OCR to create
              permanent timestamped photo records and automatic tenant WhatsApp bills.
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
