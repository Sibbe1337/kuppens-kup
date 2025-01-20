import { useState, useEffect } from "react"

type FeatureFlag = {
  [key: string]: boolean
}

const defaultFlags: FeatureFlag = {
  newLicensingButton: false,
  discountedPricing: false,
}

export function useFeatureFlags(): FeatureFlag {
  const [flags, setFlags] = useState<FeatureFlag>(defaultFlags)

  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // For now, we'll simulate a fetch with a timeout
    const fetchFlags = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setFlags({
        ...defaultFlags,
        newLicensingButton: Math.random() > 0.5,
        discountedPricing: Math.random() > 0.5,
      })
    }

    fetchFlags()
  }, [])

  return flags
}

