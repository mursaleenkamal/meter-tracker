import { createClient } from '@/utils/supabase/server'
import DynatraceUserTracker from '@/components/DynatraceUserTracker'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userIdentifier = user?.email || ''

  return (
    <>
      {userIdentifier ? (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dynatraceUser = ${JSON.stringify(userIdentifier)};`,
            }}
          />
          <DynatraceUserTracker userIdentifier={userIdentifier} />
        </>
      ) : null}
      {children}
    </>
  )
}
