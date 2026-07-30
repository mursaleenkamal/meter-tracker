'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing, Check, X, Zap, Loader2, AlertTriangle, Info } from 'lucide-react'
import {
  requestNotificationPermission,
  sendWebNotification,
  registerServiceWorker,
} from '@/lib/pushNotifications'

export default function NotificationBell() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [isOpen, setIsOpen] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleEnable = async () => {
    const perm = await requestNotificationPermission()
    setPermission(perm)
    if (perm === 'granted') {
      const sent = await sendWebNotification(
        '⚡ Push Alerts Activated!',
        'VoltTrack will now notify you when your meter reading is due or when you have not taken a reading for 3+ days.',
        '/dashboard'
      )
      triggerToast(sent ? '⚡ Push Alerts Enabled & Test Notification Sent!' : '⚡ Push Alerts Enabled!')
    } else if (perm === 'denied') {
      triggerToast('⚠️ Notifications are blocked in your browser settings. Please allow notifications for this site.')
    }
  }

  const handleTestNotification = async () => {
    setIsTesting(true)

    // Check if permission is default or denied
    if (Notification.permission !== 'granted') {
      const perm = await requestNotificationPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        setIsTesting(false)
        triggerToast('⚠️ Please allow Notification permissions in your browser bar.')
        return
      }
    }

    const success = await sendWebNotification(
      '⚡ VoltTrack Test Notification',
      'Push alert working perfectly! You will receive reading reminders here.',
      '/dashboard'
    )

    setIsTesting(false)

    if (success) {
      triggerToast('🔔 Push Notification sent! (Check your desktop system tray / screen)')
    } else {
      triggerToast('⚡ Test Alert Triggered (Check browser notification settings)')
    }
  }

  const isGranted = permission === 'granted'
  const isDenied = permission === 'denied'

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast Notification Banner Popup */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 99999,
            background: 'rgba(10, 15, 29, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--primary)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px var(--primary-glow)',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            maxWidth: '360px',
          }}
          className="fade-in"
        >
          <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isGranted ? 'rgba(0, 240, 255, 0.1)' : 'var(--card-bg)',
          backdropFilter: 'var(--glass-filter)',
          border: `1px solid ${isGranted ? 'var(--primary)' : isDenied ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
          borderRadius: '8px',
          padding: '10px',
          color: isGranted ? 'var(--primary)' : isDenied ? '#fca5a5' : 'var(--text-secondary)',
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

      {/* Dropdown Menu */}
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
              width: '320px',
              background: '#0d1527',
              border: '1px solid var(--border-color-active)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-lg), 0 0 25px var(--primary-glow)',
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
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isGranted ? 'var(--primary)' : isDenied ? '#fca5a5' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {isGranted ? (
                  <>
                    <Check size={16} /> Enabled & Active
                  </>
                ) : isDenied ? (
                  <>
                    <AlertTriangle size={16} /> Blocked in Browser
                  </>
                ) : (
                  'Push Reminders Disabled'
                )}
              </div>
            </div>

            {isDenied && (
              <p style={{ fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.35, background: 'rgba(239, 68, 68, 0.08)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                Notifications are blocked. Click the lock/settings icon in your browser URL address bar to change Notification permission to <strong>Allow</strong>.
              </p>
            )}

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
                  <>
                    <BellRing size={16} /> Send Test Notification
                  </>
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
