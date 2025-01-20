import { useQuery, useMutation, useQueryClient, QueryClient, dehydrate } from '@tanstack/react-query'
import * as api from './api'
import { Track } from '@/types/track'
import { User } from '@/types/user'

export const trackKeys = {
  all: ['tracks'] as const,
  lists: () => [...trackKeys.all, 'list'] as const,
  list: (filters: string) => [...trackKeys.lists(), { filters }] as const,
  details: () => [...trackKeys.all, 'detail'] as const,
  detail: (id: string) => [...trackKeys.details(), id] as const,
}

export function useTracks(filters: string = '') {
  return useQuery({
    queryKey: trackKeys.list(filters),
    queryFn: () => api.fetchTracks(filters),
  })
}

export function useTrack(id: string) {
  return useQuery({
    queryKey: trackKeys.detail(id),
    queryFn: () => api.fetchTrack(id),
  })
}

export function useUserPurchases(userId: string) {
  return useQuery({
    queryKey: ['purchases', userId],
    queryFn: () => api.fetchUserPurchases(userId),
  })
}

export function useUserFavorites(userId: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => api.fetchUserFavorites(userId),
  })
}

export function useUserData(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.fetchUserData(userId),
  })
}

export function useAddToFavorites() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, trackId }: { userId: string; trackId: string }) =>
      api.addToFavorites(userId, trackId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
  })
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, trackId }: { userId: string; trackId: string }) =>
      api.removeFromFavorites(userId, trackId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
  })
}

export async function prefetchTracks(queryClient: QueryClient, filters: string = '') {
  await queryClient.prefetchQuery({
    queryKey: trackKeys.list(filters),
    queryFn: () => api.fetchTracks(filters),
  })
}

export async function prefetchTrack(queryClient: QueryClient, id: string) {
  await queryClient.prefetchQuery({
    queryKey: trackKeys.detail(id),
    queryFn: () => api.fetchTrack(id),
  })
}

