import { useState, useEffect, useRef } from "react"
import { useIntl } from "@/contexts/IntlContext"
import { FormattedMessage, FormattedNumber } from "react-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface LicensingScreenProps {
  isOpen: boolean
  onClose: () => void
  track: {
    id: string
    title: string
    artist: string
  }
}

const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  JPY: 110,
}

export function LicensingScreen({ isOpen, onClose, track }: LicensingScreenProps) {
  const { locale } = useIntl()
  const [selectedLicense, setSelectedLicense] = useState("basic")
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  const currency = locale === "en" ? "USD" : locale === "ja" ? "JPY" : "EUR"

  const licenses = {
    basic: { price: 49.99 },
    premium: { price: 99.99 },
    enterprise: { price: 299.99 },
  }

  useEffect(() => {
    if (isOpen) {
      initialFocusRef.current?.focus()
    }
  }, [isOpen])

  const handleLicenseSelection = (value: string) => {
    setSelectedLicense(value)
  }

  const handlePurchase = () => {
    // Implement purchase logic here
    console.log(`Purchasing ${selectedLicense} license for track ${track.id}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="track.license" />: {track.title}
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id={`license.${selectedLicense}`} />
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={selectedLicense} onValueChange={handleLicenseSelection}>
          {Object.entries(licenses).map(([key, { price }]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>
                <FormattedMessage id={`license.${key}`} />
                {" - "}
                <FormattedNumber value={price * exchangeRates[currency]} style="currency" currency={currency} />
              </Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            <FormattedMessage id="cancel" />
          </Button>
          <Button onClick={handlePurchase} ref={initialFocusRef}>
            <FormattedMessage id="purchase" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

