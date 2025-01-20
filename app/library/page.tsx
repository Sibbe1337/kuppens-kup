import { Suspense } from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchTracks } from '@/lib/queries'
import MusicLibraryContent from './MusicLibraryContent'
import { TrackSkeletonLoader } from '@/components/SkeletonLoader'

export const dynamic = 'force-dynamic'

export default async function MusicLibraryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const queryClient = new QueryClient()

  const filters = new URLSearchParams(searchParams as Record<string, string>).toString()
  await prefetchTracks(queryClient, filters)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MusicLibraryFallback />}>
        <MusicLibraryContent initialFilters={filters} />
      </Suspense>
    </HydrationBoundary>
  )
}

function MusicLibraryFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Music Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <TrackSkeletonLoader key={index} />
        ))}
      </div>
    </div>
  )
}

