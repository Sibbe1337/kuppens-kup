import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrackPreview } from './TrackPreview'
import { Track } from '@/types/track'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  genre: 'Rock',
  mood: 'Energetic',
  bpm: 120,
  key: 'C',
  energy: 80,
  duration: 180,
  platformLinks: {},
  previewUrl: 'https://example.com/preview.mp3',
  pricingTiers: {
    basic: 9.99,
    premium: 19.99,
  },
}

const queryClient = new QueryClient()

const renderWithQueryClient = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('TrackPreview', () => {
  it('renders track information correctly', () => {
    renderWithQueryClient(<TrackPreview track={mockTrack} />)

    expect(screen.getByText('Test Track')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
    expect(screen.getByText('Energetic')).toBeInTheDocument()
    expect(screen.getByText('120 BPM')).toBeInTheDocument()
    expect(screen.getByText('Key: C')).toBeInTheDocument()
    expect(screen.getByText('Energy: 80%')).toBeInTheDocument()
  })

  it('opens licensing modal when License button is clicked', () => {
    renderWithQueryClient(<TrackPreview track={mockTrack} />)

    fireEvent.click(screen.getByText('License'))
    expect(screen.getByText('License "Test Track"')).toBeInTheDocument()
  })

  it('toggles favorite status when heart button is clicked', () => {
    renderWithQueryClient(<TrackPreview track={mockTrack} />)

    const favoriteButton = screen.getByLabelText('Add Test Track to favorites')
    fireEvent.click(favoriteButton)
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(favoriteButton)
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false')
  })
})

