import ElectricLoader from '@/components/ElectricLoader'

export default function DashboardLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#060913',
      }}
    >
      <ElectricLoader fullScreen message="Loading Meter Dashboard & Telemetry..." />
    </div>
  )
}
