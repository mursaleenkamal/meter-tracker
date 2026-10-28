'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './evCalculator.module.css'
import {
  Zap,
  Car,
  Bike,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'

type VehicleCategory = 'bike' | 'mini_car' | 'ev_car' | 'custom'

interface VehiclePreset {
  id: string
  name: string
  category: VehicleCategory
  batteryKwh: number
  rangeKm: number
  chargerKw: number
  defaultEfficiency: number
  description: string
}

const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    id: 'yadea_t9',
    name: 'Yadea T9 / Metro E-Bike',
    category: 'bike',
    batteryKwh: 1.44,
    rangeKm: 60,
    chargerKw: 0.35,
    defaultEfficiency: 85,
    description: '72V 20Ah Graphene battery. Standard urban daily commuter.',
  },
  {
    id: 'crown_classic',
    name: 'Crown / Super Star E-Bike',
    category: 'bike',
    batteryKwh: 1.2,
    rangeKm: 50,
    chargerKw: 0.3,
    defaultEfficiency: 84,
    description: '60V 20Ah Lead-Acid / Dry battery pack.',
  },
  {
    id: 'heavy_scooter',
    name: '72V 35Ah High-Range E-Scooter',
    category: 'bike',
    batteryKwh: 2.52,
    rangeKm: 90,
    chargerKw: 0.5,
    defaultEfficiency: 88,
    description: 'High-capacity Lithium battery for delivery riders & heavy commutes.',
  },
  {
    id: 'electric_loader',
    name: '3-Wheeler Electric Rickshaw / Loader',
    category: 'bike',
    batteryKwh: 4.8,
    rangeKm: 85,
    chargerKw: 1.2,
    defaultEfficiency: 85,
    description: 'Heavy duty commercial 60V/72V loader pack.',
  },
  {
    id: 'honri_ve',
    name: 'Honri Ve 2.0 / Rinco Aria',
    category: 'mini_car',
    batteryKwh: 18.6,
    rangeKm: 180,
    chargerKw: 3.3,
    defaultEfficiency: 90,
    description: 'Popular compact city electric car in Pakistan with 18.6 kWh LFP pack.',
  },
  {
    id: 'gigi_ev',
    name: 'GiGi EV Mini',
    category: 'mini_car',
    batteryKwh: 16.8,
    rangeKm: 150,
    chargerKw: 3.3,
    defaultEfficiency: 90,
    description: 'Compact 2-door city EV with home 3.3 kW portable charger.',
  },
  {
    id: 'deepal_s07',
    name: 'Deepal S07 / L07',
    category: 'ev_car',
    batteryKwh: 66.8,
    rangeKm: 450,
    chargerKw: 7.0,
    defaultEfficiency: 91,
    description: 'Premium Changan Deepal electric SUV/sedan with 66.8 kWh CATL battery.',
  },
  {
    id: 'byd_atto3',
    name: 'BYD Atto 3',
    category: 'ev_car',
    batteryKwh: 60.5,
    rangeKm: 410,
    chargerKw: 7.0,
    defaultEfficiency: 92,
    description: 'BYD Blade LFP battery with 7 kW home wallbox AC charger.',
  },
  {
    id: 'mg4_ev',
    name: 'MG4 EV (51 kWh)',
    category: 'ev_car',
    batteryKwh: 51.0,
    rangeKm: 350,
    chargerKw: 7.0,
    defaultEfficiency: 91,
    description: 'MG pure electric hatchback with 51 kWh battery pack.',
  },
]

interface TariffRate {
  id: string
  label: string
  ratePkr: number
  description: string
  isProtected?: boolean
  isPeak?: boolean
}

