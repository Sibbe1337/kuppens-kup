"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Track } from "@/types/track"
import { LicensingModal } from "./LicensingModal"
import { useAuth } from "@/lib/AuthContext"
import { useAddToFavorites, useRemoveFromFavorites } from "@/lib/queries"
import { useToast } from "@/hooks/use-toast"
import { AudioPlayer } from "./AudioPlayer"
import { useLazyLoad } from "@/hooks/useLazyLoad"
import { usePlaylist } from "@/contexts/PlaylistContext"
import { useAnalytics } from "@/hooks/useAnalytics"
import { LicensingButtonAB } from "./LicensingButtonAB"

interface TrackPreviewProps {
  track: Track
  isFavorite?: boolean
}

export const TrackPreview: React.FC<TrackPreviewProps> = ({ track, isFavorite = false }) => {
  const [isLicensingModalOpen, setIsLicensingModalOpen] = useState(false)
  const { user } = useAuth()
  const [isInFavorites, setIsInFavorites] = useState(isFavorite)
  const { toast } = useToast()
  const { ref: imageRef, isVisible: isImageVisible } = useLazyLoad<HTMLDivElement>()
  const { ref: audioRef, isVisible: isAudioVisible } = useLazyLoad<HTMLDivElement>()
  const { setPlaylist, playTrack } = usePlaylist()
  const { trackEvent } = useAnalytics()

  const addToFavoritesMutation = useAddToFavorites()
  const removeFromFavoritesMutation = useRemoveFromFavorites()

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage your favorites.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isInFavorites) {
        await removeFromFavoritesMutation.mutateAsync({ userId: user.id, trackId: track.id })
        trackEvent("Remove from Favorites", { trackId: track.id })
      } else {
        await addToFavoritesMutation.mutateAsync({ userId: user.id, trackId: track.id })
        trackEvent("Add to Favorites", { trackId: track.id })
      }
      setIsInFavorites(!isInFavorites)
      toast({
        title: isInFavorites ? "Removed from Favorites" : "Added to Favorites",
        description: `${track.title} has been ${isInFavorites ? "removed from" : "added to"} your favorites.`,
      })
    } catch (error) {
      console.error("Failed to update favorites:", error)
      toast({
        title: "Error",
        description: `Failed to ${isInFavorites ? "remove from" : "add to"} favorites. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handlePlay = () => {
    setPlaylist([track])
    playTrack(0)
    trackEvent("Play Track", { trackId: track.id, title: track.title })
  }

  const handleLicenseClick = () => {
    setIsLicensingModalOpen(true)
    trackEvent("Open Licensing Modal", { trackId: track.id, title: track.title })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{track.title}</h2>
      <p className="text-sm text-gray-500">{track.artist}</p>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{track.genre}</span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{track.mood}</span>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{track.bpm} BPM</span>
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Key: {track.key}</span>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Energy: {track.energy}%</span>
      </div>
      <div ref={imageRef} className="relative aspect-video">
        {isImageVisible && (
          <Image
            src={track.imageUrl || `/placeholder.svg?height=200&width=300`}
            alt={`Album cover for ${track.title}`}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        )}
      </div>
      <div ref={audioRef}>{isAudioVisible && <AudioPlayer src={track.previewUrl} title={track.title} />}</div>
      <div className="flex justify-between mt-2">
        <Button onClick={handlePlay} aria-label={`Play ${track.title}`}>
          Play
        </Button>
        <LicensingButtonAB onClick={() => setIsLicensingModalOpen(true)} trackId={track.id} />
        <Button
          onClick={handleToggleFavorite}
          disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
          variant="outline"
          aria-pressed={isInFavorites}
          aria-label={isInFavorites ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
        >
          <Heart className={`h-4 w-4 mr-2 ${isInFavorites ? "fill-current" : ""}`} aria-hidden="true" />
          <span className="sr-only">{isInFavorites ? "Remove from Favorites" : "Add to Favorites"}</span>
          <span aria-hidden="true">
            {addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending
              ? "Updating..."
              : isInFavorites
                ? "Remove from Favorites"
                : "Add to Favorites"}
          </span>
        </Button>
      </div>
      <LicensingModal track={track} isOpen={isLicensingModalOpen} onClose={() => setIsLicensingModalOpen(false)} />
    </div>
  )
}

