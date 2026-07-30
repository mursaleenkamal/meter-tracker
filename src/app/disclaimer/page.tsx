import Link from 'next/link'
import styles from '../compliance.module.css'
import { Zap, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | VoltTrack',
  description: 'Legal disclaimer and accuracy notes regarding utility bill calculations and electric meter unit estimations.',
}

export default function DisclaimerPage() {
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
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Important Notice</span>
          </div>
          <h1 className={styles.pageTitle}>Disclaimer</h1>
          <p className={styles.pageMeta}>Last updated: July 30, 2026</p>
        </div>

        <div className={styles.contentCard}>
          <p>
            The information provided by VoltTrack ("we", "us", or "our") on volttrack.app is for general informational and tracking purposes only. All information on the site is provided in good faith.
          </p>

          <h2>1. Utility Calculation Disclaimers</h2>
          <p>
            VoltTrack calculates electricity unit consumption based on user-entered meter reading values and billing cycle configurations. While our application uses precise mathematical formulas to estimate unit usage, daily averages, and slab progress:
          </p>
          <ul>
            <li>Calculations are estimates and do not replace official utility company monthly invoices.</li>
            <li>Government taxes, fuel price adjustments (FPA), TV fees, or fixed meter rent charges added by utility providers are subject to regional policy changes.</li>
            <li>Users should always cross-reference official utility bills for final payment liabilities.</li>
          </ul>

          <h2>2. Sub-Meter Usage Notice</h2>
          <p>
            When using VoltTrack for shared sub-meters (e.g., landlord/tenant arrangements or multi-portion houses), VoltTrack acts as an independent utility logging tool. Parties are encouraged to mutually agree upon billing cycle start dates and baseline readings.
          </p>

          <h2>3. External Links Disclaimer</h2>
          <p>
            VoltTrack may contain links to third-party websites or external services (such as WhatsApp API deep links). Such external links are not investigated or monitored for accuracy by us.
          </p>

          <h2>4. OCR Camera Scanning Disclaimer</h2>
          <p>
            Our optical character recognition (OCR) feature assists in reading dial values from physical photos. Users must review and verify the recognized numeric digits before confirming submission to ensure record accuracy.
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
