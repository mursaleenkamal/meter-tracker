import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim()
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || 
                    envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim()

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Key missing in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Extract BLOG_POSTS from src/lib/blogPosts.ts
let code = fs.readFileSync('src/lib/blogPosts.ts', 'utf8')
code = code.replace(/^import[^\r\n]*\r?\n/, '')
code = code.replace(/export interface BlogPost[\s\S]*?export const BLOG_POSTS: BlogPost\[\] =/, 'const BLOG_POSTS =')
code = code.replace(/export async function getAllPosts[\s\S]*/, 'module.exports = { BLOG_POSTS };')
fs.writeFileSync('scripts/temp_extract.cjs', code)

const { BLOG_POSTS } = await import('./temp_extract.cjs')
fs.unlinkSync('scripts/temp_extract.cjs')

console.log(`Found ${BLOG_POSTS.length} static blog posts. Starting Supabase sync...`)

for (const post of BLOG_POSTS) {
  const payload = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author || 'Read Meter Energy Team',
    read_time: post.readTime || '5 min read',
    category: post.category || 'Energy Saving',
    tags: post.tags || [],
    faqs: post.faqs || [],
    status: post.status || 'published',
    published_at: post.publishedAt ? `${post.publishedAt}T10:00:00.000Z` : new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select('slug, title')

  if (error) {
    console.error(`❌ Error syncing "${post.slug}":`, error.message)
  } else {
    console.log(`✅ Synced: ${post.slug}`)
  }
}

console.log('🎉 Supabase sync complete!')
