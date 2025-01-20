import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AnalyticsData {
  totalRevenue: number
  totalUsers: number
  totalTracks: number
  topTracks: Array<{ id: string; title: string; artist: string; plays: number }>
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await fetch('/api/admin/analytics')
  if (!response.ok) {
    throw new Error('Failed to fetch analytics')
  }
  return response.json()
}

export function Analytics() {
  const { data, isLoading, isError } = useQuery(['adminAnalytics'], fetchAnalytics)

  if (isLoading) return <div>Loading analytics...</div>
  if (isError) return <div>Error loading analytics</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${data.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalTracks}</p>
          </CardContent>
        </Card>
      </div>
      <h3 className="text-xl font-bold mb-2">Top Tracks</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Plays</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.topTracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell>{track.title}</TableCell>
              <TableCell>{track.artist}</TableCell>
              <TableCell>{track.plays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

