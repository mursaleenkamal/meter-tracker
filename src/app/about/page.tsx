import Link from 'next/link'
import styles from '../compliance.module.css'
import { Zap, Info, Gauge, Cpu, Bell, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | VoltTrack Smart Electricity Monitoring',
  description: 'Learn about VoltTrack, our mission to simplify sub-meter electricity tracking, OCR photo reading technology, and unit consumption management.',
}

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Zap size={22} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
          <span>VoltTrack</span>
        </Link>
        <Link href="/login" className="glow-btn" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '6px 14px' }}>
          Sign In
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Info size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Product Overview</span>
          </div>
          <h1 className={styles.pageTitle}>About VoltTrack</h1>
          <p className={styles.pageMeta}>Smart Electricity Unit & Sub-Meter Management</p>
        </div>

        <div className={styles.contentCard}>
          <p>
            <strong>VoltTrack</strong> is a web platform designed to simplify electric meter monitoring for homeowners, tenants, property managers, and shared electricity sub-meter connections.
          </p>

          <h2>Our Mission</h2>
          <p>
            Electricity costs and complex monthly tariff slabs make it difficult for households to monitor unit consumption in real time. VoltTrack provides intuitive tracking, AI OCR camera scanning, and predictive alerts so users can avoid peak tariff surcharges and optimize power usage.
          </p>

          <h2>Core Platform Features</h2>
          <ul>
            <li><strong><Gauge size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Real-Time Unit Calculation:</strong> Automatically computes units consumed within your specific monthly billing cycle window.</li>
            <li><strong><Cpu size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Browser-Side OCR Scanning:</strong> Uses optical character recognition to extract numeric dial values directly from meter photos.</li>
            <li><strong><Bell size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Web Push Reminders:</strong> Sends background alerts when meter readings are due or when no reading has been logged for 3+ days.</li>
            <li><strong><ShieldCheck size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Multi-Meter Support:</strong> Track multiple electricity connections (e.g. Home, Office, Rental Units) under one account.</li>
          </ul>

          <h2>Why Choose VoltTrack?</h2>
          <p>
            Unlike static spreadsheets, VoltTrack automatically adjusts for monthly billing cycle start dates, stores historical reading records, calculates daily average consumption, and provides mobile offline support.
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/" className={styles.footerLink}>Home</Link>
          <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          <Link href="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
          <Link href="/about" className={styles.footerLink}>About Us</Link>
          <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
          <Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link>
        </div>
        <div>&copy; {new Date().getFullYear()} VoltTrack. All rights reserved.</div>
      </footer>
    </div>
  )
}
