'use client'

export interface GuestMeter {
  id: string
  meter_number: string
  max_usage_limit: number
  billing_cycle_start_day: number
  next_reading_date?: string
}

export interface GuestReading {
  id: string
  meter_id: string
  reading_value: number
  is_billing_reset: boolean
  notes?: string
  created_at: string
}

export interface GuestState {
  meter: GuestMeter
  readings: GuestReading[]
}

const GUEST_STORAGE_KEY = 'read_meter_guest_state'

export const DEFAULT_GUEST_METER: GuestMeter = {
  id: 'guest_meter_default',
  meter_number: 'Guest Meter (Local)',
  max_usage_limit: 200,
  billing_cycle_start_day: 1,
}

export function getGuestState(): GuestState {
  if (typeof window === 'undefined') {
    return {
      meter: DEFAULT_GUEST_METER,
      readings: [],
    }
  }

  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY)
    if (!raw) {
      const initialState: GuestState = {
        meter: DEFAULT_GUEST_METER,
        readings: [],
      }
      return initialState
    }
    const parsed = JSON.parse(raw)
    return {
      meter: parsed.meter || DEFAULT_GUEST_METER,
      readings: Array.isArray(parsed.readings) ? parsed.readings : [],
    }
  } catch (err) {
    console.error('Error reading guest state:', err)
    return {
      meter: DEFAULT_GUEST_METER,
      readings: [],
    }
  }
}

export function saveGuestState(state: GuestState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event('guest-state-changed'))
  } catch (err) {
    console.error('Failed to save guest state to localStorage:', err)
  }
}

export function addGuestReading(data: {
  reading_value: number
  is_billing_reset?: boolean
  notes?: string
  created_at?: string
}): GuestReading {
  const state = getGuestState()
  const newReading: GuestReading = {
    id: `guest_reading_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    meter_id: state.meter.id,
    reading_value: data.reading_value,
    is_billing_reset: !!data.is_billing_reset,
    notes: data.notes || 'Guest reading',
    created_at: data.created_at || new Date().toISOString(),
  }

  // Prepend so latest reading is first
  state.readings.unshift(newReading)
  saveGuestState(state)
  return newReading
}

export function deleteGuestReading(id: string): void {
  const state = getGuestState()
  state.readings = state.readings.filter((r) => r.id !== id)
  saveGuestState(state)
}

export function updateGuestMeter(updates: Partial<GuestMeter>): GuestMeter {
  const state = getGuestState()
  state.meter = {
    ...state.meter,
    ...updates,
  }
  saveGuestState(state)
  return state.meter
}

export function clearGuestState(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY)
    window.dispatchEvent(new Event('guest-state-changed'))
  } catch (err) {
    console.error('Failed to clear guest state:', err)
  }
}

export function hasGuestReadings(): boolean {
  if (typeof window === 'undefined') return false
  const state = getGuestState()
  return state.readings.length > 0
}
