"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { TrackPreview } from "@/components/TrackPreview"
import { useTracks } from "@/lib/queries"
import { useToast } from "@/hooks/use-toast"
import { debounce } from "lodash"
import { useAnalytics } from "@/hooks/useAnalytics"
import { RecommendedTracks } from "@/components/RecommendedTracks"

const TRACKS_PER_PAGE = 9

export default function MusicLibraryContent({ initialFilters }: { initialFilters: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: tracks, isLoading, isError, error } = useTracks(initialFilters)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [genre, setGenre] = useState(searchParams.get("genre") || "all")
  const [mood, setMood] = useState(searchParams.get("mood") || "all")
  const [bpmRange, setBpmRange] = useState([0, 200])
  const [key, setKey] = useState(searchParams.get("key") || "all")
  const [energyRange, setEnergyRange] = useState([0, 100])
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { toast } = useToast()
  const { trackEvent } = useAnalytics()

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      // Simulating API call for suggestions
      const allSuggestions = tracks?.map((track) => track.title) || []
      const filteredSuggestions = allSuggestions
        .filter((title) => title.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 5)
      setSuggestions(filteredSuggestions)

      // Track search event
      trackEvent("Search", { term, resultsCount: filteredSuggestions.length })
    }, 300),
    [tracks, trackEvent],
  )

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm)
    } else {
      setSuggestions([])
    }
  }, [searchTerm, debouncedSearch])

  useEffect(() => {
    const filters = new URLSearchParams()
    if (searchTerm) filters.set("search", searchTerm)
    if (genre !== "all") filters.set("genre", genre)
    if (mood !== "all") filters.set("mood", mood)
    if (bpmRange[0] > 0) filters.set("minBpm", bpmRange[0].toString())
    if (bpmRange[1] < 200) filters.set("maxBpm", bpmRange[1].toString())
    if (key !== "all") filters.set("key", key)
    if (energyRange[0] > 0) filters.set("minEnergy", energyRange[0].toString())
    if (energyRange[1] < 100) filters.set("maxEnergy", energyRange[1].toString())
    filters.set("page", currentPage.toString())
    router.push(`/library?${filters.toString()}`)

    // Track filter usage
    trackEvent("Apply Filters", {
      genre,
      mood,
      bpmRange,
      key,
      energyRange,
      page: currentPage,
    })
  }, [searchTerm, genre, mood, bpmRange, key, energyRange, currentPage, router, trackEvent])

  if (isError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  }

  const filteredTracks = tracks || []

  const pageCount = Math.ceil(filteredTracks.length / TRACKS_PER_PAGE)
  const paginatedTracks = filteredTracks.slice((currentPage - 1) * TRACKS_PER_PAGE, currentPage * TRACKS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Music Library</h1>
      <RecommendedTracks />
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">All Tracks</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6" role="search">
          <div className="w-full sm:w-auto sm:flex-grow relative">
            <label htmlFor="search-tracks" className="sr-only">
              Search tracks
            </label>
            <Input
              id="search-tracks"
              type="search"
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              aria-label="Search tracks"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(suggestion)
                      setSuggestions([])
                      trackEvent("Select Search Suggestion", { suggestion })
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="genre-select" className="sr-only">
              Select genre
            </label>
            <Select
              value={genre}
              onValueChange={(value) => {
                setGenre(value)
                trackEvent("Select Genre", { genre: value })
              }}
            >
              <SelectTrigger id="genre-select" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                {/* Add more genres as needed */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="mood-select" className="sr-only">
              Select mood
            </label>
            <Select
              value={mood}
              onValueChange={(value) => {
                setMood(value)
                trackEvent("Select Mood", { mood: value })
              }}
            >
              <SelectTrigger id="mood-select" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
                {/* Add more moods as needed */}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="bpm-range" className="block text-sm font-medium text-gray-700">
              BPM Range
            </label>
            <Slider
              id="bpm-range"
              min={0}
              max={200}
              step={1}
              value={bpmRange}
              onValueChange={(value) => {
                setBpmRange(value)
                trackEvent("Adjust BPM Range", { bpmRange: value })
              }}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{bpmRange[0]} BPM</span>
              <span>{bpmRange[1]} BPM</span>
            </div>
          </div>
          <div>
            <label htmlFor="key-select" className="block text-sm font-medium text-gray-700">
              Musical Key
            </label>
            <Select
              value={key}
              onValueChange={(value) => {
                setKey(value)
                trackEvent("Select Key", { key: value })
              }}
            >
              <SelectTrigger id="key-select" className="w-full mt-2">
                <SelectValue placeholder="Select Key" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Keys</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="C#">C#</SelectItem>
                <SelectItem value="D">D</SelectItem>
                {/* Add more keys as needed */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="energy-range" className="block text-sm font-medium text-gray-700">
              Energy Level
            </label>
            <Slider
              id="energy-range"
              min={0}
              max={100}
              step={1}
              value={energyRange}
              onValueChange={(value) => {
                setEnergyRange(value)
                trackEvent("Adjust Energy Range", { energyRange: value })
              }}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{energyRange[0]}%</span>
              <span>{energyRange[1]}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Track list">
          {paginatedTracks.map((track) => (
            <Card key={track.id}>
              <CardContent className="p-4">
                <TrackPreview track={track} />
              </CardContent>
            </Card>
          ))}
        </div>
        <nav className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4" aria-label="Pagination">
          <Button
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1))
              trackEvent("Pagination", { direction: "previous", newPage: Math.max(currentPage - 1, 1) })
            }}
            disabled={currentPage === 1}
            className="w-full sm:w-auto"
            aria-label="Previous page"
          >
            Previous
          </Button>
          <span className="text-center" aria-live="polite" aria-atomic="true">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              trackEvent("Pagination", { direction: "next", newPage: Math.min(currentPage + 1, pageCount) })
            }}
            disabled={currentPage === pageCount}
            className="w-full sm:w-auto"
            aria-label="Next page"
          >
            Next
          </Button>
        </nav>
      </div>
    </div>
  )
}

