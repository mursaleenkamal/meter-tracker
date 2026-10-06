import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read credentials from .env.local
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

/**
 * Direct Blog Publisher to Supabase
 * Usage: node scripts/publish_blog_supabase.mjs <path-to-json-post>
 */
export async function publishPost(postData) {
  console.log(`🚀 Publishing post: "${postData.title}" (${postData.slug})...`)
  
  const payload = {
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt,
    content: postData.content,
    author: postData.author || 'Read Meter Energy Team',
    read_time: postData.readTime || postData.read_time || '5 min read',
    category: postData.category || 'Energy Saving',
    tags: postData.tags || [],
    faqs: postData.faqs || [],
    status: postData.status || 'published',
    published_at: postData.publishedAt || postData.published_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('❌ Supabase publish error:', error.message)
    return { success: false, error }
  }

  console.log('✅ Post published successfully to Supabase!')
  console.log('🔗 URL:', `https://www.readmeter.online/blog/${postData.slug}`)
  return { success: true, data }
}

// CLI Runner if called directly with a JSON file
if (process.argv[2]) {
  const filePath = path.resolve(process.argv[2])
  if (fs.existsSync(filePath)) {
    const postJson = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    publishPost(postJson)
  } else {
    console.error('❌ File not found:', filePath)
  }
}
