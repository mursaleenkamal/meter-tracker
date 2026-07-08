'use client'

import { useState } from 'react'
import { deleteReadingAction } from '@/lib/actions'
import { Trash2, Loader2 } from 'lucide-react'
import styles from '../app/dashboard.module.css'

interface DeleteReadingBtnProps {
  readingId: string
}

export default function DeleteReadingBtn({ readingId }: DeleteReadingBtnProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this reading record?')) {
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('readingId', readingId)

    const result = await deleteReadingAction(formData)
    setIsLoading(false)

    if (result?.error) {
      alert(result.error)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className={styles.deleteBtn}
      title="Delete reading"
      aria-label="Delete reading"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  )
}
