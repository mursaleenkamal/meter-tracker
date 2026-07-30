import Link from 'next/link'
import styles from '../compliance.module.css'
import { Zap, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | VoltTrack',
  description: 'Terms of Service and user agreement for VoltTrack electric meter unit tracking platform.',
}

export default function TermsOfServicePage() {
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
            <FileText size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>User Agreement</span>
          </div>
          <h1 className={styles.pageTitle}>Terms of Service</h1>
          <p className={styles.pageMeta}>Last updated: July 30, 2026</p>
        </div>

        <div className={styles.contentCard}>
          <p>
            Welcome to VoltTrack. By accessing or using our website located at volttrack.app and related dashboard services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use VoltTrack.
          </p>

          <h2>1. Description of Service</h2>
          <p>
            VoltTrack is a digital electricity monitoring application that enables homeowners, tenants, and property managers to log meter dial values, perform AI-assisted OCR photo readings, monitor billing cycle consumption, and receive push reminders.
          </p>

          <h2>2. User Account Responsibilities</h2>
          <p>
            When creating an account on VoltTrack, you are responsible for maintaining the confidentiality of your login credentials and password. You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2>3. Acceptable Use Policy</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul>
            <li>Attempting to breach, disable, or reverse engineer any security mechanisms or authentication features.</li>
            <li>Submitting false or automated spam meter readings to manipulate analytics system memory.</li>
            <li>Using VoltTrack for illegal commercial activities or unauthorized data scraping.</li>
          </ul>

          <h2>4. Accuracy of Calculations</h2>
          <p>
            VoltTrack provides unit consumption totals, tariff slab projections, and daily averages based on user-submitted reading values. While we strive for absolute mathematical precision, actual utility company final invoices may differ due to fuel price adjustments, government taxes, or meter calibration variations.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The software, branding, code, user interface designs, and visual assets of VoltTrack are protected by copyright and intellectual property laws. You may not copy, modify, or distribute our proprietary source code without explicit consent.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, VoltTrack shall not be liable for any indirect, incidental, or consequential damages resulting from your use of or inability to use the platform.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Continued use of VoltTrack after any updates constitutes acceptance of the new terms.
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
