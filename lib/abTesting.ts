import { useEffect, useState } from "react"

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export type Variant = "A" | "B"

export function useABTest(experimentId: string): Variant {
  const [variant, setVariant] = useState<Variant>("A")

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || []
      window.gtag = () => {
        window.dataLayer.push(arguments)
      }

      window.gtag("event", "optimize.callback", {
        name: experimentId,
        callback: (chosenVariation: string) => {
          setVariant(chosenVariation as Variant)
        },
      })
    }
  }, [experimentId])

  return variant
}

