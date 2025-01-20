import type { Track } from "@/types/track"
import { TrackList } from "@/components/track-list"
import { SearchBar } from "@/components/search-bar"
import { Header } from "@/components/header"

async function getTracks(): Promise<Track[]> {
  const tracks = await prisma.track.findMany()
  return tracks
}

export default async function HomePage() {
  const tracks = await getTracks()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <TrackList tracks={tracks} />
      </main>
    </div>
  )
}

