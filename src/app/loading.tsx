import ElectricLoader from '@/components/ElectricLoader'

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }}
    >
      <ElectricLoader fullScreen message="Loading Read Meter..." />
    </div>
  )
}
