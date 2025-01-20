import React from "react"
import { Button } from "@/components/ui/button"
import type { PaymentMethodProps } from "@/lib/paymentGateways"

export function ApplePayPaymentMethod({ amount, currency, onSuccess, onError }: PaymentMethodProps) {
  const handleApplePay = async () => {
    if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
      onError(new Error("Apple Pay is not available"))
      return
    }

    const paymentRequest = {
      countryCode: "US",
      currencyCode: currency.toUpperCase(),
      total: {
        label: "Music License",
        amount: amount,
      },
      supportedNetworks: ["visa", "mastercard", "amex"],
      merchantCapabilities: ["supports3DS"],
    }

    const session = new ApplePaySession(3, paymentRequest)

    session.onpaymentauthorized = (event) => {
      // Here you would typically send the payment token to your server
      // and complete the payment
      onSuccess(event.payment.token.paymentData)
      session.completePayment(ApplePaySession.STATUS_SUCCESS)
    }

    session.oncancel = () => {
      onError(new Error("Apple Pay payment cancelled"))
    }

    session.begin()
  }

  return <Button onClick={handleApplePay}>Pay with Apple Pay</Button>
}

