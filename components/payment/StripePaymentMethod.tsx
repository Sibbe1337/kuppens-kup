import type React from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import type { PaymentMethodProps } from "@/lib/paymentGateways"

export function StripePaymentMethod({ amount, currency, onSuccess, onError }: PaymentMethodProps) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (error) {
      onError(error)
    } else if (paymentMethod) {
      onSuccess(paymentMethod.id)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe} className="mt-4">
        Pay {amount} {currency}
      </Button>
    </form>
  )
}

