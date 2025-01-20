import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
  debug: process.env.NODE_ENV !== 'production',
  track_pageview: true,
  persistence: 'localStorage',
})

export const Mixpanel = {
  identify: (id: string) => {
    mixpanel.identify(id)
  },
  alias: (id: string) => {
    mixpanel.alias(id)
  },
  track: (name: string, props?: Record<string, any>) => {
    mixpanel.track(name, props)
  },
  people: {
    set: (props: Record<string, any>) => {
      mixpanel.people.set(props)
    },
  },
  reset: () => {
    mixpanel.reset()
  },
}

