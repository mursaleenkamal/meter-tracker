'use client'

import { useState } from 'react'
import { Calendar, Check, Loader2, Edit2 } from 'lucide-react'
import { updateNextReadingDateAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface ReadingDateEditorProps {
  meterId: string
  currentDate: string | null
}

export default function ReadingDateEditor({ meterId, currentDate }: ReadingDateEditorProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [dateValue, setDateValue] = useState(currentDate || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('meterId', meterId)
    formData.append('nextReadingDate', dateValue)

    const result = await updateNextReadingDateAction(formData)
    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setIsEditing(false)
      // Hard refresh page to reload data
      window.location.reload()
    }
  }

  // Format date nicely
  const formatDateStr = (dateStr: string | null) => {
    if (!dateStr) return 'Not Set (Approx. 30 days)'
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={14} /> Expected Reading Date:
        </span>
        {!isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: currentDate ? 'var(--primary)' : 'var(--text-muted)' }}>
              {formatDateStr(currentDate)}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                display: 'inline-flex'
              }}
              title="Edit Expected Reading Date"
              className="hover-glow"
            >
              <Edit2 size={12} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              disabled={isLoading}
              style={{
                background: 'rgba(6, 9, 19, 0.7)',
                border: '1px solid var(--border-color-active)',
                borderRadius: '6px',
                padding: '4px 8px',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={{
                background: 'var(--primary)',
                border: 'none',
                color: 'var(--bg-main)',
                cursor: 'pointer',
                padding: '0.3rem',
                borderRadius: '6px',
                display: 'inline-flex',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Save Date"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            </button>
          </div>
        )}
      </div>
      {error && (
        <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.25rem', textAlign: 'right' }}>
          {error}
        </div>
      )}
    </div>
  )
}
