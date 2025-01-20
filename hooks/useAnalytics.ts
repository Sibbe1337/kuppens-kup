import { useCallback } from 'react'
import { Mixpanel } from '@/lib/mixpanel'
import { useSession } from 'next-auth/react'

export function useAnalytics() {
  const { data: session } = useSession()

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (session?.user) {
      Mixpanel.identify(session.user.id)
      Mixpanel.people.set({
        $email: session.user.email,
        $name: session.user.name,
      })
    }
    Mixpanel.track(eventName, properties)
  }, [session])

  return { trackEvent }
}

