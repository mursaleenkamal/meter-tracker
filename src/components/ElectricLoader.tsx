'use client'

import { Zap } from 'lucide-react'

interface ElectricLoaderProps {
  message?: string
  fullScreen?: boolean
  showBrand?: boolean
}

export default function ElectricLoader({
  message = 'Loading VoltTrack...',
  fullScreen = false,
  showBrand = true,
}: ElectricLoaderProps) {
  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#060913',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0d1b38 0%, #060913 85%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }

  return (
    <div style={containerStyle} className="fade-in">
      {/* Outer Glowing HUD Container */}
      <div
        style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Clockwise Outer Ring */}
        <svg
          className="electric-spin-cw"
          width="130"
          height="130"
          viewBox="0 0 130 130"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx="65"
            cy="65"
            r="58"
            fill="none"
            stroke="rgba(0, 240, 255, 0.12)"
            strokeWidth="2"
          />
          <circle
            cx="65"
            cy="65"
            r="58"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray="80 180"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px var(--primary))' }}
          />
        </svg>

        {/* Counter-Clockwise Inner Accent Ring */}
        <svg
          className="electric-spin-ccw"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          style={{ position: 'absolute', top: 15, left: 15 }}
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(139, 92, 246, 0.15)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeDasharray="60 140"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px var(--accent))' }}
          />
        </svg>

        {/* Pulsing Central Energy Zap Icon */}
        <div
          className="electric-pulse-bolt"
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.25), inset 0 0 15px rgba(0, 240, 255, 0.15)',
          }}
        >
          <Zap size={28} fill="var(--primary)" color="var(--primary)" />
        </div>
      </div>

      {/* Brand & Loading Label */}
      <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
        {showBrand && (
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.05em',
              marginBottom: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
            }}
          >
            Volt<span style={{ color: 'var(--primary)' }}>Track</span>
          </div>
        )}

        <div
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {message}
        </div>

        {/* Shimmering Progress Bar Indicator */}
        <div
          style={{
            width: '160px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            margin: '0.8rem auto 0 auto',
            overflow: 'hidden',
          }}
        >
          <div
            className="electric-shimmer-bar"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>
    </div>
  )
}
