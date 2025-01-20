"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TrackCard } from "@/components/TrackCard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface RecommendedTrack {
  id: string
  title: string
  artist: string
  score: number
}

export default function RecommendationsPage() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (session) {
      fetchRecommendations()
    }
  }, [session])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/recommendations")
      if (!response.ok) throw new Error("Failed to fetch recommendations")
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch recommendations. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const trackRecommendationClick = async (trackId: string) => {
    try {
      await fetch("/api/analytics/track-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      })
    } catch (error) {
      console.error("Error tracking recommendation click:", error)
    }
  }

  if (loading) {
    return <div>Loading recommendations...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recommended for You</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={() => trackRecommendationClick(track.id)}
            onLicense={() => trackRecommendationClick(track.id)}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button onClick={fetchRecommendations}>Refresh Recommendations</Button>
      </div>
    </div>
  )
}

