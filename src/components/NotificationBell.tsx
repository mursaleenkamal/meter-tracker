'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing, Check, X, Zap, Loader2 } from 'lucide-react'
import {
  requestNotificationPermission,
  sendWebNotification,
  registerServiceWorker,
} from '@/lib/pushNotifications'

export default function NotificationBell() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [isOpen, setIsOpen] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
      if (Notification.permission === 'granted') {
        registerServiceWorker()
      }
    } else {
      setPermission('unsupported')
    }
  }, [])

  const handleEnable = async () => {
    const perm = await requestNotificationPermission()
    setPermission(perm)
    if (perm === 'granted') {
      sendWebNotification(
        '⚡ Push Alerts Activated!',
        'VoltTrack will now notify you when your meter reading is due or when you have not taken a reading for 3+ days.',
        '/dashboard'
      )
    }
  }

  const handleTestNotification = async () => {
    setIsTesting(true)
    await sendWebNotification(
      '⚡ Test Alert - VoltTrack',
      'Push notification test successful! Inactivity and billing cycle reminders will appear here.',
      '/dashboard'
    )
    setTimeout(() => setIsTesting(false), 1000)
  }

  const isGranted = permission === 'granted'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isGranted ? 'rgba(0, 240, 255, 0.1)' : 'var(--card-bg)',
          backdropFilter: 'var(--glass-filter)',
          border: `1px solid ${isGranted ? 'var(--primary)' : 'var(--border-color)'}`,
          borderRadius: '8px',
          padding: '10px',
          color: isGranted ? 'var(--primary)' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          boxShadow: isGranted ? '0 0 10px var(--primary-glow)' : 'none',
        }}
        className="hover-glow"
        title={isGranted ? 'Push Notifications Enabled' : 'Enable Reading Push Reminders'}
        aria-label="Push Notifications"
      >
        {isGranted ? <BellRing size={18} fill="var(--primary)" /> : <Bell size={18} />}
      </button>

      {isOpen && (
        <>
          {/* Overlay to close popover */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '310px',
              background: '#0d1527',
              border: '1px solid var(--border-color-active)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg), 0 0 20px var(--primary-glow)',
              zIndex: 10000,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            className="fade-in"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                <Zap size={18} style={{ color: 'var(--primary)' }} fill="var(--primary)" />
                <span>Reading Push Alerts</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Get automated Web Push Notifications when your reading is due or when you haven't taken a reading for 3+ days.
            </p>

            <div style={{ background: 'rgba(6, 9, 19, 0.6)', borderRadius: '8px', padding: '10px 12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Status</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isGranted ? 'var(--primary)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {isGranted ? (
                  <>
                    <Check size={16} /> Enabled & Active
                  </>
                ) : (
                  'Push Reminders Disabled'
                )}
              </div>
            </div>

            {isGranted ? (
              <button
                onClick={handleTestNotification}
                disabled={isTesting}
                className="glow-btn"
                style={{ width: '100%', fontSize: '0.85rem', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Sending Test Alert...
                  </>
                ) : (
                  'Send Test Notification'
                )}
              </button>
            ) : (
              <button
                onClick={handleEnable}
                className="glow-btn-solid"
                style={{ width: '100%', fontSize: '0.88rem', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <BellRing size={16} />
                Enable Push Alerts
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
