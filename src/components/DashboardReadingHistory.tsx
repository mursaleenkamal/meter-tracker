'use client'

import { useState, useMemo } from 'react'
import styles from '../app/dashboard.module.css'
import MonthlyHistoryCard from './MonthlyHistoryCard'
import ShareWhatsAppBtn from './ShareWhatsAppBtn'
import DeleteReadingBtn from './DeleteReadingBtn'
import { FileText, Filter, RotateCcw } from 'lucide-react'
import { ReadingRecord } from '@/utils/monthlyConsumption'

interface DashboardReadingHistoryProps {
  readings: ReadingRecord[]
  meterNumber: string
  maxLimit: number
  billingCycleStartDay: number
}

export default function DashboardReadingHistory({
  readings,
  meterNumber,
  maxLimit,
  billingCycleStartDay,
}: DashboardReadingHistoryProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null)

  // Filter readings based on selected month key if active
  const filteredReadings = useMemo(() => {
    if (!readings || readings.length === 0) return []
    if (!selectedMonthKey) return readings

    return readings.filter((r) => {
      const d = new Date(r.created_at)
      let groupYear = d.getFullYear()
      let groupMonth = d.getMonth()

      if (billingCycleStartDay > 1 && d.getDate() < billingCycleStartDay) {
        groupMonth -= 1
        if (groupMonth < 0) {
          groupMonth = 11
          groupYear -= 1
        }
      }

      const key = `${groupYear}-${String(groupMonth + 1).padStart(2, '0')}`
      return key === selectedMonthKey
    })
  }, [readings, selectedMonthKey, billingCycleStartDay])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Monthly Consumption History Section */}
      <MonthlyHistoryCard
        readings={readings}
        meterNumber={meterNumber}
        maxLimit={maxLimit}
        billingCycleStartDay={billingCycleStartDay}
        selectedMonthKey={selectedMonthKey}
        onSelectMonthKey={setSelectedMonthKey}
      />

      {/* Reading History Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <FileText size={18} /> Reading Logs
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {selectedMonthKey && (
              <button
                type="button"
                className={styles.monthPill}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                onClick={() => setSelectedMonthKey(null)}
              >
                <RotateCcw size={12} style={{ marginRight: '0.2rem' }} /> Clear Month Filter
              </button>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {filteredReadings.length} of {readings?.length || 0} logs
            </span>
          </div>
        </div>

        {!filteredReadings || filteredReadings.length === 0 ? (
          <div className={styles.noReadings}>
            {selectedMonthKey
              ? 'No readings logged for the selected month filter.'
              : 'No readings recorded yet. Click "Add New Reading" to begin tracking!'}
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Reading (Units)</th>
                  <th>Consumption (Diff)</th>
                  <th>Date logged</th>
                  <th className={styles.actionCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.map((reading, index) => {
                  // Find original index in full sorted readings array to get true previous increment
                  const origIndex = readings.findIndex((r) => r.id === reading.id)
                  const nextOldest = origIndex !== -1 ? readings[origIndex + 1] : null
                  const increment = nextOldest
                    ? Number(reading.reading_value) - Number(nextOldest.reading_value)
                    : null

                  return (
                    <tr key={reading.id}>
                      <td>
                        <div className={styles.valueCell}>
                          {Number(reading.reading_value).toFixed(0)}
                        </div>
                      </td>
                      <td>
                        {reading.is_billing_reset ? (
                          <span
                            className={styles.incrementBadge}
                            style={{
                              background: 'rgba(16, 185, 129, 0.08)',
                              color: 'var(--success)',
                              borderColor: 'rgba(16, 185, 129, 0.2)',
                              display: 'inline-block',
                            }}
                          >
                            Billing Reset (Baseline)
                          </span>
                        ) : increment !== null && increment >= 0 ? (
                          <span
                            className={styles.incrementBadge}
                            style={{ display: 'inline-block' }}
                          >
                            +{increment.toFixed(0)} Units
                          </span>
                        ) : origIndex === readings.length - 1 ? (
                          <span
                            className={styles.incrementBadge}
                            style={{
                              background: 'rgba(0, 240, 255, 0.08)',
                              color: 'var(--primary)',
                              borderColor: 'var(--primary-glow)',
                              display: 'inline-block',
                            }}
                          >
                            Initial Baseline
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td className={styles.dateCell}>
                        <div>{new Date(reading.created_at).toLocaleDateString()}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '0.2rem',
                          }}
                        >
                          {new Date(reading.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className={styles.actionCell}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                        >
                          <ShareWhatsAppBtn
                            type="reading"
                            meterNumber={meterNumber}
                            value={Number(reading.reading_value)}
                            date={new Date(reading.created_at).toLocaleString()}
                            increment={increment}
                            notes={reading.notes || null}
                          />
                          <DeleteReadingBtn readingId={reading.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
