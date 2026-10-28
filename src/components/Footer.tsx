import React from 'react'
import Link from 'next/link'

interface FooterProps {
  maxWidth?: string
}

export default function Footer({ maxWidth = '1100px' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '3rem 1.5rem 2rem',
        marginTop: '4rem',
        color: '#475569',
        fontFamily: 'var(--font-outfit), sans-serif',
      }}
    >
      <div
        style={{
          maxWidth,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Col 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#0f172a',
                textDecoration: 'none',
                letterSpacing: '-0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              Read<span style={{ color: '#2563eb' }}>Meter</span>
            </Link>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#64748b', margin: 0 }}>
              AI-driven utility meter reading, OCR camera scanner, tariff slab protection, and fair sub-meter bill calculation for smart households and landlords.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Col 2: Core Utility Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Utility Calculators
            </div>
            <Link href="/tools" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>
              🧰 Explore All 15 Tools Hub
            </Link>
            <Link href="/protected-slab-calculator" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              ⚡ 200-Unit Protected Slab
            </Link>
            <Link href="/tools/landlord-submeter-splitter" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              ⚖️ Tenant Sub-Meter Splitter
            </Link>
            <Link href="/tools/battery-backup-calculator" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              🔋 UPS & Battery Backup Time
            </Link>
            <Link href="/tools/solar-net-metering-calculator" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              ☀️ Solar Net Metering Savings
            </Link>
            <Link href="/tools/ac-electricity-cost-calculator" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              ❄️ AC Electricity Cost Calculator
            </Link>
          </div>

          {/* Col 3: Meter Scanners (Dual Mode) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              AI Camera Scanners
            </div>
            <Link href="/guest" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              📸 Fast Camera Meter Scanner
            </Link>
            <Link href="/tools/read-digital-lcd-meter" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              📟 Digital LCD Electricity Meter
            </Link>
            <Link href="/tools/read-analog-dial-meter" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              🔄 Analog Dial Rotary Meter
            </Link>
            <Link href="/tools/read-gas-meter" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              🔥 Sui Gas Meter Reading
            </Link>
            <Link href="/tools/read-water-meter" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              💧 Municipal Water Meter
            </Link>
          </div>

          {/* Col 4: Resources & Compliance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Guides & Legal
            </div>
            <Link href="/blog" style={{ fontSize: '0.88rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
              📖 Utility Energy Blog
            </Link>
            <Link href="/about" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              About Read Meter
            </Link>
            <Link href="/contact" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              Contact & Support
            </Link>
            <Link href="/privacy-policy" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="/disclaimer" style={{ fontSize: '0.88rem', color: '#475569', textDecoration: 'none' }}>
              Tariff Disclaimer
            </Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#64748b',
            gap: '1rem',
          }}
        >
          <div>&copy; {currentYear} Read Meter Systems. All rights reserved. Zero Login • Offline PWA • 100% Free.</div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link href="/terms-of-service" style={{ color: '#64748b', textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy-policy" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/contact" style={{ color: '#64748b', textDecoration: 'none' }}>Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
