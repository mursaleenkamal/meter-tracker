'use client'

import { Share2 } from 'lucide-react'

interface StatusShareProps {
  type: 'status'
  meterNumber: string
  currentUsage: number
  limit: number
  dailyAverage: number
  daysRemaining: number
  projectedUsage: number
  slabStatus: string
}

interface ReadingShareProps {
  type: 'reading'
  meterNumber: string
  value: number
  date: string
  increment: number | null
  notes: string | null
}

type ShareWhatsAppBtnProps = (StatusShareProps | ReadingShareProps) & {
  className?: string
  style?: React.CSSProperties
}

export default function ShareWhatsAppBtn(props: ShareWhatsAppBtnProps) {
  const { type, meterNumber, className, style } = props

  let text = ''

  if (type === 'status') {
    const { currentUsage, limit, dailyAverage, daysRemaining, projectedUsage, slabStatus } = props
    text = [
      `⚡ *VoltTrack Status Update*`,
      `*Meter ID:* ${meterNumber}`,
      `*Current Usage:* ${currentUsage.toFixed(0)} Units (of ${limit.toFixed(0)} limit)`,
      `*Daily Average:* ${dailyAverage.toFixed(1)} Units/day`,
      `*Projected Month End:* ${projectedUsage.toFixed(0)} Units`,
      `*Slab Status:* ${slabStatus}`,
      `📅 *Cycle Info:* ${daysRemaining} days left in billing period.`,
      `\n_Shared via VoltTrack_`
    ].join('\n')
  } else {
    const { value, date, increment, notes } = props
    const incText = increment !== null ? `+${increment.toFixed(0)} Units` : 'Initial Baseline'
    text = [
      `⚡ *VoltTrack Reading Log*`,
      `*Meter ID:* ${meterNumber}`,
      `*Logged Value:* ${value.toFixed(0)} Units`,
      `*Increment:* ${incText}`,
      `*Logged Date:* ${date}`,
      notes ? `*Notes:* ${notes}` : '',
      `\n_Shared via VoltTrack_`
    ].filter(Boolean).join('\n')
  }

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`

  if (type === 'status') {
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
          gap: '0.5rem',
          textDecoration: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: 'rgba(37, 211, 102, 0.1)',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          color: '#25D366',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
          boxShadow: '0 0 10px rgba(37, 211, 102, 0.1)',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#25D366'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.boxShadow = '0 0 15px #25D366'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'
          e.currentTarget.style.color = '#25D366'
          e.currentTarget.style.boxShadow = '0 0 10px rgba(37, 211, 102, 0.1)'
        }}
      >
        <Share2 size={16} /> Share Status
      </a>
    )
  }

  // Small icon button for table rows
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
        background: 'rgba(37, 211, 102, 0.08)',
        border: '1px solid rgba(37, 211, 102, 0.2)',
        color: '#25D366',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        textDecoration: 'none',
        ...style,
      }}
      title="Share to WhatsApp"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)'
        e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.4)'
        e.currentTarget.style.boxShadow = '0 0 8px rgba(37, 211, 102, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(37, 211, 102, 0.08)'
        e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.2)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <Share2 size={14} />
    </a>
  )
}
