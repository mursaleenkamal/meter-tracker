'use client'

import { useEffect } from 'react'
import { checkMeterReadingReminders, type Meter, type Reading } from '@/lib/pushNotifications'

interface PushReminderCheckerProps {
  activeMeter: Meter
  readings: Reading[]
}

export default function PushReminderChecker({ activeMeter, readings }: PushReminderCheckerProps) {
  useEffect(() => {
    checkMeterReadingReminders(activeMeter, readings)
  }, [activeMeter, readings])

  return null
}
