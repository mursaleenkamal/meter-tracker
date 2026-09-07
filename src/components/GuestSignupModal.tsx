'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import styles from '../app/dashboard.module.css'
import { CloudUpload, X, ShieldCheck, Bell, Sparkles, ArrowRight } from 'lucide-react'

interface GuestSignupModalProps {
  isOpen: boolean
  onClose: () => void
  readingCount: number
}

export default function GuestSignupModal({
  isOpen,
  onClose,
  readingCount,
}: GuestSignupModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.setupOverlay} onClick={onClose}>
      <div
        className={`${styles.setupCard} fade-in`}
        style={{
          maxWidth: '520px',
          padding: '2.5rem 2rem',
          position: 'relative',
          borderRadius: '20px',
          background: 'rgba(13, 20, 38, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(16, 185, 129, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
            }}
          >
            <CloudUpload size={32} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(2, 132, 199, 0.1)',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} /> Consistent Tracker
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0 0.5rem 0' }}>
            Keep Your Readings Safe!
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            You've logged <strong>{readingCount} meter readings</strong>. Save your history to the cloud so you don't lose your data if your browser cache is cleared.
          </p>
        </div>

        {/* Value Perks */}
        <div
          style={{
            background: 'rgba(8, 14, 28, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>Permanent Cloud Backup:</strong> Access your meter readings from any phone or computer.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>WhatsApp & Push Alerts:</strong> Get notified before breaching the 200 unit subsidized slab.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            href="/register"
            className="glow-btn-solid"
            style={{
              textDecoration: 'none',
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '10px',
            }}
          >
            Create Free Account & Save Data <ArrowRight size={18} />
          </Link>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '8px',
              textDecoration: 'underline',
            }}
          >
            Continue as Guest (I'll do this later)
          </button>
        </div>
      </div>
    </div>
  )
}
