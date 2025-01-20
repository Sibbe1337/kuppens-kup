import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { TrackPreview } from "@/components/TrackPreview"
import type { Track } from "@/types/track"
import { useToast } from "@/hooks/use-toast"

async function fetchRecommendations(): Promise<Track[]> {
  const response = await fetch("/api/recommendations")
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations")
  }
  return response.json()
}

export function RecommendedTracks() {
  const { data: recommendedTracks, isLoading, isError } = useQuery(["recommendations"], fetchRecommendations)
  const { toast } = useToast()

  if (isLoading) return <div>Loading recommendations...</div>

  if (isError) {
    toast({
      title: "Error",
      description: "Failed to load recommendations. Please try again later.",
      variant: "destructive",
    })
    return null
  }

  if (!recommendedTracks || recommendedTracks.length === 0) {
    return <div>No recommendations available at the moment.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedTracks.map((track) => (
          <Card key={track.id}>
            <CardContent className="p-4">
              <TrackPreview track={track} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

