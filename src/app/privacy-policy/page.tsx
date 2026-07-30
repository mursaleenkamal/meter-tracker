import Link from 'next/link'
import styles from '../compliance.module.css'
import { Zap, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | VoltTrack',
  description: 'Learn how VoltTrack protects your personal data, electric meter reading records, and account information in accordance with privacy laws and Google AdSense guidelines.',
}

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Legal & Security</span>
          </div>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          <p className={styles.pageMeta}>Last updated: July 30, 2026</p>
        </div>

        <div className={styles.contentCard}>
          <p>
            At VoltTrack ("we", "our", "us"), accessible from volttrack.app, one of our main priorities is the privacy of our visitors and registered users. This Privacy Policy document contains types of information that is collected and recorded by VoltTrack and how we use it.
          </p>

          <h2>1. Information We Collect</h2>
          <p>When you register and use VoltTrack, we collect necessary personal and technical information to provide meter unit tracking services:</p>
          <ul>
            <li><strong>Account Data:</strong> Email address, full name, and optional phone number provided during account registration.</li>
            <li><strong>Meter Usage Records:</strong> Meter serial numbers, reading values, photos uploaded for OCR scanning, and billing cycle settings.</li>
            <li><strong>Technical Logs & Analytics:</strong> IP addresses, browser types, device information, and Vercel Speed Insights for performance optimization.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We utilize the collected information strictly for service delivery and system improvement:</p>
          <ul>
            <li>To manage your account and maintain persistent authentication sessions via Supabase Auth.</li>
            <li>To compute billing cycle electricity unit consumption, peak charges, and progress percentages.</li>
            <li>To dispatch Web Push notifications for reading reminders and inactivity alerts.</li>
            <li>To detect technical bugs, prevent unauthorized access, and ensure server stability.</li>
          </ul>

          <h2>3. Cookies & Web Beacons</h2>
          <p>
            VoltTrack uses standard session cookies to keep you securely signed in to your account. These essential cookies do not track your browsing activity across external websites. Third-party vendor services (such as Google AdSense and analytics tools) may use cookies or web beacons to serve relevant advertisements based on past visits.
          </p>

          <h2>4. Data Storage & Security</h2>
          <p>
            All user authentication data and meter records are encrypted in transit via SSL/TLS and stored securely using Supabase enterprise infrastructure backed by PostgreSQL Row Level Security (RLS). We never sell or rent your personal information to third parties.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            VoltTrack integrates verified third-party cloud services for infrastructure and analytics:
          </p>
          <ul>
            <li><strong>Supabase:</strong> User authentication & encrypted cloud database.</li>
            <li><strong>Vercel:</strong> Application hosting, edge caching, and Web Vitals analytics.</li>
            <li><strong>Google AdSense:</strong> Contextual advertising display.</li>
          </ul>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to request access to your personal data, request correction of inaccurate data, or request permanent deletion of your account and meter records at any time.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@volttrack.app or via our <Link href="/contact" style={{ color: 'var(--primary)' }}>Contact Page</Link>.
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
