import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ReadingForm from '@/components/ReadingForm'
import styles from '../../scanner.module.css'
import { Zap } from 'lucide-react'

export default async function AddReadingPage() {
  const supabase = await createClient()

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Fetch User Meters
  const { data: meters } = await supabase
    .from('meters')
    .select('*')
    .eq('profile_id', user.id)

  if (!meters || meters.length === 0) {
    redirect('/dashboard')
  }

  const activeMeter = meters[0]

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(6, 9, 19, 0.4)',
          backdropFilter: 'var(--glass-filter)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
          <Zap style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 5px var(--primary-glow))' }} size={22} fill="var(--primary)" />
          <span>
            Volt<span style={{ color: 'var(--primary)' }}>Track</span>
          </span>
        </div>
      </nav>

      {/* Renders Reading Form Component */}
      <ReadingForm meterId={activeMeter.id} meterNumber={activeMeter.meter_number} />
    </div>
  )
}
