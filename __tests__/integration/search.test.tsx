import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import Search from "@/components/Search"
import { searchTracks } from "@/api/tracks"

jest.mock("@/api/tracks")

describe("Search", () => {
  it("performs search and displays results", async () => {
    const mockSearchResults = [
      { id: "1", title: "Track 1", artist: "Artist 1" },
      { id: "2", title: "Track 2", artist: "Artist 2" },
    ]
    ;(searchTracks as jest.Mock).mockResolvedValue(mockSearchResults)

    render(<Search />)

    const searchInput = screen.getByPlaceholderText("Search tracks...")
    fireEvent.change(searchInput, { target: { value: "test search" } })

    const searchButton = screen.getByText("Search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText("Track 1 - Artist 1")).toBeInTheDocument()
      expect(screen.getByText("Track 2 - Artist 2")).toBeInTheDocument()
    })

    expect(searchTracks).toHaveBeenCalledWith("test search")
  })
})

