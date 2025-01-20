"use client"

import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { hotjar } from "react-hotjar"
import { generatePDFReport } from "@/lib/reportGenerator"

interface AnalyticsData {
  totalRevenue: number
  totalUsers: number
  totalTracks: number
  topTracks: Array<{ id: string; title: string; artist: string; plays: number }>
  eventCounts: Record<string, number>
  conversionRate: number
  abandonmentRate: number
  genrePerformance: Array<{ genre: string; _count: { purchases: number } }>
  moodPerformance: Array<{ mood: string; _count: { purchases: number } }>
  bpmPerformance: Array<{ bpm: number; _count: { purchases: number } }>
  revenueTiers: Array<{ licenseType: string; _sum: { price: number } }>
  revenueTimePeriods: Array<{ purchaseDate: string; _sum: { price: number } }>
  realTimeData: {
    activeSessions: number
    currentPlays: number
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await fetch("/api/admin/analytics")
  if (!response.ok) {
    throw new Error("Failed to fetch analytics")
  }
  return response.json()
}

export default function AnalyticsDashboard() {
  const { data, isLoading, isError } = useQuery(["adminAnalytics"], fetchAnalytics, {
    refetchInterval: 60000, // Refetch every minute
  })
  const [realTimeData, setRealTimeData] = useState({ activeSessions: 0, currentPlays: 0 })

  useEffect(() => {
    hotjar.initialize(process.env.NEXT_PUBLIC_HOTJAR_ID, 6)
  }, [])

  useEffect(() => {
    const ws = new WebSocket("wss://your-websocket-url.com")
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setRealTimeData(data)
    }
    return () => ws.close()
  }, [])

  if (isLoading) return <div>Loading analytics...</div>
  if (isError) return <div>Error loading analytics</div>

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.topTracks)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Top Tracks")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    saveAs(dataBlob, "analytics_report.xlsx")
  }

  const exportToPDF = () => {
    generatePDFReport(data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{(data.conversionRate * 100).toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Active Sessions: {realTimeData.activeSessions}</p>
            <p>Current Track Plays: {realTimeData.currentPlays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by License Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.revenueTiers}
                    dataKey="_sum.price"
                    nameKey="licenseType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.revenueTiers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Track Performance by Genre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.genrePerformance}>
                <XAxis dataKey="genre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="_count.purchases" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Track Performance by Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.moodPerformance}>
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="_count.purchases" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Track Performance by BPM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bpmPerformance}>
                <XAxis dataKey="bpm" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="_count.purchases" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueTimePeriods}>
                <XAxis dataKey="purchaseDate" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="_sum.price" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Tracks</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 mb-8">
        <Button onClick={exportToExcel}>Export to Excel</Button>
        <Button onClick={exportToPDF}>Export to PDF</Button>
      </div>
    </div>
  )
}

