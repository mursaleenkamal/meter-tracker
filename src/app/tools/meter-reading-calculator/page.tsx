import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Live Meter Reading & Real-Time Bill Calculator | Read Meter',
  description:
    'Track daily electricity units (kWh), calculate burn rate velocity, forecast your monthly bill, and prevent the 200-unit slab penalty cliff in real time. Zero login required.',
  alternates: {
    canonical: 'https://www.readmeter.online/tools/meter-reading-calculator',
  },
}

export default function MeterReadingCalculatorPage() {
  redirect('/guest')
}
