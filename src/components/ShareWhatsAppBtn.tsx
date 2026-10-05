'use client'

import React from 'react'
import { Share2 } from 'lucide-react'

// WhatsApp SVG Icon
function WhatsAppIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.275-.1-.476-.15-.677.15-.2.302-.777.979-.953 1.18-.175.201-.351.226-.652.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.201.05-.376-.025-.527-.075-.15-.677-1.632-.928-2.235-.244-.588-.493-.509-.677-.518-.175-.008-.376-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.123 3.242 5.143 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.78-.727 2.03-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.2-.577-.35zM12.04 2C6.495 2 2 6.495 2 12.04c0 1.942.553 3.754 1.512 5.292L2 22l4.823-1.472A10.005 10.005 0 0 0 12.04 22c5.545 0 10.04-4.495 10.04-10.04S17.585 2 12.04 2zm0 18.232c-1.666 0-3.21-.497-4.509-1.353l-.323-.213-3.13.954.962-3.05-.224-.337A8.17 8.17 0 0 1 3.847 12.04c0-4.517 3.676-8.193 8.193-8.193 4.517 0 8.193 3.676 8.193 8.193 0 4.517-3.676 8.193-8.193 8.193z" />
    </svg>
  )
}

interface StatusShareProps {
  type: 'status'
  meterNumber?: string
  currentUsage: number
  limit?: number
  dailyAverage: number
  daysRemaining: number
  projectedUsage: number
  slabStatus?: string
  estimatedCost?: number
}

interface InstantShareProps {
  type: 'instant'
  units: number
  prevReading?: number
  currReading?: number
  daysRemaining?: number
  projectedUsage?: number
  slabStatus?: string
}

interface ReadingShareProps {
  type: 'reading'
  meterNumber?: string
  value: number
  date: string
  increment?: number | null
  notes?: string | null
}

interface MonthlyShareProps {
  type: 'monthly'
  meterNumber?: string
  monthLabel: string
  totalUnits: number
  dailyAverage: number
  startReading: number
  endReading: number
  slabStatus: string
  readingCount: number
}

type ShareWhatsAppBtnProps = (StatusShareProps | InstantShareProps | ReadingShareProps | MonthlyShareProps) & {
  label?: string
  variant?: 'button' | 'icon' | 'compact' | 'pill'
  className?: string
  style?: React.CSSProperties
}

