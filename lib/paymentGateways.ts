import { loadStripe } from "@stripe/stripe-js"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

export interface PaymentGateway {
  name: string
  component: React.ComponentType<PaymentMethodProps>
  initializePayment: (amount: number, currency: string) => Promise<{ clientSecret: string }>
}

export interface PaymentMethodProps {
  amount: number
  currency: string
  onSuccess: (paymentId: string) => void
  onError: (error: Error) => void
}

// Stripe Payment Gateway
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const StripeGateway: PaymentGateway = {
  name: "Stripe",
  component: StripePaymentMethod,
  initializePayment: async (amount: number, currency: string) => {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })
    const { clientSecret } = await response.json()
    return { clientSecret }
  },
}

// PayPal Payment Gateway
export const PayPalGateway: PaymentGateway = {
  name: "PayPal",
  component: PayPalPaymentMethod,
  initializePayment: async (amount: number, currency: string) => {
    // For PayPal, we don't need to create a client secret
    // We'll use the PayPal SDK to handle the payment flow
    return { clientSecret: "" }
  },
}

// Apple Pay Payment Gateway
export const ApplePayGateway: PaymentGateway = {
  name: "Apple Pay",
  component: ApplePayPaymentMethod,
  initializePayment: async (amount: number, currency: string) => {
    const response = await fetch("/api/create-apple-pay-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })
    const { clientSecret } = await response.json()
    return { clientSecret }
  },
}

// Google Pay Payment Gateway
export const GooglePayGateway: PaymentGateway = {
  name: "Google Pay",
  component: GooglePayPaymentMethod,
  initializePayment: async (amount: number, currency: string) => {
    const response = await fetch("/api/create-google-pay-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })
    const { clientSecret } = await response.json()
    return { clientSecret }
  },
}

export const availablePaymentGateways: PaymentGateway[] = [
  StripeGateway,
  PayPalGateway,
  ApplePayGateway,
  GooglePayGateway,
]

