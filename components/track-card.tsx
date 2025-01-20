"use client"

import Image from "next/image"
import type { Track } from "@/types/track"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image src={track.coverImage || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{track.title}</h3>
        <p className="text-muted-foreground mb-2">{track.artist}</p>
        <p className="text-muted-foreground mb-2">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
        </p>
        <p className="text-lg font-bold">${track.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">License Track</Button>
      </CardFooter>
    </Card>
  )
}

