'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './toolsHub.module.css'
import {
  Zap,
  Camera,
  ArrowRight,
  BatteryCharging,
  Car,
  Users,
  Sun,
  Gauge,
  Flame,
  RotateCw,
  Droplets,
  Search,
  X,
  Wind,
  Cpu,
  Fuel,
} from 'lucide-react'

export interface ToolItem {
  id: string
  title: string
  description: string
  href: string
  category: string
  filterTag: string
  icon: React.ReactNode
  badge: string
  cardClass: string
  searchTerms: string
}

interface ToolsGridProps {
  initialCategory?: string
  showSearch?: boolean
  limit?: number
}

export const ALL_TOOLS: ToolItem[] = [
  // 1. Digital LCD Scanner
  {
    id: 'digital-meter-scanner',
    title: 'Instant Digital Meter Scanner (kWh)',
    description:
      'Point your phone camera or upload a photo to extract 7-segment digital LCD meter readings and strip decimals in seconds. 100% private in-browser OCR.',
    href: '/tools/read-digital-lcd-meter',
    category: 'AI Camera OCR',
    filterTag: 'ocr',
    icon: <Camera size={24} color="#00f0ff" />,
    badge: 'New AI OCR',
    cardClass: styles.toolCardElectric,
    searchTerms: 'digital lcd meter scanner ocr photo electric kwh reading camera',
  },
  // 2. Analog Dial Scanner
  {
    id: 'analog-dial-meter-reader',
    title: 'Free Analog Electric Meter Reader (Dials)',
    description:
      'Decode rotating clock dials with phone photos. Interactive 5-dial decoder enforces neighbor-dial rounding rules to prevent billing errors.',
    href: '/tools/read-analog-dial-meter',
    category: 'AI Camera OCR',
    filterTag: 'ocr',
    icon: <RotateCw size={24} color="#f59e0b" />,
    badge: '5-Dial AI',
    cardClass: styles.toolCardElectric,
    searchTerms: 'analog dial meter reader 5 dial clock needles electric kwh nepra',
  },
  // 3. Gas Roller Meter Scanner
  {
    id: 'gas-meter-reader',
    title: 'Online Gas Meter Photo Reader (m³ / CCF)',
    description:
      'Extract mechanical roller odometer digits from phone photos. Strips red fractional decimal drums automatically for natural gas and LPG registers.',
    href: '/tools/read-gas-meter',
    category: 'AI Camera OCR',
    filterTag: 'ocr',
    icon: <Flame size={24} color="#0284c7" />,
    badge: 'Odometer AI',
    cardClass: styles.toolCardGas,
    searchTerms: 'gas meter reader ssgc sngpl roller odometer m3 ccf red drums camera',
  },
  // 4. Water Meter Scanner
  {
    id: 'water-meter-reader',
    title: 'Smart Water Meter Scanner & Leak Detector',
    description:
      'Extract water meter register digits in Gallons, m³, or CCF. Built-in low-flow leak detection indicator test spots hidden pipe leaks.',
    href: '/tools/read-water-meter',
    category: 'AI Camera OCR',
    filterTag: 'ocr',
    icon: <Droplets size={24} color="#14b8a6" />,
    badge: 'Leak Test AI',
    cardClass: styles.toolCardWater,
    searchTerms: 'water meter scanner leak detector gallons m3 ccf sweep hand',
  },
  // 5. Appliance Power Cost Calculator
  {
    id: 'appliance-power-cost',
    title: 'Appliance Electricity Cost & Wattage Calculator',
    description:
      'Calculate monthly units (kWh) and bill cost for AC, fridge, iron, water motor pump, ceiling fans, and TV under current Pakistani slab tariffs.',
    href: '/tools/appliance-power-cost-calculator',
    category: 'Electricity & Tariffs',
    filterTag: 'electricity',
    icon: <Cpu size={24} color="#38bdf8" />,
    badge: 'High Impact',
    cardClass: styles.toolCardAppliance,
    searchTerms: 'appliance wattage power cost calculator ac fridge iron pump motor fan tv units',
  },
  // 6. AC Electricity Cost & Inverter Savings
  {
    id: 'ac-electricity-cost',
    title: 'AC Electricity Cost & Inverter Savings Calculator',
    description:
      'Calculate exact units and rupee savings when setting 1 Ton, 1.5 Ton, or 2 Ton AC to 26°C eco mode vs chilled 18°C. Inverter vs non-inverter breakdown.',
    href: '/tools/ac-electricity-cost-calculator',
    category: 'Electricity & Tariffs',
    filterTag: 'electricity',
    icon: <Wind size={24} color="#38bdf8" />,
    badge: 'Eco Savings',
    cardClass: styles.toolCardAppliance,
    searchTerms: 'ac electricity cost calculator inverter non inverter 1.5 ton 1 ton 26 degrees savings',
  },
  // 7. 200-Unit Protected Slab Calculator
  {
    id: 'protected-slab',
    title: '200-Unit Protected Slab Calculator',
    description:
      'Avoid the costly 201-unit penalty cliff under NEPRA rules. Calculates bill differences and safe daily burn rate across K-Electric, IESCO, LESCO, and MEPCO.',
    href: '/protected-slab-calculator',
    category: 'Electricity & Tariffs',
    filterTag: 'electricity',
    icon: <Zap size={24} color="#00f0ff" />,
    badge: 'Must Check',
    cardClass: styles.toolCardElectric,
    searchTerms: '200 unit protected slab calculator nepra k-electric lesco iesco fesco subsidy',
  },
  // 8. Tenant Sub-Meter Splitter
  {
    id: 'submeter-bill',
    title: 'Tenant Sub-Meter Bill Divider & Receipt Generator',
    description:
      'Fairly divide shared main electricity bills among tenants and portions. Includes common load division, 1-click formatted WhatsApp invoices, and commercial pilot export.',
    href: '/tools/landlord-submeter-splitter',
    category: 'Sub-metering & Landlords',
    filterTag: 'submeter',
    icon: <Users size={24} color="#10b981" />,
    badge: 'Zero Dispute',
    cardClass: styles.toolCardSubmeter,
    searchTerms: 'sub meter bill calculator tenant landlord splitter divide units shared meter whatsapp',
  },
  // 9. Solar System Sizing & Inverter Calculator
  {
    id: 'solar-system-sizing',
    title: 'Solar System Sizing & Inverter Calculator',
    description:
      'Calculate recommended solar system capacity in kW, number of 585W bifacial solar panels, inverter rating, and roof area needed for your monthly bill.',
    href: '/tools/solar-system-sizing-calculator',
    category: 'Solar & Clean Energy',
    filterTag: 'solar',
    icon: <Sun size={24} color="#fbbf24" />,
    badge: 'Sizing Spec',
    cardClass: styles.toolCardSolar,
    searchTerms: 'solar system sizing calculator kw panels inverter roof space bifacial mono perc',
  },
  // 10. Solar Net Metering & Units Calculator
  {
    id: 'solar-net-metering',
    title: 'Solar Net Metering & Units Calculator',
    description:
      'Calculate daily and monthly unit generation for 3kW to 20kW systems, NEPRA green meter export credits, and investment payback period in Pakistani cities.',
    href: '/tools/solar-net-metering-calculator',
    category: 'Solar & Clean Energy',
    filterTag: 'solar',
    icon: <Sun size={24} color="#f59e0b" />,
    badge: 'Payback ROI',
    cardClass: styles.toolCardSolar,
    searchTerms: 'solar net metering calculator green meter nepra export buyback units roi',
  },
  // 11. UPS & Inverter Battery Backup Calculator
  {
    id: 'battery-backup',
    title: 'UPS & Inverter Battery Backup Calculator',
    description:
      'Calculate exact backup hours and minutes for 100Ah, 150Ah, 180Ah, and 200Ah batteries. Factor in inverter efficiency, safe depth of discharge (DoD), and recharge units.',
    href: '/tools/battery-backup-calculator',
    category: 'Batteries & Inverters',
    filterTag: 'solar',
    icon: <BatteryCharging size={24} color="#00f0ff" />,
    badge: 'Popular',
    cardClass: styles.toolCardElectric,
    searchTerms: 'ups battery backup calculator inverter tall tubular ags phoenix volta 200ah hours',
  },
  // 12. Generator Fuel Cost Calculator
  {
    id: 'generator-fuel-cost',
    title: 'Generator Fuel Cost & Backup Calculator',
    description:
      'Calculate hourly petrol, diesel, and LPG fuel consumption, daily outage expenses, and effective cost per unit (kWh) compared to utility grid power.',
    href: '/tools/generator-fuel-cost-calculator',
    category: 'Gas & Fuel',
    filterTag: 'gas',
    icon: <Fuel size={24} color="#f97316" />,
    badge: 'Outage Fuel',
    cardClass: styles.toolCardGenerator,
    searchTerms: 'generator fuel cost calculator petrol diesel lpg consumption liters load shedding',
  },
  // 13. LPG Gas Cylinder Days Calculator
  {
    id: 'lpg-cylinder-duration',
    title: 'LPG Cylinder Days & Consumption Calculator',
    description:
      'Calculate how many days an 11.8 kg domestic or 45.4 kg commercial cylinder will last based on stove burners and geyser usage, with automatic refill date forecasting.',
    href: '/tools/lpg-cylinder-calculator',
    category: 'Gas & Fuel',
    filterTag: 'gas',
    icon: <Flame size={24} color="#f43f5e" />,
    badge: 'Refill Date',
    cardClass: styles.toolCardLpg,
    searchTerms: 'lpg cylinder calculator gas days remaining domestic 11.8 kg refill stove burner geyser',
  },
  // 14. EV & E-Bike Charging Cost Calculator
  {
    id: 'ev-charging',
    title: 'EV & E-Bike Charging Cost Calculator',
    description:
      'Calculate units (kWh), cost per full charge, and per-km fuel savings vs petrol for E-bikes (Yadea, Crown) and electric cars (Honri Ve, Deepal, BYD) under NEPRA tariffs.',
    href: '/tools/ev-charging-cost-calculator',
    category: 'Electric Vehicles & Commute',
    filterTag: 'vehicles',
    icon: <Car size={24} color="#00f0ff" />,
    badge: 'Fuel Bachat',
    cardClass: styles.toolCardVehicle,
    searchTerms: 'ev charging cost calculator electric bike car yadea crown honri petrol bachat',
  },
  // 15. Car & Bike Oil Change Calculator
  {
    id: 'oil-change',
    title: 'Car & Bike Oil Change Interval Calculator',
    description:
      'Track remaining kilometers and projected service due dates based on commute, oil grade (mineral, semi-synthetic, fully synthetic), and severe city driving.',
    href: '/tools/car-oil-change-calculator',
    category: 'Vehicles & Maintenance',
    filterTag: 'vehicles',
    icon: <Gauge size={24} color="#3b82f6" />,
    badge: 'Interval Tracking',
    cardClass: styles.toolCardVehicle,
    searchTerms: 'car bike oil change calculator interval kilometers service due maintenance',
  },
]

