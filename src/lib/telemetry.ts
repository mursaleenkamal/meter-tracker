/**
 * Lightweight Conversion & Monetization Telemetry
 * Captures UTM campaign parameters and tracks conversion intent events safely.
 */

export interface ConversionEvent {
  eventName: string
  timestamp: string
  url: string
  utmParams: Record<string, string>
  metadata?: Record<string, any>
}

export function getStoredUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = sessionStorage.getItem('rm_utm_params')
    if (stored) return JSON.parse(stored)
  } catch {
    // Ignore storage errors
  }
  return {}
}

export function captureUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    for (const [key, val] of params.entries()) {
      if (key.startsWith('utm_') || key === 'ref' || key === 'campaign') {
        utm[key] = val
      }
    }
    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem('rm_utm_params', JSON.stringify(utm))
      return utm
    }
    return getStoredUtmParams()
  } catch {
    return {}
  }
}

export function trackConversionEvent(
  eventName: string,
  metadata?: Record<string, any>
): void {
  if (typeof window === 'undefined') return
  try {
    const utm = captureUtmParams()
    const payload: ConversionEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      utmParams: utm,
      metadata,
    }

    // Persist to localStorage for client-side funnel auditing
    const existingRaw = localStorage.getItem('rm_conversion_events')
    const events: ConversionEvent[] = existingRaw ? JSON.parse(existingRaw) : []
    events.push(payload)
    // Keep last 50 events to prevent local overflow
    localStorage.setItem('rm_conversion_events', JSON.stringify(events.slice(-50)))

    // Non-blocking console reporting in development or test
    if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
      console.log('[Telemetry:Conversion]', payload)
    }
  } catch (err) {
    console.warn('[Telemetry:Error]', err)
  }
}
