'use client'

import { Zap } from 'lucide-react'

interface ElectricLoaderProps {
  message?: string
  fullScreen?: boolean
  showBrand?: boolean
}

export default function ElectricLoader({
  message = 'Loading Read Meter...',
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
        background: '#f8fafc',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f1f5f9 85%)',
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
            stroke="rgba(37, 99, 235, 0.12)"
            strokeWidth="2.5"
          />
          <circle
            cx="65"
            cy="65"
            r="58"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3.5"
            strokeDasharray="80 180"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(37, 99, 235, 0.35))' }}
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
            stroke="rgba(2, 132, 199, 0.12)"
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
            style={{ filter: 'drop-shadow(0 2px 6px rgba(2, 132, 199, 0.3))' }}
          />
        </svg>

        {/* Pulsing Central Energy Zap Icon */}
        <div
          className="electric-pulse-bolt"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid rgba(37, 99, 235, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.18), inset 0 2px 6px rgba(37, 99, 235, 0.08)',
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
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Read<span style={{ color: 'var(--primary)' }}>Meter</span>
          </div>
        )}

        <div
          style={{
            fontSize: '0.9rem',
            color: '#475569',
            letterSpacing: '0.01em',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
          }}
        >
          {message}
        </div>

        {/* Shimmering Progress Bar Indicator */}
        <div
          style={{
            width: '160px',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '999px',
            margin: '0.85rem auto 0 auto',
            overflow: 'hidden',
          }}
        >
          <div
            className="electric-shimmer-bar"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>
    </div>
  )
}