export default function ToolsGrid({
  initialCategory = 'all',
  showSearch = true,
  limit,
}: ToolsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = [
    { label: 'All Tools', value: 'all', count: ALL_TOOLS.length },
    {
      label: '📷 AI Camera OCR',
      value: 'ocr',
      count: ALL_TOOLS.filter((t) => t.filterTag === 'ocr').length,
    },
    {
      label: '⚡ Electricity & AC',
      value: 'electricity',
      count: ALL_TOOLS.filter(
        (t) =>
          t.filterTag === 'electricity' ||
          t.id === 'digital-meter-scanner' ||
          t.id === 'analog-dial-meter-reader'
      ).length,
    },
    {
      label: '☀️ Solar & Battery',
      value: 'solar',
      count: ALL_TOOLS.filter((t) => t.filterTag === 'solar').length,
    },
    {
      label: '👥 Landlords & Sub-Meters',
      value: 'submeter',
      count: ALL_TOOLS.filter((t) => t.filterTag === 'submeter').length,
    },
    {
      label: '🔥 Gas, Water & Fuel',
      value: 'gas',
      count: ALL_TOOLS.filter(
        (t) =>
          t.filterTag === 'gas' ||
          t.id === 'gas-meter-reader' ||
          t.id === 'water-meter-reader'
      ).length,
    },
    {
      label: '🚗 Vehicles & Fuel',
      value: 'vehicles',
      count: ALL_TOOLS.filter((t) => t.filterTag === 'vehicles').length,
    },
  ]

  const filteredTools = useMemo(() => {
    let list = ALL_TOOLS

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((t) => {
        if (activeCategory === 'ocr') return t.filterTag === 'ocr'
        if (activeCategory === 'electricity')
          return (
            t.filterTag === 'electricity' ||
            t.id === 'digital-meter-scanner' ||
            t.id === 'analog-dial-meter-reader'
          )
        if (activeCategory === 'solar') return t.filterTag === 'solar'
        if (activeCategory === 'submeter') return t.filterTag === 'submeter'
        if (activeCategory === 'gas')
          return (
            t.filterTag === 'gas' ||
            t.id === 'gas-meter-reader' ||
            t.id === 'water-meter-reader'
          )
        if (activeCategory === 'vehicles') return t.filterTag === 'vehicles'
        return t.filterTag === activeCategory
      })
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.searchTerms.toLowerCase().includes(q)
      )
    }

    if (limit && limit > 0) {
      return list.slice(0, limit)
    }

    return list
  }, [activeCategory, searchQuery, limit])

  return (
    <div>
      {/* Live Search Bar (iLovePDF Style) */}
      {showSearch && (
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search all 15 utility tools (e.g. AC cost, solar, meter scan, submeter, battery, gas)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Category Filter Pills (iLovePDF Style) */}
      <div className={styles.filterBar}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`${styles.filterPill} ${activeCategory === cat.value ? styles.filterPillActive : ''}`}
            onClick={() => setActiveCategory(cat.value)}
          >
            <span>{cat.label}</span>
            <span className={styles.pillCount}>{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className={styles.toolsGrid} style={{ marginTop: '1.5rem' }}>
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className={`${styles.toolCard} ${tool.cardClass}`}
            >
              <div>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>{tool.category}</span>
                  <span className={styles.badgePopular}>{tool.badge}</span>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <div className={styles.iconWrapper}>{tool.icon}</div>
                  <div className={styles.cardBody} style={{ marginTop: '1rem' }}>
                    <h2 className={styles.toolTitle}>{tool.title}</h2>
                    <p className={styles.toolDescription}>{tool.description}</p>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.launchLink}>
                  Launch Tool <ArrowRight size={16} />
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Free • Web</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <Search size={36} color="#64748b" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>
            No tools matched &ldquo;{searchQuery}&rdquo;
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Try searching for &ldquo;AC&rdquo;, &ldquo;Solar&rdquo;, &ldquo;Meter&rdquo;, &ldquo;Battery&rdquo;, or reset the filters.
          </p>
          <button
            type="button"
            className={styles.filterPill}
            style={{ marginTop: '1.25rem', borderColor: '#00f0ff', color: '#00f0ff' }}
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('all')
            }}
          >
            Reset Search &amp; Show All 15 Tools
          </button>
        </div>
      )}
    </div>
  )
}
