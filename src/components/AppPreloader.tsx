'use client'

import { useEffect, useState } from 'react'
import ElectricLoader from './ElectricLoader'

export default function AppPreloader() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isFading, setIsFading] = useState<boolean>(false)

  useEffect(() => {
    // Only show preloader on first session launch to prevent page load delays
    if (typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem('vt_preloader_shown')
      if (hasShown) {
        setIsVisible(false)
        return
      }

      setIsVisible(true)
      sessionStorage.setItem('vt_preloader_shown', 'true')

      const timer = setTimeout(() => {
        setIsFading(true)
        const hideTimer = setTimeout(() => {
          setIsVisible(false)
        }, 300)
        return () => clearTimeout(hideTimer)
      }, 300)

      return () => clearTimeout(timer)
    }
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
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      <ElectricLoader fullScreen message="Loading VoltTrack..." />
    </div>
  )
}
