'use client'

import { useState } from 'react'
import { updateLimitAction } from '@/lib/actions'
import styles from '../app/dashboard.module.css'
import { Loader2 } from 'lucide-react'

interface LimitEditorProps {
  meterId: string
  currentLimit: number
}

export default function LimitEditor({ meterId, currentLimit }: LimitEditorProps) {
  const [limit, setLimit] = useState(currentLimit)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateLimitAction(formData)
    setIsLoading(false)

    if (!result?.error) {
      setIsEditing(false)
    } else {
      alert(result.error)
    }
  }

  if (!isEditing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Budget Limit: </span>
          <strong style={{ color: '#fff', fontSize: '1rem' }}>{limit} Units</strong>
        </div>
        <button onClick={() => setIsEditing(true)} className="glow-btn-accent" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
          Change Limit
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.limitForm}>
      <input type="hidden" name="meterId" value={meterId} />
      <input
        type="number"
        name="maxUsageLimit"
        className={styles.limitInput}
        defaultValue={limit}
        min="1"
        step="any"
        required
        disabled={isLoading}
      />
      <button type="submit" className="glow-btn-solid styles.limitSubmitBtn" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'Save'}
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="glow-btn"
        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        disabled={isLoading}
      >
        Cancel
      </button>
    </form>
  )
}
