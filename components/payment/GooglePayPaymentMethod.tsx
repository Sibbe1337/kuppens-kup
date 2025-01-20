import React from "react"
import { Button } from "@/components/ui/button"
import type { PaymentMethodProps } from "@/lib/paymentGateways"

export function GooglePayPaymentMethod({ amount, currency, onSuccess, onError }: PaymentMethodProps) {
  const handleGooglePay = async () => {
    if (!window.google || !window.google.payments) {
      onError(new Error("Google Pay is not available"))
      return
    }

    const client = new google.payments.api.PaymentsClient({
      environment: "TEST", // Change to 'PRODUCTION' for live payments
    })

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example",
              gatewayMerchantId: "exampleGatewayMerchantId",
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: "12345678901234567890",
        merchantName: "Example Merchant",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: amount.toString(),
        currencyCode: currency.toUpperCase(),
      },
    }

    client
      .loadPaymentData(paymentDataRequest)
      .then((paymentData) => {
        onSuccess(paymentData.paymentMethodData.tokenizationData.token)
      })
      .catch((err) => {
        onError(err)
      })
  }

  return <Button onClick={handleGooglePay}>Pay with Google Pay</Button>
}

