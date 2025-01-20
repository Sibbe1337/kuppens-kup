import React, { createContext, useContext, useState, useCallback } from 'react'
import { Track } from '@/types/track'

interface PlaylistContextType {
  playlist: Track[]
  currentTrackIndex: number
  setPlaylist: (tracks: Track[]) => void
  playTrack: (index: number) => void
  nextTrack: () => void
  previousTrack: () => void
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }
  return context
}

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylistState] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1)

  const setPlaylist = useCallback((tracks: Track[]) => {
    setPlaylistState(tracks)
    setCurrentTrackIndex(0)
  }, [])

  const playTrack = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentTrackIndex(index)
    }
  }, [playlist])

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length)
  }, [playlist])

  const previousTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length)
  }, [playlist])

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        currentTrackIndex,
        setPlaylist,
        playTrack,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

