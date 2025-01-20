import { Suspense } from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchTrack } from '@/lib/queries'
import TrackDetailsContent from './TrackDetailsContent'
import { TrackSkeletonLoader } from '@/components/SkeletonLoader'

export const dynamic = 'force-dynamic'

export default async function TrackDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient()

  await prefetchTrack(queryClient, params.id)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<TrackDetailsFallback />}>
        <TrackDetailsContent id={params.id} />
      </Suspense>
    </HydrationBoundary>
  )
}

function TrackDetailsFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TrackSkeletonLoader />
    </div>
  )
}

