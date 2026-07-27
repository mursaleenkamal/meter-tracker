'use client'

import { useEffect, useState } from 'react'
import ElectricLoader from './ElectricLoader'

export default function AppPreloader() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isFading, setIsFading] = useState<boolean>(false)

  useEffect(() => {
    // Show smooth initial splash screen on first app launch or refresh
    const timer = setTimeout(() => {
      setIsFading(true)
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 500)
      return () => clearTimeout(hideTimer)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: '#060913',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      <ElectricLoader fullScreen message="Initializing Meter Tracking Systems..." />
    </div>
  )
}
