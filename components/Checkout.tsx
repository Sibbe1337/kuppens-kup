import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Track } from "@/types/track"
import { Elements } from "@stripe/react-stripe-js"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { availablePaymentGateways, type PaymentGateway } from "@/lib/paymentGateways"

interface CheckoutProps {
  track: Track
  licenseType: string
  price: number
  isOpen: boolean
  onClose: (success: boolean) => void
}

function CheckoutForm({ track, licenseType, price, onClose }: Omit<CheckoutProps, "isOpen">) {
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null)
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsProcessing(true)
    try {
      // Here you would typically send the paymentId to your server
      // to complete the purchase and create a license

      // Simulating a server request
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Purchase Successful",
        description: `You have successfully licensed "${track.title}" with a ${licenseType} license for $${price.toFixed(2)}.`,
      })
      onClose(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Payment Error",
      description: error.message,
      variant: "destructive",
    })
  }

  const nextStep = () => {
    if (step === 1 && !validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }
    setStep(step + 1)
  }

  const PaymentMethodComponent = selectedGateway?.component

  return (
    <form className="space-y-4">
      <div className="flex justify-between mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {i}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-2">
          <Label>Select Payment Method</Label>
          <div className="grid grid-cols-2 gap-2">
            {availablePaymentGateways.map((gateway) => (
              <Button
                key={gateway.name}
                onClick={() => setSelectedGateway(gateway)}
                variant={selectedGateway === gateway ? "default" : "outline"}
              >
                {gateway.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && selectedGateway && PaymentMethodComponent && (
        <PaymentMethodComponent
          amount={price}
          currency="usd"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      <DialogFooter>
        {step > 1 && (
          <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button type="button" onClick={nextStep} disabled={step === 2 && !selectedGateway}>
            Next
          </Button>
        ) : null}
      </DialogFooter>
    </form>
  )
}

export function Checkout({ track, licenseType, price, isOpen, onClose }: CheckoutProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
            <CheckoutForm track={track} licenseType={licenseType} price={price} onClose={onClose} />
          </PayPalScriptProvider>
        </Elements>
      </DialogContent>
    </Dialog>
  )
}

