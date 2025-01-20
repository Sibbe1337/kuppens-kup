import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LicensingModal } from './LicensingModal'
import { Track } from '@/types/track'

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

jest.mock('./Checkout', () => ({
  Checkout: jest.fn(() => null),
}))

describe('LicensingModal', () => {
  it('renders licensing options correctly', () => {
    render(<LicensingModal track={mockTrack} isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('License "Test Track"')).toBeInTheDocument()
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('$19.99')).toBeInTheDocument()
  })

  it('displays selected license summary when a license is chosen', async () => {
    render(<LicensingModal track={mockTrack} isOpen={true} onClose={() => {}} />)

    fireEvent.click(screen.getByLabelText('Basic'))

    await waitFor(() => {
      expect(screen.getByText('Selected License Summary')).toBeInTheDocument()
      expect(screen.getByText('Track: Test Track')).toBeInTheDocument()
      expect(screen.getByText('License: basic')).toBeInTheDocument()
      expect(screen.getByText('Price: $9.99')).toBeInTheDocument()
    })
  })

  it('enables Proceed to Checkout button when a license is selected', () => {
    render(<LicensingModal track={mockTrack} isOpen={true} onClose={() => {}} />)

    const proceedButton = screen.getByText('Proceed to Checkout')
    expect(proceedButton).toBeDisabled()

    fireEvent.click(screen.getByLabelText('Basic'))
    expect(proceedButton).toBeEnabled()
  })

  it('opens Checkout component when Proceed to Checkout is clicked', async () => {
    render(<LicensingModal track={mockTrack} isOpen={true} onClose={() => {}} />)

    fireEvent.click(screen.getByLabelText('Basic'))
    fireEvent.click(screen.getByText('Proceed to Checkout'))

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
  })
})

