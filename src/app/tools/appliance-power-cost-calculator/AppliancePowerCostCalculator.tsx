'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './applianceCalculator.module.css'
import {
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wind,
  Tv,
  Refrigerator,
  Waves,
} from 'lucide-react'

interface PresetAppliance {
  id: string
  name: string
  category: string
  watts: number
  typicalHours: number
  icon: string
}

const PRESET_APPLIANCES: PresetAppliance[] = [
  { id: 'ac-1.5-inv', name: '1.5 Ton Inverter AC (Average)', category: 'Cooling', watts: 1100, typicalHours: 8, icon: '❄️' },
  { id: 'ac-1.5-non', name: '1.5 Ton Non-Inverter AC', category: 'Cooling', watts: 1800, typicalHours: 8, icon: '❄️' },
  { id: 'ac-1.0-inv', name: '1.0 Ton Inverter AC', category: 'Cooling', watts: 800, typicalHours: 8, icon: '❄️' },
  { id: 'fridge-inv', name: 'Inverter Refrigerator (24h run)', category: 'Kitchen', watts: 120, typicalHours: 24, icon: '🧊' },
  { id: 'fridge-old', name: 'Conventional Refrigerator / Freezer', category: 'Kitchen', watts: 280, typicalHours: 16, icon: '🧊' },
  { id: 'water-pump-1hp', name: '1 HP Water Motor / Donki Pump', category: 'Heavy', watts: 750, typicalHours: 1.5, icon: '💧' },
  { id: 'water-pump-2hp', name: '2 HP Turbine / Boring Motor', category: 'Heavy', watts: 1500, typicalHours: 1, icon: '💧' },
  { id: 'ceiling-fan', name: 'Standard AC Ceiling Fan', category: 'Comfort', watts: 75, typicalHours: 12, icon: '🌀' },
  { id: 'inverter-fan', name: 'BLDC Inverter Ceiling Fan', category: 'Comfort', watts: 30, typicalHours: 12, icon: '🌀' },
  { id: 'iron', name: 'Electric Clothes Iron (Istari)', category: 'Heavy', watts: 1000, typicalHours: 1, icon: '👔' },
  { id: 'microwave', name: 'Microwave Oven', category: 'Kitchen', watts: 1200, typicalHours: 0.5, icon: '🍲' },
  { id: 'room-cooler', name: 'Dessert Room Cooler (Lahori)', category: 'Cooling', watts: 220, typicalHours: 10, icon: '💨' },
  { id: 'washing-machine', name: 'Automatic Washing Machine', category: 'Laundry', watts: 450, typicalHours: 1.5, icon: '🧺' },
  { id: 'led-tv', name: '55" Smart 4K LED TV + Box', category: 'Entertainment', watts: 95, typicalHours: 6, icon: '📺' },
  { id: 'pc-gaming', name: 'Gaming PC / Workstation', category: 'Computing', watts: 380, typicalHours: 5, icon: '🖥️' },
  { id: 'led-bulb', name: 'LED Bulb (12W)', category: 'Lighting', watts: 12, typicalHours: 8, icon: '💡' },
]

const TARIFF_PRESETS = [
  { label: 'Subsidized (<=200 Units)', rate: 22 },
  { label: 'Unprotected Standard (201-300)', rate: 42 },
  { label: 'Peak Unprotected (>300 Units)', rate: 58 },
  { label: 'Commercial / TOU Peak', rate: 72 },
]

