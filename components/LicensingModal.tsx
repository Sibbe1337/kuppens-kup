import React, { useState } from "react"
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
import type { Track } from "@/types/track"
import { Checkout } from "./Checkout"
import { useAnalytics } from "@/hooks/useAnalytics"
import { PricingTiersAB } from "./PricingTiersAB"

interface LicensingModalProps {
  track: Track
  isOpen: boolean
  onClose: () => void
}

export function LicensingModal({ track, isOpen, onClose }: LicensingModalProps) {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { trackEvent } = useAnalytics()

  const handleLicense = () => {
    if (selectedLicense && selectedPrice !== null) {
      setIsCheckoutOpen(true)
      trackEvent("Start Checkout", { trackId: track.id, licenseType: selectedLicense, price: selectedPrice })
    }
  }

  const handleSelectTier = (tierName: string, price: number) => {
    setSelectedLicense(tierName)
    setSelectedPrice(price)
  }

  const handleCheckoutClose = (success: boolean) => {
    setIsCheckoutOpen(false)
    onClose()
    if (success) {
      trackEvent("Complete Purchase", { trackId: track.id, licenseType: selectedLicense, price: selectedPrice })
    } else {
      trackEvent("Abandon Checkout", { trackId: track.id, licenseType: selectedLicense, price: selectedPrice })
    }
  }

  const handleClose = () => {
    if (isOpen && !isCheckoutOpen) {
      trackEvent("Close Licensing Modal", { trackId: track.id, licenseSelected: !!selectedLicense })
    }
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>License "{track.title}"</DialogTitle>
            <DialogDescription>Choose a license type to use this track in your project.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <PricingTiersAB trackId={track.id} onSelectTier={handleSelectTier} />
          </div>
          {selectedLicense && selectedPrice !== null && (
            <div className="bg-secondary p-4 rounded-md mb-4">
              <h3 className="font-semibold mb-2">Selected License Summary</h3>
              <p>Track: {track.title}</p>
              <p>License: {selectedLicense}</p>
              <p>Price: ${selectedPrice.toFixed(2)}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleLicense} disabled={!selectedLicense}>
              Proceed to Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {selectedLicense && selectedPrice !== null && (
        <Checkout
          track={track}
          licenseType={selectedLicense}
          price={selectedPrice}
          isOpen={isCheckoutOpen}
          onClose={handleCheckoutClose}
        />
      )}
    </>
  )
}

