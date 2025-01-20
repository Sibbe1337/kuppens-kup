import { Track } from '@/types/track'
import { User } from '@/types/user'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function fetchTracks(filters: string = ''): Promise<Track[]> {
  const response = await fetch(`${API_URL}/tracks?${filters}`)
  if (!response.ok) {
    throw new Error('Failed to fetch tracks')
  }
  return response.json()
}

export async function fetchTrack(id: string): Promise<Track> {
  const response = await fetch(`${API_URL}/tracks/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch track')
  }
  return response.json()
}

export async function fetchUserPurchases(userId: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/licenses/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user purchases')
  }
  return response.json()
}

export async function addToFavorites(userId: string, trackId: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/${userId}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trackId }),
  })
  if (!response.ok) {
    throw new Error('Failed to add track to favorites')
  }
}

export async function removeFromFavorites(userId: string, trackId: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/${userId}/favorites/${trackId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to remove track from favorites')
  }
}

export async function fetchUserFavorites(userId: string): Promise<Track[]> {
  const response = await fetch(`${API_URL}/user/${userId}/favorites`)
  if (!response.ok) {
    throw new Error('Failed to fetch user favorites')
  }
  return response.json()
}

export async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  return response.json()
}