const TARIFF_OPTIONS: TariffRate[] = [
  {
    id: 'protected',
    label: 'Protected Slab (<200 Units Total Home) — Rs 22 / Unit',
    ratePkr: 22.0,
    description: 'Subsidized rate with basic taxes for life-line & protected consumers.',
    isProtected: true,
  },
  {
    id: 'unprotected_mid',
    label: 'Domestic Non-Protected (201–300 Units) — Rs 35 / Unit',
    ratePkr: 35.0,
    description: 'Typical domestic slab rate in K-Electric, LESCO, IESCO with FPA & taxes.',
  },
  {
    id: 'unprotected_high',
    label: 'Domestic Upper Slab (301–700 Units) — Rs 43 / Unit',
    ratePkr: 43.0,
    description: 'Higher domestic consumption tier (>300 units/month).',
  },
  {
    id: 'tou_offpeak',
    label: '3-Phase TOU Off-Peak Hours (10PM–6PM) — Rs 38 / Unit',
    ratePkr: 38.0,
    description: 'Recommended nighttime EV charging window on three-phase meters.',
  },
  {
    id: 'tou_peak',
    label: '3-Phase TOU Peak Hours (6PM–10PM) — Rs 58 / Unit',
    ratePkr: 58.0,
    description: 'Expensive peak tariff. Strongly discouraged for vehicle charging.',
    isPeak: true,
  },
  {
    id: 'solar_net',
    label: 'Solar Daytime / Net Metering — Rs 10 / Unit (Avg Offset)',
    ratePkr: 10.0,
    description: 'Surplus daytime solar generation accounting for export credit value.',
  },
  {
    id: 'fast_charger',
    label: 'Commercial DC Fast Charging Station — Rs 75 / Unit',
    ratePkr: 75.0,
    description: 'Public motorway or commercial highway fast charging rate.',
  },
  {
    id: 'custom',
    label: 'Custom Electricity Rate (Enter Manually)',
    ratePkr: 38.0,
    description: 'Enter your exact per-unit billing rate in PKR.',
  },
]

