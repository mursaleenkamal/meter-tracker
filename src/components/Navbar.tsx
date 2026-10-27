'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Wrench } from 'lucide-react'

interface NavbarProps {
  user?: any
  maxWidth?: string
}

export default function Navbar({ user, maxWidth = '1200px' }: NavbarProps) {
  return (
    <header
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0 1.25rem',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.6rem',
          fontWeight: 800,
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '-0.5px',
          textDecoration: 'none',
          userSelect: 'none',
        }}
      >
        <Zap size={28} fill="#2563eb" color="#2563eb" />
        <span>
          Read<span style={{ color: '#2563eb' }}>Meter</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            background: '#eff6ff',
            transition: 'all 0.15s ease',
          }}
        >
          <Wrench size={14} /> Tools Hub{' '}
          <span
            style={{
              fontSize: '0.72rem',
              background: '#2563eb',
              color: '#ffffff',
              padding: '1px 6px',
              borderRadius: '999px',
              fontWeight: 800,
            }}
          >
            15
          </span>
        </Link>
        <Link
          href="/protected-slab-calculator"
          style={{
            color: '#475569',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 600,
            padding: '6px 8px',
            borderRadius: '6px',
            transition: 'color 0.15s ease',
          }}
        >
          ⚡ Slab Calculator
        </Link>
        <Link
          href="/blog"
          style={{
            color: '#475569',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 500,
            padding: '6px 8px',
            borderRadius: '6px',
            transition: 'color 0.15s ease',
          }}
        >
          Blog
        </Link>
        {user ? (
          <Link
            href="/dashboard"
            className="glow-btn-solid"
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.86rem' }}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/guest"
              className="glow-btn"
              style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.86rem' }}
            >
              ⚡ Guest Sandbox
            </Link>
            <Link
              href="/login"
              className="glow-btn-accent"
              style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '0.86rem' }}
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
