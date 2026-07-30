'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../compliance.module.css'
import { Zap, Mail, MessageSquare, Send, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate contact form submission
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 800)
  }

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
            <Mail size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Support</span>
          </div>
          <h1 className={styles.pageTitle}>Contact Us</h1>
          <p className={styles.pageMeta}>Have questions or feedback? We are here to help.</p>
        </div>

        <div className={styles.contentCard}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--primary)' }} />

              <h2 style={{ border: 'none', padding: 0, margin: 0 }}>Message Received!</h2>
              <p style={{ textAlign: 'center' }}>
                Thank you for contacting VoltTrack support. Our team will review your inquiry and get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="glow-btn"
                style={{ marginTop: '1rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="name" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  style={{
                    background: 'rgba(6, 9, 19, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="contactEmail" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="john@example.com"
                  required
                  style={{
                    background: 'rgba(6, 9, 19, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="message" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                  Your Inquiry / Feedback
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  required
                  style={{
                    background: 'rgba(6, 9, 19, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                className="glow-btn-solid"
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '12px',
                  fontSize: '0.98rem',
                  marginTop: '0.5rem',
                }}
              >
                <Send size={16} />
                {isLoading ? 'Sending Message...' : 'Submit Message'}
              </button>
            </form>
          )}

          <h2>Direct Support Email</h2>
          <p>
            You can also email our support team directly at <strong>support@volttrack.app</strong>.
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
