'use client'

import React from 'react'
import { useTrack } from '@/lib/queries'
import { TrackPreview } from '@/components/TrackPreview'
import { useToast } from "@/hooks/use-toast"

export default function TrackDetailsContent({ id }: { id: string }) {
  const { data: track, isLoading, isError, error } = useTrack(id)
  const { toast } = useToast()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
    return <div>Error loading track details</div>
  }

  if (!track) {
    return <div>Track not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Track Details</h1>
      <TrackPreview track={track} />
    </div>
  )
}