export default function EvChargingCostCalculator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('yadea_t9')
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('bike')

  // Battery & Range Parameters
  const [batteryKwh, setBatteryKwh] = useState<number>(1.44)
  const [rangeKm, setRangeKm] = useState<number>(60)
  const [chargerKw, setChargerKw] = useState<number>(0.35)
  const [chargerEfficiency, setChargerEfficiency] = useState<number>(85)

  // Session charge state
  const [startSoc, setStartSoc] = useState<number>(20)
  const [targetSoc, setTargetSoc] = useState<number>(100)

  // Tariff & Commute
  const [tariffId, setTariffId] = useState<string>('unprotected_mid')
  const [customRate, setCustomRate] = useState<string>('38')
  const [dailyCommuteKm, setDailyCommuteKm] = useState<number>(25)

  // Petrol comparison settings
  const petrolPrice = 260
  const [copied, setCopied] = useState<boolean>(false)

  // Handle preset selection
  const handlePresetChange = (preset: VehiclePreset) => {
    setSelectedPresetId(preset.id)
    setVehicleCategory(preset.category)
    setBatteryKwh(preset.batteryKwh)
    setRangeKm(preset.rangeKm)
    setChargerKw(preset.chargerKw)
    setChargerEfficiency(preset.defaultEfficiency)
    if (preset.category === 'bike') {
      setDailyCommuteKm(25)
    } else {
      setDailyCommuteKm(40)
    }
  }

  // Active electricity rate per kWh
  const activeRate = useMemo(() => {
    if (tariffId === 'custom') {
      const parsed = parseFloat(customRate)
      return isNaN(parsed) || parsed <= 0 ? 38 : parsed
    }
    const found = TARIFF_OPTIONS.find((t) => t.id === tariffId)
    return found ? found.ratePkr : 35
  }, [tariffId, customRate])

  // Calculation logic
  const calculation = useMemo(() => {
    const socDelta = Math.max(0, targetSoc - startSoc) / 100 // e.g. 80% = 0.80
    const batteryEnergyNeeded = batteryKwh * socDelta // kWh stored into battery

    // Factoring in charger conversion losses (AC from wall to DC battery)
    const efficiencyDecimal = Math.max(0.5, chargerEfficiency / 100)
    const wallUnitsConsumed = batteryEnergyNeeded / efficiencyDecimal // Total grid kWh billed

    // Cost for this charge session
    const sessionCostPkr = wallUnitsConsumed * activeRate

    // Approximate range gained in this charge session
    const rangeGainedKm = rangeKm * socDelta

    // Real cost per kilometer (charging from grid)
    const fullChargeUnits = batteryKwh / efficiencyDecimal
    const fullChargeCostPkr = fullChargeUnits * activeRate
    const costPerKmPkr = rangeKm > 0 ? fullChargeCostPkr / rangeKm : 0

    // Approximate charging time (hours)
    const chargeTimeHours = chargerKw > 0 ? wallUnitsConsumed / chargerKw : 0
    const chargeHours = Math.floor(chargeTimeHours)
    const chargeMinutes = Math.round((chargeTimeHours - chargeHours) * 60)

    // Monthly Commute Impact (30 days)
    const monthlyDistanceKm = dailyCommuteKm * 30
    const monthlyUnitsConsumed = (monthlyDistanceKm / (rangeKm || 1)) * fullChargeUnits
    const monthlyChargingCostPkr = monthlyUnitsConsumed * activeRate

    // Petrol Comparison
    // Average 70cc-125cc bike in Pakistan gets 45 km/L.
    // Average 1000cc-1500cc petrol car in Pakistan city traffic gets 12 km/L.
    const isBike = vehicleCategory === 'bike'
    const petrolMileageKmPerL = isBike ? 45 : 12
    const petrolCostPerKm = petrolPrice / petrolMileageKmPerL
    const monthlyPetrolCostPkr = (monthlyDistanceKm / petrolMileageKmPerL) * petrolPrice

    const netSavingsPerKm = Math.max(0, petrolCostPerKm - costPerKmPkr)
    const netMonthlySavingsPkr = Math.max(0, monthlyPetrolCostPkr - monthlyChargingCostPkr)
    const savingsPercent =
      monthlyPetrolCostPkr > 0 ? Math.round((netMonthlySavingsPkr / monthlyPetrolCostPkr) * 100) : 0

    return {
      socDelta,
      batteryEnergyNeeded,
      wallUnitsConsumed,
      sessionCostPkr,
      rangeGainedKm,
      fullChargeUnits,
      fullChargeCostPkr,
      costPerKmPkr,
      chargeHours,
      chargeMinutes,
      monthlyDistanceKm,
      monthlyUnitsConsumed,
      monthlyChargingCostPkr,
      petrolCostPerKm,
      monthlyPetrolCostPkr,
      netSavingsPerKm,
      netMonthlySavingsPkr,
      savingsPercent,
    }
  }, [
    batteryKwh,
    rangeKm,
    chargerKw,
    chargerEfficiency,
    startSoc,
    targetSoc,
    activeRate,
    dailyCommuteKm,
    vehicleCategory,
    petrolPrice,
  ])

  // Share calculation via WhatsApp
  const handleShare = () => {
    const vehicleName =
      selectedPresetId === 'custom'
        ? 'Custom EV / E-Bike'
        : VEHICLE_PRESETS.find((p) => p.id === selectedPresetId)?.name || 'Electric Vehicle'

    const shareText = `⚡ *Electric Vehicle Charging Cost Summary (Pakistan 2026)* ⚡
🚗 *Vehicle:* ${vehicleName}
🔋 *Battery Capacity:* ${batteryKwh} kWh (${rangeKm} km range)
⚡ *Units per Full Charge:* ${calculation.fullChargeUnits.toFixed(2)} kWh (Units)
💰 *Cost per Full Charge:* Rs ${Math.round(calculation.fullChargeCostPkr)}
🛣️ *Cost Per KM (Electric):* Rs ${calculation.costPerKmPkr.toFixed(2)} / km
⛽ *Cost Per KM (Petrol Equivalent):* Rs ${calculation.petrolCostPerKm.toFixed(2)} / km
🎉 *Monthly Net Fuel Savings:* Rs ${Math.round(calculation.netMonthlySavingsPkr).toLocaleString()} / month (${calculation.savingsPercent}% bachat!)

Calculated on Read Meter Free Utility Engine:
https://www.readmeter.online/tools/ev-charging-cost-calculator`

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className={styles.calculatorCard}>
      {/* Left Column: Form Controls */}
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <Car size={22} color="#2563eb" />
          <h3>Vehicle & Battery Specifications</h3>
        </div>

        {/* Category Radio */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Select Vehicle Category</label>
          <div className={styles.radioGroup}>
            <button
              type="button"
              className={`${styles.radioBtn} ${vehicleCategory === 'bike' ? styles.radioBtnActive : ''}`}
              onClick={() => {
                setVehicleCategory('bike')
                const first = VEHICLE_PRESETS.find((p) => p.category === 'bike')
                if (first) handlePresetChange(first)
              }}
            >
              <Bike size={16} />
              <span>E-Bikes & Scooters</span>
            </button>
            <button
              type="button"
              className={`${styles.radioBtn} ${vehicleCategory === 'mini_car' ? styles.radioBtnActive : ''}`}
              onClick={() => {
                setVehicleCategory('mini_car')
                const first = VEHICLE_PRESETS.find((p) => p.category === 'mini_car')
                if (first) handlePresetChange(first)
              }}
            >
              <Car size={16} />
              <span>City / Mini EVs</span>
            </button>
            <button
              type="button"
              className={`${styles.radioBtn} ${vehicleCategory === 'ev_car' ? styles.radioBtnActive : ''}`}
              onClick={() => {
                setVehicleCategory('ev_car')
                const first = VEHICLE_PRESETS.find((p) => p.category === 'ev_car')
                if (first) handlePresetChange(first)
              }}
            >
              <Zap size={16} />
              <span>Full-Size EVs</span>
            </button>
            <button
              type="button"
              className={`${styles.radioBtn} ${selectedPresetId === 'custom' ? styles.radioBtnActive : ''}`}
              onClick={() => {
                setSelectedPresetId('custom')
                setVehicleCategory('custom')
              }}
            >
              <RefreshCw size={16} />
              <span>Custom Specs</span>
            </button>
          </div>
        </div>

        {/* Vehicle Presets Grid */}
        {selectedPresetId !== 'custom' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Popular Model in Pakistan</label>
            <div className={styles.presetGrid}>
              {VEHICLE_PRESETS.filter(
                (p) => vehicleCategory === 'custom' || p.category === vehicleCategory
              ).map((preset) => (
                <div
                  key={preset.id}
                  className={`${styles.presetCard} ${
                    selectedPresetId === preset.id ? styles.presetCardActive : ''
                  }`}
                  onClick={() => handlePresetChange(preset)}
                >
                  <div className={styles.presetName}>{preset.name}</div>
                  <div className={styles.presetSub}>
                    {preset.batteryKwh} kWh • {preset.rangeKm} km
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Battery Capacity & Range inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Battery Capacity (kWh)</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="150"
              className={styles.inputField}
              value={batteryKwh}
              onChange={(e) => setBatteryKwh(Math.max(0.1, parseFloat(e.target.value) || 0))}
            />
            <div className={styles.hintText}>Total pack size in kWh</div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Real-World Range (km)</label>
            <input
              type="number"
              min="10"
              max="1000"
              className={styles.inputField}
              value={rangeKm}
              onChange={(e) => setRangeKm(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <div className={styles.hintText}>Average city range on full charge</div>
          </div>
        </div>

        {/* State of Charge (SoC) Slider */}
        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className={styles.label}>Charging Session: Start & Target Battery %</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>
              {startSoc}% ➔ {targetSoc}% ({targetSoc - startSoc}% added)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <span className={styles.hintText}>Starting SoC: {startSoc}%</span>
              <input
                type="range"
                min="0"
                max={Math.max(0, targetSoc - 5)}
                step="5"
                className={styles.rangeSlider}
                value={startSoc}
                onChange={(e) => setStartSoc(parseInt(e.target.value))}
              />
            </div>
            <div>
              <span className={styles.hintText}>Target SoC: {targetSoc}%</span>
              <input
                type="range"
                min={Math.min(100, startSoc + 5)}
                max="100"
                step="5"
                className={styles.rangeSlider}
                value={targetSoc}
                onChange={(e) => setTargetSoc(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Electricity Tariff Selection */}
        <div className={styles.sectionHeader} style={{ marginTop: '1.5rem' }}>
          <Zap size={22} color="#2563eb" />
          <h3>Electricity Tariff & Slabs (NEPRA / DISCOs)</h3>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Select DISCO Tariff / Charging Source</label>
          <select
            className={styles.selectField}
            value={tariffId}
            onChange={(e) => setTariffId(e.target.value)}
          >
            {TARIFF_OPTIONS.map((tariff) => (
              <option key={tariff.id} value={tariff.id}>
                {tariff.label}
              </option>
            ))}
          </select>
          <div className={styles.hintText}>
            {TARIFF_OPTIONS.find((t) => t.id === tariffId)?.description}
          </div>
        </div>

        {tariffId === 'custom' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Enter Custom Rate (PKR / kWh)</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="200"
              className={styles.inputField}
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              placeholder="e.g. 42.50"
            />
          </div>
        )}

        {/* Charger Power & Efficiency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Charger Rating (kW)</label>
            <input
              type="number"
              step="0.1"
              min="0.2"
              max="150"
              className={styles.inputField}
              value={chargerKw}
              onChange={(e) => setChargerKw(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
            />
            <div className={styles.hintText}>e.g. 0.35 kW (Bike), 3.3 kW, 7.0 kW (Wallbox)</div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>AC-to-DC Efficiency (%)</label>
            <input
              type="number"
              min="70"
              max="98"
              className={styles.inputField}
              value={chargerEfficiency}
              onChange={(e) => setChargerEfficiency(parseInt(e.target.value) || 85)}
            />
            <div className={styles.hintText}>Heat & conversion loss (~10–15%)</div>
          </div>
        </div>

        {/* Daily Commute Distance */}
        <div className={styles.formGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label className={styles.label}>Daily Commute Distance</label>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb' }}>
              {dailyCommuteKm} km / day
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            className={styles.rangeSlider}
            value={dailyCommuteKm}
            onChange={(e) => setDailyCommuteKm(parseInt(e.target.value))}
          />
          <div className={styles.rangeLabels}>
            <span>5 km</span>
            <span>50 km</span>
            <span>100 km</span>
            <span>150 km</span>
          </div>
        </div>
      </div>

      {/* Right Column: Calculated Results Sidebar */}
      <div className={styles.resultsContainer}>
        {/* Main Hero Card: Cost & Units per Charge */}
        <div className={styles.heroResultCard}>
          <div className={styles.resultPill}>
            <Zap size={14} />
            <span>Calculated Charge Cost</span>
          </div>
          <div className={styles.mainCostValue}>
            Rs {Math.round(calculation.sessionCostPkr)}
          </div>
          <div className={styles.mainCostSubtext}>
            for {startSoc}% ➔ {targetSoc}% charge ({calculation.wallUnitsConsumed.toFixed(2)} units / kWh from meter)
          </div>

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-around',
              fontSize: '0.85rem',
            }}
          >
            <div>
              <span style={{ color: '#94a3b8' }}>Range Gained: </span>
              <strong style={{ color: '#ffffff' }}>~{Math.round(calculation.rangeGainedKm)} km</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Charge Time: </span>
              <strong style={{ color: '#2563eb' }}>
                {calculation.chargeHours}h {calculation.chargeMinutes}m
              </strong>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Cost Per Kilometer</span>
            <span className={styles.metricValue}>Rs {calculation.costPerKmPkr.toFixed(2)}</span>
            <span className={styles.metricSub}>vs Rs {calculation.petrolCostPerKm.toFixed(2)} (Petrol)</span>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Per-KM Savings</span>
            <span className={styles.metricValueSavings}>
              Rs {calculation.netSavingsPerKm.toFixed(2)} / km
            </span>
            <span className={styles.metricSub}>{calculation.savingsPercent}% Cheaper Than Petrol</span>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Monthly Electric Bill Addition</span>
            <span className={styles.metricValue}>
              Rs {Math.round(calculation.monthlyChargingCostPkr).toLocaleString()}
            </span>
            <span className={styles.metricSub}>
              +{Math.round(calculation.monthlyUnitsConsumed)} kWh units added
            </span>
          </div>

          <div className={styles.metricBox}>
            <span className={styles.metricTitle}>Monthly Net Savings</span>
            <span className={styles.metricValueSavings}>
              Rs {Math.round(calculation.netMonthlySavingsPkr).toLocaleString()}
            </span>
            <span className={styles.metricSub}>Saved on petrol budget</span>
          </div>
        </div>

        {/* Dynamic Slab Warning Card */}
        {tariffId === 'protected' && (
          <div className={`${styles.slabAlertCard} ${styles.slabAlertWarn}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              <AlertTriangle size={18} />
              <span>NEPRA Protected Slab Alert</span>
            </div>
            Adding ~<strong>{Math.round(calculation.monthlyUnitsConsumed)} units</strong> for vehicle charging will likely
            push your household past the strict <strong>200-unit protected cliff</strong>. Once breached by even 1 unit,
            your household loses protected status for 6 months, and ALL units jump to Rs 35–43/unit!
          </div>
        )}

        {tariffId === 'tou_peak' && (
          <div className={`${styles.slabAlertCard} ${styles.slabAlertBad}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              <AlertTriangle size={18} />
              <span>Expensive Peak Hours Active!</span>
            </div>
            You are charging at Rs 58/unit during peak evening hours (6 PM–10 PM). Delaying charging to off-peak (after 10 PM)
            at Rs 38/unit will save you{' '}
            <strong>
              Rs{' '}
              {Math.round(
                calculation.monthlyUnitsConsumed * (58 - 38)
              ).toLocaleString()}{' '}
              every month
            </strong>
            !
          </div>
        )}

        {tariffId !== 'protected' && tariffId !== 'tou_peak' && (
          <div className={`${styles.slabAlertCard} ${styles.slabAlertGood}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              <CheckCircle2 size={18} />
              <span>Massive Fuel Savings</span>
            </div>
            By switching your {calculation.monthlyDistanceKm} km monthly commute to electric power, you keep{' '}
            <strong>Rs {Math.round(calculation.netMonthlySavingsPkr).toLocaleString()}</strong> in your pocket every month!
          </div>
        )}

        {/* WhatsApp Share Button */}
        <button type="button" className={styles.shareBtn} onClick={handleShare}>
          <Share2 size={18} />
          <span>{copied ? 'Copied & Opening WhatsApp...' : 'Share Savings on WhatsApp'}</span>
        </button>

        {/* Sub-meter OCR Tracker CTA */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <Camera size={16} />
            <span>Dedicated EV Sub-Meter Tracking</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Do not let vehicle charging get mixed with home appliances. Install a sub-meter and scan it daily with Read Meter camera OCR to maintain exact consumption records.
          </p>
          <Link
            href="/guest"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <span>Open Camera Scanner</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
