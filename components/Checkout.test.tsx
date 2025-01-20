import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Checkout } from './Checkout'
import { Track } from '@/types/track'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({})),
}))

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  genre: 'Rock',
  mood: 'Energetic',
  duration: 180,
  platformLinks: {},
  previewUrl: 'https://example.com/preview.mp3',
  pricingTiers: {
    basic: 9.99,
    premium: 19.99,
  },
}

const renderCheckout = () => {
  return render(
    <Elements stripe={loadStripe('dummy_key')}>
      <Checkout track={mockTrack} licenseType="basic" isOpen={true} onClose={() => {}} />
    </Elements>
  )
}

describe('Checkout', () => {
  it('renders the first step of the checkout process', async () => {
    renderCheckout()

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })
  })

  it('validates email before proceeding to next step', async () => {
    renderCheckout()

    fireEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Invalid Email')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Credit or debit card')).toBeInTheDocument()
    })
  })

  it('displays order summary on the final step', async () => {
    renderCheckout()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Next'))
    })

    await waitFor(() => {
      expect(screen.getByText('Order Summary')).toBeInTheDocument()
      expect(screen.getByText('Track: Test Track')).toBeInTheDocument()
      expect(screen.getByText('License: basic')).toBeInTheDocument()
      expect(screen.getByText('Price: $9.99')).toBeInTheDocument()
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument()
    })
  })

  it('allows navigation between steps', async () => {
    renderCheckout()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Credit or debit card')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Back'))

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })
  })
})

