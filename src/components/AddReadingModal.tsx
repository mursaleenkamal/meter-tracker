'use client'

import { useEffect } from 'react'
import ReadingForm from './ReadingForm'
import { X } from 'lucide-react'
import styles from '../app/dashboard.module.css'

interface AddReadingModalProps {
  isOpen: boolean
  onClose: () => void
  meterId: string
  meterNumber: string
}

export default function AddReadingModal({
  isOpen,
  onClose,
  meterId,
  meterNumber,
}: AddReadingModalProps) {
  // Prevent background scrolling when modal is open
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
          maxWidth: '650px',
          padding: '2.5rem 2rem',
          position: 'relative',
          gap: '1rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
            padding: '0.25rem',
            borderRadius: '6px',
            transition: 'all var(--transition-fast)',
          }}
          className="hover-glow"
          title="Close modal"
          aria-label="Close modal"
        >
          <X size={20} className={styles.closeIcon} />
        </button>

        {/* Embedded Reading Form */}
        <ReadingForm
          meterId={meterId}
          meterNumber={meterNumber}
          onClose={onClose}
          onSuccess={() => {
            onClose()
            // In Next.js App Router, this triggers server components to re-run
            // their fetch queries without full page reload.
            window.location.reload()
          }}
        />
      </div>
    </div>
  )
}
