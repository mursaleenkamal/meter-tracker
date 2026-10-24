import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim()
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || 
                    envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim()

const supabase = createClient(supabaseUrl, supabaseKey)

async function listPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, category, published_at')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    return
  }
  console.log(`Found ${data.length} blog posts in Supabase:`)
  data.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.category}] ${p.slug} (${p.published_at.slice(0, 10)})`)
  })
}

listPosts()
