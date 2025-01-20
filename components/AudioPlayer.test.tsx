import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { AudioPlayer } from './AudioPlayer'
import { PlaylistProvider } from '@/contexts/PlaylistContext'

// Mock WaveSurfer
jest.mock('wavesurfer.js', () => {
  return jest.fn().mockImplementation(() => ({
    load: jest.fn(),
    on: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    destroy: jest.fn(),
    setVolume: jest.fn(),
    setMuted: jest.fn(),
    seekTo: jest.fn(),
    getCurrentTime: jest.fn().mockReturnValue(0),
    getDuration: jest.fn().mockReturnValue(180),
  }))
})

describe('AudioPlayer', () => {
  const mockSrc = 'https://example.com/audio.mp3'
  const mockTitle = 'Test Audio'

  const renderAudioPlayer = () => {
    return render(
      <PlaylistProvider>
        <AudioPlayer src={mockSrc} title={mockTitle} />
      </PlaylistProvider>
    )
  }

  it('renders audio player with correct title', () => {
    renderAudioPlayer()
    expect(screen.getByText(mockTitle)).toBeInTheDocument()
  })

  it('toggles play/pause when button is clicked', () => {
    renderAudioPlayer()
    const playButton = screen.getByLabelText('Play')
    fireEvent.click(playButton)
    expect(screen.getByLabelText('Pause')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Pause'))
    expect(screen.getByLabelText('Play')).toBeInTheDocument()
  })

  it('mutes and unmutes audio when volume button is clicked', () => {
    renderAudioPlayer()
    const muteButton = screen.getByLabelText('Mute')
    fireEvent.click(muteButton)
    expect(screen.getByLabelText('Unmute')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Unmute'))
    expect(screen.getByLabelText('Mute')).toBeInTheDocument()
  })

  it('updates volume when slider is changed', () => {
    renderAudioPlayer()
    const volumeSlider = screen.getByLabelText('Volume')
    fireEvent.change(volumeSlider, { target: { value: '0.5' } })
    expect(volumeSlider).toHaveValue('0.5')
  })

  it('toggles loop when loop button is clicked', () => {
    renderAudioPlayer()
    const loopButton = screen.getByLabelText('Enable loop')
    fireEvent.click(loopButton)
    expect(screen.getByLabelText('Disable loop')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Disable loop'))
    expect(screen.getByLabelText('Enable loop')).toBeInTheDocument()
  })

  it('changes playback speed when speed option is selected', () => {
    renderAudioPlayer()
    fireEvent.click(screen.getByRole('combobox', { name: /playback speed/i }))
    fireEvent.click(screen.getByText('1.5x'))
    expect(screen.getByRole('combobox', { name: /playback speed/i })).toHaveTextContent('1.5x')
  })

  it('toggles fullscreen when fullscreen button is clicked', () => {
    renderAudioPlayer()
    const fullscreenButton = screen.getByLabelText('Enter full screen')
    fireEvent.click(fullscreenButton)
    expect(screen.getByLabelText('Exit full screen')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Exit full screen'))
    expect(screen.getByLabelText('Enter full screen')).toBeInTheDocument()
  })
})

