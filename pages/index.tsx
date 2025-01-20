import type { GetServerSideProps } from "next"
import type React from "react"
import prisma from "../lib/prisma"
import Search from "../components/Search"
import TrackCard from "../components/TrackCard"
import { Button } from "@/components/ui/button"

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  price: number
  coverImage: string
}

interface HomeProps {
  tracks: Track[]
}

const HomePage: React.FC<HomeProps> = ({ tracks }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Music Licensing Platform</h1>
          <div className="flex gap-4">
            <Button variant="outline">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Search />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tracks = await prisma.track.findMany()
  return { props: { tracks: JSON.parse(JSON.stringify(tracks)) } }
}

export default HomePage

