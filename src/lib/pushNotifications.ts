'use client'

export interface Meter {
  id: string
  meter_number: string
  billing_cycle_start_day: number
  max_usage_limit: string | number
}

export interface Reading {
  id: string
  reading_value: number
  created_at: string
}

// Register service worker if supported
export async function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      return registration
    } catch (err) {
      console.warn('Service Worker registration failed:', err)
    }
  }
  return null
}

// Request browser notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    await registerServiceWorker()
    return 'granted'
  }

  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    await registerServiceWorker()
  }

  return permission
}

// Send a web push notification via Service Worker or Notification API
export async function sendWebNotification(title: string, body: string, url: string = '/dashboard') {
  if (typeof window === 'undefined' || !('Notification' in window)) return

  if (Notification.permission !== 'granted') return

  const reg = await registerServiceWorker()

  if (reg && reg.showNotification) {
    reg.showNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: { url },
      tag: 'volttrack-reminder',
    })
  } else {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      data: { url },
    })
  }
}

// Helper: Calculate days between dates
function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Helper: Calculate days remaining until billing cycle start day
function getDaysUntilBillingCycle(startDay: number): number {
  const now = new Date()
  const currentDay = now.getDate()

  if (currentDay === startDay) return 0

  if (currentDay < startDay) {
    return startDay - currentDay
  }

  // Next month's billing date
  const year = now.getFullYear()
  const month = now.getMonth()
  const nextMonthDate = new Date(year, month + 1, startDay)
  return getDaysDifference(now, nextMonthDate)
}

// Check reading freshness and send reminders
export function checkMeterReadingReminders(activeMeter: Meter, readings: Reading[]) {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return

  const lastCheckedKey = `vt_last_reminder_${activeMeter.id}`
  const lastCheckedDate = localStorage.getItem(lastCheckedKey)
  const todayStr = new Date().toISOString().split('T')[0]

  // Don't spam notifications more than once per day
  if (lastCheckedDate === todayStr) return

  const now = new Date()
  const latestReading = readings && readings.length > 0 ? readings[0] : null

  let inactivityTriggered = false
  let billingTriggered = false

  // 1. Inactivity Alert (if latest reading > 3 days ago or no readings)
  if (latestReading) {
    const readingDate = new Date(latestReading.created_at)
    const daysSinceReading = getDaysDifference(readingDate, now)

    if (daysSinceReading >= 3) {
      sendWebNotification(
        '⚡ VoltTrack Reading Reminder',
        `No meter reading recorded in ${daysSinceReading} days for Meter ${activeMeter.meter_number}. Update your reading to keep tracking accurate!`,
        '/dashboard'
      )
      inactivityTriggered = true
    }
  } else {
    sendWebNotification(
      '⚡ Welcome to VoltTrack!',
      `You haven't recorded any readings for Meter ${activeMeter.meter_number} yet. Record your first reading now!`,
      '/dashboard'
    )
    inactivityTriggered = true
  }

  // 2. Billing Cycle Proximity Alert (if within 3 days of cycle restart)
  if (!inactivityTriggered) {
    const daysUntilCycle = getDaysUntilBillingCycle(activeMeter.billing_cycle_start_day)

    if (daysUntilCycle <= 3 && daysUntilCycle >= 0) {
      const msg =
        daysUntilCycle === 0
          ? `Your billing cycle restarts TODAY for Meter ${activeMeter.meter_number}! Record a cycle end reading.`
          : `Your billing cycle restarts in ${daysUntilCycle} day${daysUntilCycle > 1 ? 's' : ''} for Meter ${activeMeter.meter_number}. Record your final reading!`

      sendWebNotification('⚡ Billing Cycle Alert', msg, '/dashboard')
      billingTriggered = true
    }
  }

  if (inactivityTriggered || billingTriggered) {
    localStorage.setItem(lastCheckedKey, todayStr)
  }
}
