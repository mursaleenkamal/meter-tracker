import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './blog.module.css'
import { getAllPosts } from '@/lib/blogPosts'
import { Zap, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

export const metadata: Metadata = {
  title: 'Electricity Bill Saving & Tariff Guides Blog | Read Meter',
  description:
    'Read expert articles, daily electricity tips, K-Electric/LESCO tariff breakdowns, inverter AC consumption guides, and sub-meter billing calculations.',
  keywords: [
    'electricity bill saving tips pakistan',
    'k electric tariff guide 2026',
    'inverter ac unit consumption',
    'peak hours pakistan electricity',
    'submeter calculation formula',
    'nepra protected slab rules',
    'read meter blog',
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Electricity Bill Saving & Tariff Guides Blog | Read Meter',
    description:
      'Expert advice, mathematical billing formulas, and energy-saving guides for Pakistani households and landlords.',
    url: `${siteUrl}/blog`,
    siteName: 'Read Meter',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Read Meter Energy & Tariff Blog',
    url: `${siteUrl}/blog`,
    description: 'Expert utility billing guides and energy conservation tips in Pakistan.',
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Organization',
        name: post.author,
      },
    })),
  }

  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Zap size={28} color="#00F0FF" />
          <span>READ METER</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navBtn}>
            Home
          </Link>
          <Link href="/protected-slab-calculator" className={styles.navBtn}>
            ⚡ Slab Calculator
          </Link>
          <Link href="/guest" className={styles.navBtnPrimary}>
            ⚡ Instant Meter Scanner
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <BookOpen size={16} />
          UTILITY GUIDES & DAILY INSIGHTS
        </div>
        <h1 className={styles.heroTitle}>
          Electricity Saving & <span>Tariff Guides</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Real data, practical tips, and transparent billing formulas to help you control power consumption and prevent bill shocks.
        </p>
      </section>

      {/* Blog Cards Grid */}
      <main className={styles.blogGrid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div>
              <div className={styles.cardMeta}>
                <span className={styles.categoryTag}>{post.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} /> {post.readTime}
                </span>
              </div>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>
            </div>
            <div className={styles.cardFooter}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8' }}>
                <Calendar size={14} /> {post.publishedAt}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Read Article <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Read Meter (readmeter.online) — Smart Power Tracking & Utility Education.</p>
      </footer>
    </div>
  )
}
