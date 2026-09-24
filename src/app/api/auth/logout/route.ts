import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')

  const response = NextResponse.redirect(new URL('/login', request.url), {
    status: 302,
  })
  response.cookies.delete('dynatrace_user')

  return response
}
