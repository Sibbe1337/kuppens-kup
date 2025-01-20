import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShareContent } from "./ShareContent"

interface PlaylistCardProps {
  playlist: {
    id: string
    name: string
    // ... other playlist properties
  }
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{playlist.name}</CardTitle>
        <CardDescription>Playlist</CardDescription>
      </CardHeader>
      <CardContent>{/* Playlist details */}</CardContent>
      <CardFooter className="flex justify-between">
        <Button>Play</Button>
        <ShareContent contentType="playlist" contentId={playlist.id} contentName={playlist.name} />
      </CardFooter>
    </Card>
  )
}

