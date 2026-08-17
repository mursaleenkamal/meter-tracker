'use client'

import styles from '../app/dashboard.module.css'
import ShareWhatsAppBtn from './ShareWhatsAppBtn'
import DeleteReadingBtn from './DeleteReadingBtn'
import { FileText } from 'lucide-react'
import { ReadingRecord } from '@/utils/monthlyConsumption'

interface DashboardReadingHistoryProps {
  readings: ReadingRecord[]
  meterNumber: string
  maxLimit?: number
  billingCycleStartDay?: number
}

export default function DashboardReadingHistory({
  readings,
  meterNumber,
}: DashboardReadingHistoryProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Reading History Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <FileText size={18} /> Reading Logs
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {readings?.length || 0} logs
          </span>
        </div>

        {!readings || readings.length === 0 ? (
          <div className={styles.noReadings}>
            No readings recorded yet. Click "Add New Reading" to begin tracking!
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
                {readings.map((reading, index) => {
                  // Find original index in full sorted readings array to get true previous increment
                  const nextOldest = readings[index + 1]
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
                        ) : index === readings.length - 1 ? (
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
