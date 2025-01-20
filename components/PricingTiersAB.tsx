// ... (previous imports)
import { useFeatureFlags } from "@/lib/featureFlags"

export function PricingTiersAB({ trackId, onSelectTier }: PricingTiersABProps) {
  const variant = useABTest("pricing_tiers")
  const { trackEvent } = useAnalytics()
  const flags = useFeatureFlags()

  const tiers = flags.discountedPricing && variant === "B" ? discountedTiers : baseTiers

  // ... (rest of the component remains the same)
}

