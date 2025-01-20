export interface UserPreference {
  id: string
  userId: string
  genres: string[]
  moods: string[]
  minBpm: number
  maxBpm: number
  keys: string[]
  minEnergy: number
  maxEnergy: number
}

export interface ListeningHistoryItem {
  id: string
  userId: string
  trackId: string
  playedAt: Date
}

export interface User {
  id: string
  email: string
  role: string
  favorites: string[]
  createdAt: Date
  updatedAt: Date
  preferences?: UserPreference
  listeningHistory?: ListeningHistoryItem[]
}

