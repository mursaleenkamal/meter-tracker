'use client'

import { useState } from 'react'
import AddReadingModal from './AddReadingModal'
import { Plus } from 'lucide-react'

interface AddReadingButtonProps {
  meterId: string
  meterNumber: string
  className?: string
  style?: React.CSSProperties
  label?: string
}

export default function AddReadingButton({
  meterId,
  meterNumber,
  className,
  style,
  label = 'Add New Reading',
}: AddReadingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className}
        style={{
          ...style,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
        }}
      >
        <Plus size={18} /> {label}
      </button>

      <AddReadingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        meterId={meterId}
        meterNumber={meterNumber}
      />
    </>
  )
}
