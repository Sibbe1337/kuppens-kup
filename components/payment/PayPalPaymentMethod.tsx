import React from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"
import type { PaymentMethodProps } from "@/lib/paymentGateways"

export function PayPalPaymentMethod({ amount, currency, onSuccess, onError }: PaymentMethodProps) {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toString(),
                currency_code: currency.toUpperCase(),
              },
            },
          ],
        })
      }}
      onApprove={(data, actions) => {
        return actions.order!.capture().then((details) => {
          onSuccess(details.id)
        })
      }}
      onError={(err) => {
        onError(err as Error)
      }}
    />
  )
}

