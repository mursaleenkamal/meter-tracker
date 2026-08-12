'use client'

import { useState } from 'react'
import styles from '../app/dashboard.module.css'
import {
  calculateMonthlyConsumptionHistory,
  MonthlyConsumptionRecord,
  ReadingRecord,
} from '@/utils/monthlyConsumption'
import ShareWhatsAppBtn from './ShareWhatsAppBtn'
import {
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Filter,
} from 'lucide-react'

interface MonthlyHistoryCardProps {
  readings: ReadingRecord[]
  meterNumber: string
  maxLimit?: number
  billingCycleStartDay?: number
  selectedMonthKey?: string | null
  onSelectMonthKey?: (monthKey: string | null) => void
}

export default function MonthlyHistoryCard({
  readings,
  meterNumber,
  maxLimit = 400,
  billingCycleStartDay = 1,
  selectedMonthKey,
  onSelectMonthKey,
}: MonthlyHistoryCardProps) {
  const monthlyRecords = calculateMonthlyConsumptionHistory(
    readings,
    maxLimit,
    billingCycleStartDay
  )

  const [activeTab, setActiveTab] = useState<'chart' | 'list'>('chart')

  if (!monthlyRecords || monthlyRecords.length === 0) {
    return null
  }

  // Determine max consumption for scaling bar chart (min ceiling 250)
  const maxUnitsInChart = Math.max(
    ...monthlyRecords.map((r) => r.totalUnits),
    250
  )

  // Chart records displayed chronologically (oldest to newest left to right)
  const chartRecords = [...monthlyRecords].reverse().slice(-6)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <Calendar size={18} /> Monthly Consumption History
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {monthlyRecords.length} Month{monthlyRecords.length > 1 ? 's' : ''} Tracked
        </span>
      </div>

      {/* Filter Tabs / Pills */}
      <div className={styles.monthFilterRow}>
        <button
          type="button"
          className={`${styles.monthPill} ${
            !selectedMonthKey ? styles.monthPillActive : ''
          }`}
          onClick={() => onSelectMonthKey && onSelectMonthKey(null)}
        >
          All Months
        </button>
        {monthlyRecords.map((m) => (
          <button
            key={m.monthKey}
            type="button"
            className={`${styles.monthPill} ${
              selectedMonthKey === m.monthKey ? styles.monthPillActive : ''
            }`}
            onClick={() => onSelectMonthKey && onSelectMonthKey(m.monthKey)}
          >
            {m.shortLabel} {m.isCurrentMonth ? '(Active)' : ''}
          </button>
        ))}
      </div>

      {/* Visual Bar Chart */}
      <div className={styles.monthlyBarChartContainer}>
        <div className={styles.monthlyBarChartHeader}>
          <div className={styles.monthlyBarChartTitle}>
            <BarChart3 size={16} /> Month-over-Month Unit Usage
          </div>
          <div className={styles.thresholdLegend}>
            <span>
              <span
                className={styles.legendDot}
                style={{ background: '#10b981' }}
              />
              Protected (&lt; 200U)
            </span>
            <span>
              <span
                className={styles.legendDot}
                style={{ background: '#ef4444' }}
              />
              Unprotected (&ge; 200U)
            </span>
          </div>
        </div>

        <div className={styles.monthlyBarGrid}>
          {chartRecords.map((rec) => {
            const heightPct = Math.min(
              (rec.totalUnits / maxUnitsInChart) * 100,
              100
            )
            const isProtected = rec.isProtectedSlab

            return (
              <div key={rec.monthKey} className={styles.barCol}>
                <div className={styles.barWrapper}>
                  <span className={styles.barValueTag}>
                    {rec.totalUnits.toFixed(0)}U
                  </span>
                  <div
                    className={`${styles.barFill} ${
                      isProtected
                        ? styles.barFillProtected
                        : styles.barFillUnprotected
                    } ${rec.isCurrentMonth ? styles.barFillCurrent : ''}`}
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                  />
                </div>
                <span className={styles.barMonthTag}>
                  {rec.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Breakdown List */}
      <div className={styles.monthlyList}>
        {monthlyRecords.map((rec) => {
          const isSelected = selectedMonthKey === rec.monthKey
          const slabText = rec.isProtectedSlab
            ? 'PROTECTED (Subsidized)'
            : 'UNPROTECTED SLAB'

          return (
            <div
              key={rec.monthKey}
              className={styles.monthlyCard}
              style={{
                borderColor: isSelected ? 'var(--primary)' : undefined,
                boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : undefined,
              }}
            >
              <div className={styles.monthlyCardHeader}>
                <div className={styles.monthlyCardTitleGroup}>
                  <span className={styles.monthlyCardMonth}>{rec.monthLabel}</span>
                  {rec.isCurrentMonth && (
                    <span
                      className={`${styles.monthlyCardBadge} ${styles.monthlyCardBadgeCurrent}`}
                    >
                      Active Cycle
                    </span>
                  )}
                  <span
                    className={`${styles.monthlyCardBadge} ${
                      rec.isProtectedSlab
                        ? styles.monthlyCardBadgeProtected
                        : styles.monthlyCardBadgeUnprotected
                    }`}
                  >
                    {rec.isProtectedSlab ? 'Protected (< 200U)' : 'Unprotected (≥ 200U)'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {rec.momChangePct !== null && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        color:
                          rec.momChangePct <= 0
                            ? 'var(--success)'
                            : 'var(--error)',
                      }}
                      title="Month over Month Consumption Change"
                    >
                      {rec.momChangePct <= 0 ? (
                        <>
                          <TrendingDown size={14} /> {Math.abs(rec.momChangePct).toFixed(0)}% vs last mo
                        </>
                      ) : (
                        <>
                          <TrendingUp size={14} /> +{rec.momChangePct.toFixed(0)}% vs last mo
                        </>
                      )}
                    </div>
                  )}

                  <ShareWhatsAppBtn
                    type="monthly"
                    meterNumber={meterNumber}
                    monthLabel={rec.monthLabel}
                    totalUnits={rec.totalUnits}
                    dailyAverage={rec.dailyAverage}
                    startReading={rec.startReading}
                    endReading={rec.endReading}
                    slabStatus={slabText}
                    readingCount={rec.readingCount}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className={styles.monthlyMetricsGrid}>
                <div className={styles.monthlyMetricItem}>
                  <span className={styles.monthlyMetricLabel}>Total Consumed</span>
                  <span className={styles.monthlyMetricVal}>
                    {rec.totalUnits.toFixed(0)}{' '}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Units
                    </span>
                  </span>
                </div>

                <div className={styles.monthlyMetricItem}>
                  <span className={styles.monthlyMetricLabel}>Daily Average</span>
                  <span className={styles.monthlyMetricVal}>
                    {rec.dailyAverage.toFixed(1)}{' '}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      U/day
                    </span>
                  </span>
                </div>

                <div className={styles.monthlyMetricItem}>
                  <span className={styles.monthlyMetricLabel}>Dial Range</span>
                  <span className={styles.monthlyMetricVal} style={{ fontSize: '0.95rem' }}>
                    {rec.startReading.toFixed(0)} ➔ {rec.endReading.toFixed(0)}
                  </span>
                </div>

                <div className={styles.monthlyMetricItem}>
                  <span className={styles.monthlyMetricLabel}>Logged Records</span>
                  <span className={styles.monthlyMetricVal}>
                    {rec.readingCount}{' '}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      logs
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
