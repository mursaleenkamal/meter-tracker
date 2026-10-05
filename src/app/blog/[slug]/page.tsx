import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../blog.module.css'
import { getAllPosts, getPostBySlug } from '@/lib/blogPosts'
import { Zap, Clock, Calendar, User, ArrowLeft, ArrowRight, Camera, Calculator } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readmeter.online'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article Not Found | Read Meter',
    }
  }

  return {
    title: `${post.title} | Read Meter Blog`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'Read Meter',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/og-image.png'],
    },
  }
}

// Simple markdown-like renderer for headings, lists, tables, bold, and blockquotes
function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let inTable = false
  let tableRows: string[][] = []
  let tableHeaders: string[] = []

  const flushTable = (key: number) => {
    if (tableRows.length > 0 || tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table>
            {tableHeaders.length > 0 && (
              <thead>
                <tr>
                  {tableHeaders.map((th, i) => (
                    <th key={i}>{th.replace(/\*\*/g, '')}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, rIndex) => (
                <tr key={rIndex}>
                  {row.map((cell, cIndex) => (
                    <td key={cIndex}>
                      {cell.includes('**') ? (
                        <strong>{cell.replace(/\*\*/g, '')}</strong>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
      tableHeaders = []
      inTable = false
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Table parsing
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim())

      if (cells.every((c) => c.includes('---'))) {
        // Separator line, ignore
        return
      }

      if (!inTable) {
        inTable = true
        tableHeaders = cells
      } else {
        tableRows.push(cells)
      }
      return
    } else if (inTable) {
      flushTable(index)
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index}>{trimmed.replace('## ', '')}</h2>
      )
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index}>{trimmed.replace('### ', '')}</h3>
      )
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index}>{trimmed.replace('> ', '')}</blockquote>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} style={{ marginBottom: '0.4rem' }}>
          {trimmed.substring(2)}
        </li>
      )
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li key={index} style={{ marginBottom: '0.4rem' }}>
          {trimmed.replace(/^\d+\.\s/, '')}
        </li>
      )
    } else if (trimmed === '---') {
      elements.push(
        <hr key={index} style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
      )
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={index}>{trimmed}</p>
      )
    }
  })

  if (inTable) {
    flushTable(lines.length)
  }

  return elements
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Read Meter',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
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
          <Link href="/blog" className={styles.navBtn}>
            ← All Articles
          </Link>
          <Link href="/protected-slab-calculator" className={styles.navBtn}>
            ⚡ Slab Calculator
          </Link>
          <Link href="/guest" className={styles.navBtnPrimary}>
            ⚡ Instant Meter Scanner
          </Link>
        </nav>
      </header>

      {/* Article Container */}
      <article className={styles.articleWrapper}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span>{post.category}</span>
        </div>

        <header className={styles.articleHeader}>
          <span className={styles.categoryTag}>{post.category}</span>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6 }}>{post.excerpt}</p>
          
          <div className={styles.articleInfoBar}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} /> {post.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} /> {post.publishedAt}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} /> {post.readTime}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <div className={styles.articleBody}>
          {renderContent(post.content)}
        </div>

        {/* Interactive CTA Banner */}
        <div className={styles.ctaBox}>
          <h3 className={styles.ctaBoxTitle}>
            ⚡ Apne Bijli Bill Ka Live Estimate Lagana Chahte Hain?
          </h3>
          <p className={styles.ctaBoxText}>
            Hamara free 200-Unit Protected Slab Calculator aur AI Camera Scanner aap ke bijli meter ki readings ko foran track kar ke expected bill calculate karta hai.
          </p>
          <div className={styles.ctaBoxButtons}>
            <Link
              href="/protected-slab-calculator"
              className={styles.navBtnPrimary}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.6rem', fontSize: '1rem' }}
            >
              <Calculator size={18} /> Open Slab Calculator
            </Link>
            <Link
              href="/guest"
              className={styles.navBtn}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.6rem', fontSize: '1rem', background: 'rgba(255,255,255,0.1)' }}
            >
              <Camera size={18} /> Scan Meter Dial
            </Link>
          </div>
        </div>

        {/* FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>
              Frequently Asked Questions (FAQs)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {post.faqs.map((faq, i) => (
                <div key={i} style={{ background: 'rgba(15,23,42,0.6)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                    {faq.question}
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: '#cbd5e1', lineHeight: 1.6 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Read Meter (readmeter.online) — Smart Power Tracking & Utility Education.</p>
      </footer>
    </div>
  )
}
