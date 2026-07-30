'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Auth Actions

export async function signUpAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    return { error: 'All fields are required.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Registration successful! Please check your email to verify your account or proceed.' }
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// Meter Actions


export async function createMeterAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const meterNumber = formData.get('meterNumber') as string
  const billingCycleStartDayStr = formData.get('billingCycleStartDay') as string
  const maxUsageLimitStr = formData.get('maxUsageLimit') as string

  const billingCycleStartDay = parseInt(billingCycleStartDayStr, 10)
  const maxUsageLimit = parseFloat(maxUsageLimitStr)

  if (!meterNumber || isNaN(billingCycleStartDay) || isNaN(maxUsageLimit)) {
    return { error: 'Invalid inputs. Please verify all fields.' }
  }

  if (billingCycleStartDay < 1 || billingCycleStartDay > 31) {
    return { error: 'Billing cycle start day must be between 1 and 31.' }
  }

  const { data, error } = await supabase
    .from('meters')
    .insert({
      profile_id: user.id,
      meter_number: meterNumber,
      billing_cycle_start_day: billingCycleStartDay,
      max_usage_limit: maxUsageLimit,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true, meterId: data?.id }
}

export async function updateLimitAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const meterId = formData.get('meterId') as string
  const maxUsageLimitStr = formData.get('maxUsageLimit') as string
  const maxUsageLimit = parseFloat(maxUsageLimitStr)

  if (!meterId || isNaN(maxUsageLimit) || maxUsageLimit < 0) {
    return { error: 'Invalid maximum usage limit value.' }
  }

  const { error } = await supabase
    .from('meters')
    .update({ max_usage_limit: maxUsageLimit })
    .eq('id', meterId)
    .eq('profile_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}

// Reading Actions

export async function addReadingAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const meterId = formData.get('meterId') as string
  const readingValueStr = formData.get('readingValue') as string
  const notes = formData.get('notes') as string
  const image = formData.get('image') as File | null
  const isBillingReset = formData.get('isBillingReset') === 'true'

  const readingValue = parseFloat(readingValueStr)

  if (!meterId || isNaN(readingValue) || readingValue < 0) {
    return { error: 'Invalid reading value.' }
  }

  // 1. Fetch the latest reading to validate cumulative value and compute daily units
  const { data: previousReadings, error: fetchError } = await supabase
    .from('readings')
    .select('reading_value, created_at')
    .eq('meter_id', meterId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (fetchError) {
    return { error: `Failed to verify previous readings: ${fetchError.message}` }
  }

  const previousReading = previousReadings?.[0]
  if (previousReading && readingValue < Number(previousReading.reading_value)) {
    return {
      error: `New reading (${readingValue} units) must be greater than or equal to the previous reading (${previousReading.reading_value} units).`,
    }
  }

  // 2. Calculate daily average units if there is a previous reading
  let calculatedDailyUnits = null
  if (previousReading) {
    const prevDate = new Date(previousReading.created_at)
    const currDate = new Date()
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
    // Avoid division by zero if submitted immediately. Minimum 1 minute interval.
    const diffDays = Math.max(diffTime / (1000 * 60 * 60 * 24), 0.0007) 
    calculatedDailyUnits = (readingValue - Number(previousReading.reading_value)) / diffDays
  }

  // 3. Upload Image to Supabase Storage if present
  let imageUrl = null
  if (image && image.size > 0 && image.name !== 'undefined') {
    const fileBuffer = await image.arrayBuffer()
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meter-readings')
      .upload(filePath, fileBuffer, {
        contentType: image.type,
        upsert: true,
      })

    if (uploadError) {
      return { error: `Failed to upload image: ${uploadError.message}` }
    }

    const { data: publicUrlData } = supabase.storage
      .from('meter-readings')
      .getPublicUrl(filePath)

    imageUrl = publicUrlData.publicUrl
  }

  // 4. Save to Database
  const { error: insertError } = await supabase.from('readings').insert({
    meter_id: meterId,
    reading_value: readingValue,
    notes: notes || null,
    image_url: imageUrl,
    calculated_daily_units: calculatedDailyUnits,
    is_billing_reset: isBillingReset,
  })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}

export async function deleteReadingAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const readingId = formData.get('readingId') as string

  if (!readingId) {
    return { error: 'Reading ID is required.' }
  }

  // Row Level Security (RLS) automatically ensures users can only delete their own data
  const { error } = await supabase
    .from('readings')
    .delete()
    .eq('id', readingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}

export async function updateNextReadingDateAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const meterId = formData.get('meterId') as string
  const nextReadingDate = formData.get('nextReadingDate') as string

  if (!meterId) {
    return { error: 'Meter ID is required.' }
  }

  const { error } = await supabase
    .from('meters')
    .update({
      next_reading_date: nextReadingDate || null,
    })
    .eq('id', meterId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}
