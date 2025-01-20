import type React from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  price: number
  coverImage: string
}

interface TrackCardProps {
  track: Track
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  return (
    <Card className="overflow-hidden" data-testid="track-card">
      <div className="relative aspect-square">
        <Image src={track.coverImage || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{track.title}</h3>
        <p className="text-muted-foreground mb-2">{track.artist}</p>
        <p className="text-muted-foreground mb-2">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
        </p>
        <p className="text-lg font-bold mb-4">${track.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">License Track</Button>
      </CardFooter>
    </Card>
  )
}

export default TrackCard

