'use client'

import { addReadingAction } from '@/lib/actions'

export interface OfflineReading {
  tempId: string
  meterId: string
  readingValue: number
  notes?: string
  isBillingReset: boolean
  imageDataUrl?: string | null
  imageFileName?: string
  imageFileType?: string
  createdAt: string
}

const STORAGE_KEY = 'volt_track_offline_readings'

export function getOfflineReadings(): OfflineReading[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as OfflineReading[]
  } catch (err) {
    console.error('Error reading offline meter entries from storage:', err)
    return []
  }
}

export function saveOfflineReading(
  readingData: Omit<OfflineReading, 'tempId' | 'createdAt'>
): OfflineReading {
  const readings = getOfflineReadings()
  const newEntry: OfflineReading = {
    ...readingData,
    tempId: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  }

  readings.unshift(newEntry)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readings))
      // Dispatch custom event so UI components can re-render immediately
      window.dispatchEvent(new Event('offline-readings-changed'))
    } catch (err) {
      console.error('Failed to save offline reading to localStorage:', err)
    }
  }
  return newEntry
}

export function removeOfflineReading(tempId: string): void {
  if (typeof window === 'undefined') return
  const readings = getOfflineReadings().filter((r) => r.tempId !== tempId)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings))
    window.dispatchEvent(new Event('offline-readings-changed'))
  } catch (err) {
    console.error('Failed to remove offline reading:', err)
  }
}

export function clearOfflineReadings(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('offline-readings-changed'))
  } catch (err) {
    console.error('Failed to clear offline readings:', err)
  }
}

// Convert base64 Data URL to a File object for FormData upload
function dataURLtoFile(dataurl: string, filename: string, mimeType: string): File {
  const arr = dataurl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeType || (mimeMatch ? mimeMatch[1] : 'image/jpeg')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export async function syncOfflineReadings(): Promise<{
  successCount: number
  failCount: number
  errors: string[]
}> {
  const readings = getOfflineReadings()
  if (readings.length === 0) {
    return { successCount: 0, failCount: 0, errors: [] }
  }

  let successCount = 0
  let failCount = 0
  const errors: string[] = []

  // Sync oldest first so chronological sequence is preserved
  const sortedReadings = [...readings].reverse()

  for (const item of sortedReadings) {
    try {
      const formData = new FormData()
      formData.append('meterId', item.meterId)
      formData.append('readingValue', item.readingValue.toString())
      formData.append('notes', item.notes || 'Logged Offline & Synced')
      formData.append('isBillingReset', String(item.isBillingReset))

      if (item.imageDataUrl) {
        const fileName = item.imageFileName || `offline_${Date.now()}.jpg`
        const fileType = item.imageFileType || 'image/jpeg'
        const file = dataURLtoFile(item.imageDataUrl, fileName, fileType)
        formData.append('image', file)
      }

      const res = await addReadingAction(formData)

      if (res?.error) {
        failCount++
        errors.push(`Reading ${item.readingValue} units: ${res.error}`)
      } else {
        successCount++
        removeOfflineReading(item.tempId)
      }
    } catch (err: any) {
      failCount++
      errors.push(`Reading ${item.readingValue} units: ${err?.message || 'Network sync error'}`)
    }
  }

  return { successCount, failCount, errors }
}
