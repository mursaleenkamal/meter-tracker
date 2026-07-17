'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, Check, ChevronDown } from 'lucide-react'
import AddMeterModal from './AddMeterModal'

interface Meter {
  id: string
  meter_number: string
  max_usage_limit: string | number
}

interface MeterSelectorProps {
  meters: Meter[]
  activeMeterId: string
}

export default function MeterSelector({ meters, activeMeterId }: MeterSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const activeMeter = meters.find((m) => m.id === activeMeterId) || meters[0]

  const handleSelect = (id: string) => {
    setIsOpen(false)
    router.push(`${pathname}?meterId=${id}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
      {/* Custom dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'var(--card-bg)',
            backdropFilter: 'var(--glass-filter)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.95rem',
            cursor: 'pointer',
            minWidth: '220px',
            justifyContent: 'space-between',
            transition: 'all var(--transition-fast)',
          }}
          className="hover-glow"
        >
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Meter
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
              {activeMeter.meter_number}
            </span>
          </span>
          <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop overlay to close dropdown */}
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
              }}
            />
            {/* Dropdown Options */}
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                background: '#0d1527',
                border: '1px solid var(--border-color-active)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg), 0 0 15px var(--primary-glow)',
                zIndex: 100,
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '4px',
              }}
              className="fade-in"
            >
              {meters.map((meter) => {
                const isActive = meter.id === activeMeterId
                return (
                  <button
                    key={meter.id}
                    onClick={() => handleSelect(meter.id)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-secondary)'
                        e.currentTarget.style.background = 'transparent'
                      } else {
                        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)'
                      }
                    }}
                  >
                    <span>{meter.meter_number}</span>
                    {isActive && <Check size={14} style={{ color: 'var(--primary)' }} />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Add Meter Button */}
      <button
        onClick={() => setIsAddOpen(true)}
        style={{
          background: 'transparent',
          border: '1px dashed var(--primary)',
          borderRadius: '8px',
          padding: '10px 14px',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
          height: '46px',
          transition: 'all var(--transition-normal)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--primary)'
          e.currentTarget.style.color = '#060913'
          e.currentTarget.style.boxShadow = '0 0 10px var(--primary-glow)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--primary)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        title="Add another meter"
      >
        <Plus size={16} />
        <span className="add-meter-text">Add Meter</span>
      </button>

      {/* Meter Add Modal */}
      <AddMeterModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={(newId) => {
          setIsAddOpen(false)
          router.push(`${pathname}?meterId=${newId}`)
        }}
      />
    </div>
  )
}
