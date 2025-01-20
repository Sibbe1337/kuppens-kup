import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Track } from '@/types/track'

async function fetchTracks(): Promise<Track[]> {
  const response = await fetch('/api/admin/tracks')
  if (!response.ok) {
    throw new Error('Failed to fetch tracks')
  }
  return response.json()
}

async function createTrack(trackData: Partial<Track>): Promise<Track> {
  const response = await fetch('/api/admin/tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trackData),
  })
  if (!response.ok) {
    throw new Error('Failed to create track')
  }
  return response.json()
}

async function updateTrack(trackId: string, trackData: Partial<Track>): Promise<Track> {
  const response = await fetch(`/api/admin/tracks/${trackId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trackData),
  })
  if (!response.ok) {
    throw new Error('Failed to update track')
  }
  return response.json()
}

async function deleteTrack(trackId: string): Promise<void> {
  const response = await fetch(`/api/admin/tracks/${trackId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete track')
  }
}

export function TrackManagement() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [newTrack, setNewTrack] = useState<Partial<Track>>({})

  const { data: tracks, isLoading, isError } = useQuery(['adminTracks'], fetchTracks)

  const createTrackMutation = useMutation(createTrack, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTracks'])
      toast({ title: 'Track created successfully' })
      setNewTrack({})
    },
    onError: () => {
      toast({ title: 'Failed to create track', variant: 'destructive' })
    },
  })

  const updateTrackMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Track> }) => updateTrack(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adminTracks'])
        toast({ title: 'Track updated successfully' })
      },
      onError: () => {
        toast({ title: 'Failed to update track', variant: 'destructive' })
      },
    }
  )

  const deleteTrackMutation = useMutation(deleteTrack, {
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTracks'])
      toast({ title: 'Track deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete track', variant: 'destructive' })
    },
  })

  if (isLoading) return <div>Loading tracks...</div>
  if (isError) return <div>Error loading tracks</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Track Management</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createTrackMutation.mutate(newTrack)
        }}
        className="mb-8 space-y-4"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={newTrack.title || ''}
            onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="artist">Artist</Label>
          <Input
            id="artist"
            value={newTrack.artist || ''}
            onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
            required
          />
        </div>
        {/* Add more fields as needed */}
        <Button type="submit">Create Track</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell>{track.title}</TableCell>
              <TableCell>{track.artist}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    const newTitle = prompt('Enter new title', track.title)
                    if (newTitle) {
                      updateTrackMutation.mutate({ id: track.id, data: { title: newTitle } })
                    }
                  }}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this track?')) {
                      deleteTrackMutation.mutate(track.id)
                    }
                  }}
                  variant="destructive"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

