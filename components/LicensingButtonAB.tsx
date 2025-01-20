// ... (previous imports)
import { useFeatureFlags } from "@/lib/featureFlags"

export function LicensingButtonAB({ onClick, trackId }: LicensingButtonABProps) {
  const variant = useABTest("licensing_button_placement")
  const { trackEvent } = useAnalytics()
  const flags = useFeatureFlags()

  const handleClick = () => {
    onClick()
    trackEvent("License Button Clicked", { trackId, variant })
  }

  if (!flags.newLicensingButton) {
    return <Button onClick={handleClick}>License</Button>
  }

  if (variant === "B") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={handleClick} size="lg" className="animate-pulse">
          License Now
        </Button>
      </div>
    )
  }

  // Default variant A
  return <Button onClick={handleClick}>License</Button>
}

