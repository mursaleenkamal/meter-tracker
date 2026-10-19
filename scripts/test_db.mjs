import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim()
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || 
                    envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim()

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key length:', supabaseKey ? supabaseKey.length : 0)
  
  // Try querying meters
  const { data: meters, error: metersErr } = await supabase.from('meters').select('id').limit(1)
  console.log('Meters check:', { count: meters?.length, error: metersErr?.message })

  // Try querying blog_posts
  const { data: blogs, error: blogsErr } = await supabase.from('blog_posts').select('*').limit(1)
  console.log('Blog posts check:', { count: blogs?.length, error: blogsErr?.message })
}

testConnection()
