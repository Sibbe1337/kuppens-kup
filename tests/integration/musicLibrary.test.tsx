import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MusicLibraryContent from '@/app/library/MusicLibraryContent'

const mockTracks = [
  {
    id: '1',
    title: 'Rock Track',
    genre: 'Rock',
    mood: 'Energetic',
    duration: 180,
    platformLinks: {},
    previewUrl: 'https://example.com/rock.mp3',
    pricingTiers: { basic: 9.99, premium: 19.99 },
  },
  {
    id: '2',
    title: 'Pop Ballad',
    genre: 'Pop',
    mood: 'Sad',
    duration: 240,
    platformLinks: {},
    previewUrl: 'https://example.com/pop.mp3',
    pricingTiers: { basic: 7.99, premium: 15.99 },
  },
]

jest.mock('@/lib/queries', () => ({
  useTracks: () => ({ data: mockTracks, isLoading: false, isError: false }),
}))

const queryClient = new QueryClient()

describe('Music Library Integration', () => {
  it('allows browsing tracks and filtering results', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MusicLibraryContent initialFilters="" />
      </QueryClientProvider>
    )

    // Check if all tracks are initially displayed
    expect(screen.getByText('Rock Track')).toBeInTheDocument()
    expect(screen.getByText('Pop Ballad')).toBeInTheDocument()

    // Filter by genre
    fireEvent.click(screen.getByText('Select Genre'))
    fireEvent.click(screen.getByText('Rock'))

    await waitFor(() => {
      expect(screen.getByText('Rock Track')).toBeInTheDocument()
      expect(screen.queryByText('Pop Ballad')).not.toBeInTheDocument()
    })

    // Filter by mood
    fireEvent.click(screen.getByText('Select Mood'))
    fireEvent.click(screen.getByText('Sad'))

    await waitFor(() => {
      expect(screen.queryByText('Rock Track')).not.toBeInTheDocument()
      expect(screen.queryByText('Pop Ballad')).not.toBeInTheDocument()
    })

    // Search for a track
    fireEvent.change(screen.getByPlaceholderText('Search tracks...'), { target: { value: 'Pop' } })

    await waitFor(() => {
      expect(screen.queryByText('Rock Track')).not.toBeInTheDocument()
      expect(screen.getByText('Pop Ballad')).toBeInTheDocument()
    })
  })
})