export default function ShareWhatsAppBtn(props: ShareWhatsAppBtnProps) {
  const { type, className, style, label, variant } = props

  let text = ''

  if (type === 'instant') {
    const { units } = props
    const isBreached = units >= 200
    const slabUrdu = isBreached
      ? '❌ 200 Units Slab Breached (Unprotected High Commercial Rate)'
      : '✅ Protected Slab Safe (Subsidized Rate)'
    const alertUrdu = isBreached
      ? '⚠️ *Khabardar:* 200 units cross honay par bill taqreeban Rs 10,000 - Rs 18,000+ tak pohanch jata hai!'
      : `💡 *Bachat Alert:* 200 units protected slab mein sirf ${(200 - units).toFixed(0)} units baqi hain. Limit mein reh kar Rs 4,000+ ki bachat karein!`

    text = [
      `⚡ *Read Meter - Bijli Ka Bill & Unit Check* 📊`,
      ``,
      `🔢 *Current Reading Units:* ${units.toFixed(0)} Units`,
      `🛡️ *Slab Status:* ${slabUrdu}`,
      alertUrdu,
      ``,
      `📸 *Apne mobile camera se meter dial scan karein aur live bill check karein:*`,
      `👉 https://www.readmeter.online`
    ].join('\n')
  } else if (type === 'status') {
    const { meterNumber, currentUsage, limit = 200, dailyAverage, daysRemaining, projectedUsage, slabStatus } = props
    const isBreached = currentUsage >= limit
    const isWarning = projectedUsage >= limit && !isBreached

    const slabUrdu = slabStatus
      ? slabStatus.includes('Breached') || slabStatus.includes('UNPROTECTED')
        ? '❌ 200 Units Slab Breached (Commercial High Rate)'
        : slabStatus.includes('Warning') || slabStatus.includes('AT RISK') || slabStatus.includes('Risk')
        ? `⚠️ Danger: Current pace par ${projectedUsage.toFixed(0)} Units (Breach) ka khatra hai!`
        : '✅ Protected Subsidized Slab Safe (Under 200 Units)'
      : isBreached
      ? '❌ 200 Units Slab Breached (Commercial High Rate)'
      : isWarning
      ? `⚠️ Danger: Current pace par ${projectedUsage.toFixed(0)} Units (Breach) ka khatra hai!`
      : '✅ Protected Subsidized Slab Safe (Under 200 Units)'

    const forecastTip = isBreached
      ? `⚠️ *Bill Warning:* 200 units cross hain — is mahinay double/triple commercial rate lagay ga.`
      : isWarning
      ? `⚠️ *Bachat Target:* 200 units se neechay rehnay ke liye rozana ≤ ${Math.max((limit - currentUsage) / Math.max(daysRemaining, 1), 0).toFixed(1)} units/din burn rate rakhein!`
      : `🎯 *Bachat Safe:* Protected rate par Rs 4,000+ ki bachat safe hai. Aise hi control rakhein!`

    text = [
      `⚡ *Read Meter - Live Bijli Bill & Slab Status* 📊`,
      meterNumber ? `🔢 *Meter ID:* ${meterNumber}` : '',
      `⚡ *Ab Tak Ki Consumption:* ${currentUsage.toFixed(0)} Units`,
      `📈 *Rozana Ka Average:* ${dailyAverage.toFixed(1)} Units/din`,
      `🔮 *Mahinay Ka Forecast:* ${projectedUsage.toFixed(0)} Units`,
      `🛡️ *Slab Status:* ${slabUrdu}`,
      `⏳ *Cycle Mein Baqi Din:* ${daysRemaining} Din`,
      ``,
      forecastTip,
      ``,
      `📸 *Daily meter scan karein aur bijli ka bill bachayein:*`,
      `👉 https://www.readmeter.online`
    ].filter(Boolean).join('\n')
  } else if (type === 'monthly') {
    const { meterNumber, monthLabel, totalUnits, dailyAverage, startReading, endReading, slabStatus, readingCount } = props
    text = [
      `📊 *Read Meter - Mahana Bijli Report* ⚡`,
      meterNumber ? `🔢 *Meter ID:* ${meterNumber}` : '',
      `📅 *Billing Mahina:* ${monthLabel}`,
      `⚡ *Total Consumption:* ${totalUnits.toFixed(0)} Units`,
      `📈 *Rozana Ka Average:* ${dailyAverage.toFixed(1)} Units/din`,
      `🔢 *Dial Start ➔ End:* ${startReading.toFixed(0)} ➔ ${endReading.toFixed(0)}`,
      `🛡️ *Slab Status:* ${slabStatus}`,
      `📝 *Total Reading Logs:* ${readingCount}`,
      ``,
      `📸 *Apna meter daily track karein aur bill bachayein:*`,
      `👉 https://www.readmeter.online`
    ].filter(Boolean).join('\n')
  } else {
    const { meterNumber, value, date, increment, notes } = props
    const incText = increment !== null && increment !== undefined ? `+${increment.toFixed(0)} Units` : 'Cycle Baseline'
    text = [
      `⚡ *Read Meter - Reading Log Entry* 📝`,
      meterNumber ? `🔢 *Meter ID:* ${meterNumber}` : '',
      `🔢 *Logged Value:* ${value.toFixed(0)} Units`,
      `📈 *Izafa (Increment):* ${incText}`,
      `📅 *Tareekh:* ${date}`,
      notes ? `📝 *Notes:* ${notes}` : '',
      ``,
      `💡 *Tip:* Daily meter scan karein aur 200 units protected slab bachayein!`,
      `👉 https://www.readmeter.online`
    ].filter(Boolean).join('\n')
  }

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`

  // 1. Icon variant for table rows
  if (variant === 'icon' || (type === 'reading' && !variant)) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '6px',
          background: 'rgba(37, 211, 102, 0.1)',
          border: '1px solid rgba(37, 211, 102, 0.25)',
          color: '#25D366',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          textDecoration: 'none',
          ...style,
        }}
        title="WhatsApp par Share Karein"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#25D366'
          e.currentTarget.style.color = '#000'
          e.currentTarget.style.boxShadow = '0 0 10px rgba(37, 211, 102, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'
          e.currentTarget.style.color = '#25D366'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <WhatsAppIcon size={14} color="currentColor" />
      </a>
    )
  }

  // 2. Pill variant for banners / compact headers
  if (variant === 'pill') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: '#25D366',
          color: '#040915',
          fontWeight: 700,
          fontSize: '0.8rem',
          padding: '6px 14px',
          borderRadius: '9999px',
          textDecoration: 'none',
          boxShadow: '0 2px 10px rgba(37, 211, 102, 0.35)',
          transition: 'all 0.2s ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(37, 211, 102, 0.35)'
        }}
      >
        <WhatsAppIcon size={15} color="#040915" />
        <span>{label || 'WhatsApp Share'}</span>
      </a>
    )
  }

  // 3. Standard / Full Button variant
  const defaultLabel =
    type === 'instant'
      ? 'WhatsApp par Share Karein'
      : type === 'monthly'
      ? 'Share Monthly Report'
      : 'WhatsApp par Share Karein'

  const displayLabel = label || defaultLabel

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.55rem',
        textDecoration: 'none',
        padding: variant === 'compact' ? '8px 14px' : '11px 18px',
        borderRadius: '10px',
        fontSize: variant === 'compact' ? '0.85rem' : '0.95rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(37, 211, 102, 0.08) 100%)',
        border: '1px solid rgba(37, 211, 102, 0.4)',
        color: '#25D366',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.12)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#25D366'
        e.currentTarget.style.color = '#040915'
        e.currentTarget.style.borderColor = '#25D366'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(37, 211, 102, 0.4)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(37, 211, 102, 0.08) 100%)'
        e.currentTarget.style.color = '#25D366'
        e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.4)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.12)'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <WhatsAppIcon size={18} color="currentColor" />
      <span>{displayLabel}</span>
    </a>
  )
}