export default function AppliancePowerCostCalculator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ac-1.5-inv')
  const [customWatts, setCustomWatts] = useState<number>(1100)
  const [hoursPerDay, setHoursPerDay] = useState<number>(8)
  const [quantity, setQuantity] = useState<number>(1)
  const [ratePerKwh, setRatePerKwh] = useState<number>(42)
  const [copied, setCopied] = useState<boolean>(false)

  const handleSelectPreset = (preset: PresetAppliance) => {
    setSelectedPresetId(preset.id)
    setCustomWatts(preset.watts)
    setHoursPerDay(preset.typicalHours)
  }

  const calculations = useMemo(() => {
    const totalWatts = customWatts * quantity
    const dailyKwh = (totalWatts * hoursPerDay) / 1000
    const monthlyKwh = dailyKwh * 30
    const dailyCost = dailyKwh * ratePerKwh
    const monthlyCost = monthlyKwh * ratePerKwh

    // Percentage of 200 units limit
    const slabPercentage = Math.round((monthlyKwh / 200) * 100)

    return {
      totalWatts,
      dailyKwh: Number(dailyKwh.toFixed(2)),
      monthlyKwh: Number(monthlyKwh.toFixed(1)),
      dailyCost: Math.round(dailyCost),
      monthlyCost: Math.round(monthlyCost),
      slabPercentage,
    }
  }, [customWatts, hoursPerDay, quantity, ratePerKwh])

  const copyBreakdown = () => {
    const currentPreset = PRESET_APPLIANCES.find((p) => p.id === selectedPresetId)
    const text = `⚡ Read Meter - Appliance Electricity Audit:
Appliance: ${currentPreset?.name || 'Custom'} (Qty: ${quantity}, ${customWatts}W each)
Daily Usage: ${hoursPerDay} hours/day
Daily Consumption: ${calculations.dailyKwh} kWh (Rs. ${calculations.dailyCost.toLocaleString()}/day)
Monthly Consumption: ${calculations.monthlyKwh} kWh / month
Estimated Monthly Cost: Rs. ${calculations.monthlyCost.toLocaleString()} (at Rs. ${ratePerKwh}/unit)
Slab Impact: Consumes ${calculations.slabPercentage}% of the 200-Unit Protected Limit!
Calculate free at: https://www.readmeter.online/tools/appliance-power-cost-calculator`

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
          <Link href="/guest" className={styles.navBtn}>
            Live Sandbox
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <Zap size={14} /> Appliance Energy Audit 2026
        </div>
        <h1 className={styles.title}>
          Appliance Electricity Cost &amp; <span className={styles.titleHighlight}>Wattage Calculator</span>
        </h1>
        <p className={styles.subtitle}>
          Find out exactly how many units (kWh) and rupees your AC, refrigerator, motor pump, or ceiling fans add to your monthly electric bill.
        </p>
      </section>

      <main className={styles.mainContent}>
        {/* Left Input Configuration */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Cpu size={20} color="#00f0ff" />
              <span>Select Appliance or Enter Watts</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Common Household Presets</label>
            <div className={styles.presetGrid}>
              {PRESET_APPLIANCES.slice(0, 8).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`${styles.presetBtn} ${selectedPresetId === preset.id ? styles.presetBtnActive : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  <span style={{ fontSize: '1.1rem' }}>{preset.icon}</span>
                  <span>{preset.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{preset.watts}W • {preset.typicalHours}h</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Or Pick More Presets</label>
            <select
              className={styles.select}
              value={selectedPresetId}
              onChange={(e) => {
                const found = PRESET_APPLIANCES.find((p) => p.id === e.target.value)
                if (found) handleSelectPreset(found)
              }}
            >
              {PRESET_APPLIANCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name} ({p.watts}W)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Appliance Power (Watts)</label>
              <input
                type="number"
                min={1}
                max={15000}
                className={styles.input}
                value={customWatts}
                onChange={(e) => {
                  setCustomWatts(Math.max(1, Number(e.target.value) || 0))
                  setSelectedPresetId('custom')
                }}
              />
              <span className={styles.helperText}>Rated input wattage</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Quantity (Units)</label>
              <input
                type="number"
                min={1}
                max={50}
                className={styles.input}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
              <span className={styles.helperText}>Number of devices running</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Daily Usage Duration</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min={0.5}
                max={24}
                step={0.5}
                className={styles.slider}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
              />
              <span className={styles.sliderValue}>{hoursPerDay} hrs</span>
            </div>
            <span className={styles.helperText}>How many hours this appliance runs per day</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Electricity Tariff (Rs. per Unit / kWh)</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              {TARIFF_PRESETS.map((t) => (
                <button
                  key={t.rate}
                  type="button"
                  style={{
                    background: ratePerKwh === t.rate ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: ratePerKwh === t.rate ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: ratePerKwh === t.rate ? '#00f0ff' : '#cbd5e1',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setRatePerKwh(t.rate)}
                >
                  {t.label} (Rs {t.rate})
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              max={200}
              className={styles.input}
              value={ratePerKwh}
              onChange={(e) => setRatePerKwh(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>

        {/* Right Output Results */}
        <div className={styles.resultCard}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f0ff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Energy Impact Breakdown
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {calculations.totalWatts}W Total Load
              </span>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Monthly Units</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  {calculations.monthlyKwh}
                  <span className={styles.statUnit}>kWh</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Estimated Bill Cost</div>
                <div className={`${styles.statNumber} ${styles.statHighlight}`}>
                  Rs. {calculations.monthlyCost.toLocaleString()}
                  <span className={styles.statUnit}>/mo</span>
                </div>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Units (kWh)</div>
                <div className={styles.statNumber}>
                  {calculations.dailyKwh}
                  <span className={styles.statUnit}>kWh/day</span>
                </div>
              </div>

              <div className={styles.statBox}>
                <div className={styles.statLabel}>Daily Running Cost</div>
                <div className={styles.statNumber}>
                  Rs. {calculations.dailyCost.toLocaleString()}
                  <span className={styles.statUnit}>/day</span>
                </div>
              </div>
            </div>

            <div className={styles.slabAlert}>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertTriangle size={16} color="#f59e0b" />
                200-Unit Protected Slab Consumption:
              </div>
              This single appliance consumes <strong>{calculations.slabPercentage}%</strong> of your entire household 200-unit monthly subsidized quota.
              {calculations.slabPercentage > 50 && (
                <div style={{ marginTop: '0.35rem', color: '#fca5a5' }}>
                  ⚠️ Warning: Running this appliance pushes most homes into the punitive unprotected slab!
                </div>
              )}
            </div>
          </div>

          <div>
            <button type="button" className={styles.actionBtn} onClick={copyBreakdown}>
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied Energy Audit to Clipboard!
                </>
              ) : (
                <>
                  <Share2 size={18} /> Copy / Share Audit Summary
                </>
              )}
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                href="/tools/ac-electricity-cost-calculator"
                style={{ color: '#00f0ff', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Detailed AC Inverter vs Non-Inverter Comparison <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
