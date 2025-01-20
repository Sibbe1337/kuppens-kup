import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { TrackPlayer } from "@/components/TrackPlayer"
import { PlaylistPlayer } from "@/components/PlaylistPlayer"

const prisma = new PrismaClient()

export default async function SharedContentPage({ params }: { params: { type: string; id: string } }) {
  let content
  if (params.type === "track") {
    content = await prisma.track.findUnique({ where: { id: params.id } })
  } else if (params.type === "playlist") {
    content = await prisma.playlist.findUnique({
      where: { id: params.id },
      include: { tracks: true },
    })
  }

  if (!content) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{params.type === "track" ? "Shared Track" : "Shared Playlist"}</h1>
      {params.type === "track" ? <TrackPlayer track={content} /> : <PlaylistPlayer playlist={content} />}
    </div>
  )
}

