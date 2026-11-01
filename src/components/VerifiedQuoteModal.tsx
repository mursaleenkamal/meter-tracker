'use client'

import React, { useState, useEffect } from 'react'
import { X, ShieldCheck, Zap, Send, PhoneCall, CheckCircle2 } from 'lucide-react'
import { trackConversionEvent } from '@/lib/telemetry'

interface VerifiedQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  serviceType: 'solar' | 'battery'
  systemSize: string
  defaultCity?: string
  estimatedMetric?: string
}

const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad / Rawalpindi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Peshawar',
  'Quetta',
  'Other',
]

export default function VerifiedQuoteModal({
  isOpen,
  onClose,
  serviceType,
  systemSize,
  defaultCity = 'Karachi',
  estimatedMetric,
}: VerifiedQuoteModalProps) {
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState(defaultCity)
  const [whatsapp, setWhatsapp] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setSubmitted(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const titleType = serviceType === 'solar' ? 'Solar Net-Metering' : 'Battery Backup / UPS'
    const messageLines = [
      `⚡ *Read Meter — Installation Quote Request*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🏷️ *Service:* ${titleType}`,
      `⚡ *System Capacity:* ${systemSize}`,
    ]

    if (estimatedMetric) {
      messageLines.push(`📊 *Estimated Output:* ${estimatedMetric}`)
    }

    messageLines.push(`👤 *Name:* ${fullName}`)
    messageLines.push(`📍 *City:* ${city}`)
    messageLines.push(`📱 *WhatsApp:* ${whatsapp}`)
    messageLines.push(`━━━━━━━━━━━━━━━━━━━━━━`)
    messageLines.push(`Assalam o Alaikum, please connect me with verified installation partners for quotes.`)

    const encodedText = encodeURIComponent(messageLines.join('\n'))
    const whatsappUrl = `https://wa.me/923002485885?text=${encodedText}`

    trackConversionEvent('submit_installation_quote_lead', {
      serviceType,
      systemSize,
      city,
    })

    setSubmitted(true)
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      onClose()
    }, 800)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card-bg, #0f172a)',
          color: 'var(--text-primary, #ffffff)',
          border: '1.5px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '500px',
          padding: '2rem',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: '4px',
          }}
          title="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              color: '#00f0ff',
              fontWeight: 700,
              marginBottom: '0.65rem',
            }}
          >
            <ShieldCheck size={14} /> Verified Partner Network
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
            ⚡ Get Verified {serviceType === 'solar' ? 'Solar' : 'Battery'} Quotes
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.45 }}>
            Direct connection with vetted Tier-1 installers in Karachi, Lahore &amp; Islamabad with 0 broker markups.
          </p>
        </div>

        {/* Auto-filled Summary Tag */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Auto-filled System Size:</span>
          <span style={{ fontWeight: 700, color: '#00f0ff' }}>{systemSize}</span>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={48} style={{ color: '#10b981', margin: '0 auto 0.75rem' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Redirecting to WhatsApp...
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Connecting with verified installer coordinator.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Field 1: Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(6, 10, 20, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Field 2: City */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(6, 10, 20, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: WhatsApp Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0300 1234567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(6, 10, 20, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                background: '#25d366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} /> Request Free Quotes on WhatsApp
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
              🔒 100% Free • No spam • Direct installer pricing
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
