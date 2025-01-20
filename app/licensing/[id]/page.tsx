"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useIntl } from "@/contexts/IntlContext"
import { FormattedMessage, FormattedNumber } from "react-intl"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  JPY: 110,
}

export default function LicensingScreen() {
  const { id } = useParams()
  const { locale } = useIntl()
  const [selectedLicense, setSelectedLicense] = useState("basic")

  const currency = locale === "en" ? "USD" : locale === "ja" ? "JPY" : "EUR"

  const licenses = {
    basic: { price: 49.99 },
    premium: { price: 99.99 },
    enterprise: { price: 299.99 },
  }

  const handleLicenseSelection = (value: string) => {
    setSelectedLicense(value)
  }

  const handlePurchase = () => {
    // Implement purchase logic here
    console.log(`Purchasing ${selectedLicense} license for track ${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="track.license" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage id={`license.${selectedLicense}`} />
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter>
          <Button onClick={handlePurchase} className="w-full">
            <FormattedMessage id="track.license" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

