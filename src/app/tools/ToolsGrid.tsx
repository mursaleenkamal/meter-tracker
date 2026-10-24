'use client'

import React, { useState } from 'react'
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
  Sparkles,
  Flame,
  RotateCw,
  Droplets,
} from 'lucide-react'

interface ToolItem {
  id: string
  title: string
  description: string
  href: string
  category: string
  filterTag: string
  icon: React.ReactNode
  badge: string
  cardClass: string
}

export default function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const tools: ToolItem[] = [
    {
      id: 'digital-meter-scanner',
      title: 'Instant Digital Meter Scanner (kWh)',
      description:
        'Point your camera or upload a photo to extract 7-segment digital meter readings and strip decimals in seconds. 100% private in-browser OCR.',
      href: '/tools/read-digital-lcd-meter',
      category: 'AI Camera OCR',
      filterTag: 'ocr',
      icon: <Camera size={24} color="#00f0ff" />,
      badge: 'New AI OCR',
      cardClass: styles.toolCardElectric,
    },
    {
      id: 'analog-dial-meter-reader',
      title: 'Free Analog Electric Meter Reader (Dials)',
      description:
        'Point your phone camera or drop a photo to decode rotating clock dials. Interactive 5-dial decoder enforces neighbor-dial rounding rules to prevent billing errors.',
      href: '/tools/read-analog-dial-meter',
      category: 'AI Camera OCR',
      filterTag: 'ocr',
      icon: <RotateCw size={24} color="#f59e0b" />,
      badge: '5-Dial AI',
      cardClass: styles.toolCardElectric,
    },
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
    },
    {
      id: 'water-meter-reader',
      title: 'Smart Water Meter Scanner & Leak Detector',
      description:
        'Point your phone camera to extract water meter register digits in Gallons, m³, or CCF. Built-in low-flow leak detection indicator test spots pipe leaks.',
      href: '/tools/read-water-meter',
      category: 'AI Camera OCR',
      filterTag: 'ocr',
      icon: <Droplets size={24} color="#14b8a6" />,
      badge: 'Leak Test AI',
      cardClass: styles.toolCardWater,
    },
    {
      id: 'protected-slab',
      title: '200-Unit Protected Slab Calculator',
      description:
        'Avoid the costly 201-unit penalty cliff under NEPRA rules. Calculates bill differences and safe daily burn rate across K-Electric, IESCO, LESCO, and MEPCO.',
      href: '/protected-slab-calculator',
      category: 'Electricity & Tariffs',
      filterTag: 'electricity',
      icon: <Zap size={24} color="#00f0ff" />,
      badge: 'High Impact',
      cardClass: styles.toolCardElectric,
    },
    {
      id: 'battery-backup',
      title: 'UPS & Inverter Battery Backup Calculator',
      description:
        'Calculate exact backup hours and minutes for 100Ah, 150Ah, 180Ah, and 200Ah batteries. Factor in inverter efficiency, safe depth of discharge (DoD), and full recharge units.',
      href: '/tools/battery-backup-calculator',
      category: 'Batteries & Inverters',
      filterTag: 'electricity',
      icon: <BatteryCharging size={24} color="#00f0ff" />,
      badge: 'Popular',
      cardClass: styles.toolCardElectric,
    },
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
    },
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
      cardClass: styles.toolCardElectric,
    },
    {
      id: 'solar-net-metering',
      title: 'Solar Net Metering & Units Calculator',
      description:
        'Calculate daily and monthly unit generation for 3kW to 20kW systems, NEPRA green meter export credits, and investment payback period in Pakistani cities.',
      href: '/tools/solar-net-metering-calculator',
      category: 'Solar & Clean Energy',
      filterTag: 'solar',
      icon: <Sun size={24} color="#fbbf24" />,
      badge: 'Payback ROI',
      cardClass: styles.toolCardSolar,
    },
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
    },
  ]

  const categories = [
    { label: 'All Tools', value: 'all' },
    { label: '📷 AI Camera OCR', value: 'ocr' },
    { label: '⚡ Electricity & Tariffs', value: 'electricity' },
    { label: '💧 Water & Gas', value: 'gas' },
    { label: '👥 Landlords & Sub-Meters', value: 'submeter' },
    { label: '☀️ Solar Net Metering', value: 'solar' },
    { label: '🚗 Vehicles & Commute', value: 'vehicles' },
  ]

  const filteredTools =
    activeCategory === 'all'
      ? tools
      : tools.filter((t) => {
          if (activeCategory === 'ocr') return t.filterTag === 'ocr'
          if (activeCategory === 'electricity')
            return (
              t.filterTag === 'electricity' ||
              t.id === 'digital-meter-scanner' ||
              t.id === 'analog-dial-meter-reader'
            )
          if (activeCategory === 'gas')
            return t.id === 'gas-meter-reader' || t.id === 'water-meter-reader'
          if (activeCategory === 'submeter') return t.filterTag === 'submeter'
          if (activeCategory === 'solar') return t.filterTag === 'solar'
          if (activeCategory === 'vehicles') return t.filterTag === 'vehicles'
          return t.filterTag === activeCategory
        })

  return (
    <div>
      {/* Category Filter Pills (iLovePDF Style) */}
      <div className={styles.filterBar}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`${styles.filterPill} ${activeCategory === cat.value ? styles.filterPillActive : ''}`}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className={styles.toolsGrid} style={{ marginTop: '2rem' }}>
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
    </div>
  )
}
