export interface ReadingRecord {
  id: string
  meter_id: string
  reading_value: number | string
  notes?: string | null
  image_url?: string | null
  calculated_daily_units?: number | null
  is_billing_reset?: boolean
  created_at: string
}

export interface MonthlyConsumptionRecord {
  monthKey: string // e.g. "2026-08"
  monthLabel: string // e.g. "August 2026"
  shortLabel: string // e.g. "Aug 2026"
  year: number
  month: number // 0-11
  startDate: Date
  endDate: Date
  startReading: number
  endReading: number
  totalUnits: number
  dailyAverage: number
  readingCount: number
  isCurrentMonth: boolean
  isProtectedSlab: boolean // totalUnits < 200
  exceededLimit: boolean
  maxLimit: number
  momChangePct: number | null // Month over Month % change
  readings: ReadingRecord[]
}

/**
 * Calculates monthly consumption metrics from historical meter readings.
 * Groups readings chronologically by month or billing cycle.
 */
export function calculateMonthlyConsumptionHistory(
  readings: ReadingRecord[],
  maxLimit: number = 400,
  billingCycleStartDay: number = 1
): MonthlyConsumptionRecord[] {
  if (!readings || readings.length === 0) {
    return []
  }

  // 1. Sort readings chronologically (ascending: oldest first)
  const sorted = [...readings].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // Map to group readings by month key "YYYY-MM" based on reading date
  const groups: Map<string, ReadingRecord[]> = new Map()

  sorted.forEach((reading) => {
    const d = new Date(reading.created_at)
    // If billingCycleStartDay > 1 and date < billingCycleStartDay, reading belongs to previous month's cycle
    let groupYear = d.getFullYear()
    let groupMonth = d.getMonth()

    if (billingCycleStartDay > 1 && d.getDate() < billingCycleStartDay) {
      groupMonth -= 1
      if (groupMonth < 0) {
        groupMonth = 11
        groupYear -= 1
      }
    }

    const monthKey = `${groupYear}-${String(groupMonth + 1).padStart(2, '0')}`
    if (!groups.has(monthKey)) {
      groups.set(monthKey, [])
    }
    groups.get(monthKey)!.push(reading)
  })

  const now = new Date()
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const monthKeys = Array.from(groups.keys()).sort() // Oldest month to newest month
  const results: MonthlyConsumptionRecord[] = []

  let prevMonthUnits: number | null = null
  let previousCycleLastReading: number | null = null

  monthKeys.forEach((key) => {
    const monthReadings = groups.get(key)!
    const [yearStr, monthStr] = key.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1 // 0-indexed

    const periodDate = new Date(year, month, billingCycleStartDay)
    const monthLabel = periodDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    const shortLabel = periodDate.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })

    const firstInMonth = monthReadings[0]
    const lastInMonth = monthReadings[monthReadings.length - 1]

    // Check if there is a baseline reading in this month (is_billing_reset = true)
    const baselineInMonth = monthReadings.find((r) => r.is_billing_reset)

    let startReading = Number(firstInMonth.reading_value)
    if (baselineInMonth) {
      startReading = Number(baselineInMonth.reading_value)
    } else if (previousCycleLastReading !== null) {
      // Use the last reading from the previous cycle as starting baseline if available
      startReading = previousCycleLastReading
    }

    const endReading = Number(lastInMonth.reading_value)
    let totalUnits = Math.max(endReading - startReading, 0)

    // Calculate duration in days for daily average
    const startDate = new Date(firstInMonth.created_at)
    const endDate = new Date(lastInMonth.created_at)
    
    // If only 1 reading in month or start === end date
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const elapsedDays = Math.max(diffTime / (1000 * 60 * 60 * 24), 1)
    const dailyAverage = totalUnits > 0 ? totalUnits / elapsedDays : 0

    const isCurrentMonth = key === currentMonthKey || (endDate.getMonth() === now.getMonth() && endDate.getFullYear() === now.getFullYear())
    const isProtectedSlab = totalUnits < 200
    const exceededLimit = totalUnits > maxLimit

    let momChangePct: number | null = null
    if (prevMonthUnits !== null && prevMonthUnits > 0) {
      momChangePct = ((totalUnits - prevMonthUnits) / prevMonthUnits) * 100
    }

    results.push({
      monthKey: key,
      monthLabel,
      shortLabel,
      year,
      month,
      startDate,
      endDate,
      startReading,
      endReading,
      totalUnits,
      dailyAverage,
      readingCount: monthReadings.length,
      isCurrentMonth,
      isProtectedSlab,
      exceededLimit,
      maxLimit,
      momChangePct,
      readings: [...monthReadings].reverse(), // descending for table log view
    })

    prevMonthUnits = totalUnits
    previousCycleLastReading = endReading
  })

  // Return sorted descending (newest month first) for display
  return results.reverse()
}
