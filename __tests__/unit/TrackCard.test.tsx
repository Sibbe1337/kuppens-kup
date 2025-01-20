import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import TrackCard from "@/components/TrackCard"

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

describe("TrackCard", () => {
  const mockTrack = {
    id: "1",
    title: "Test Track",
    artist: "Test Artist",
    duration: 180,
    price: 9.99,
    coverImage: "/test-cover.jpg",
  }

  it("renders track information correctly", () => {
    render(<TrackCard track={mockTrack} />)

    expect(screen.getByText("Test Track")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
    expect(screen.getByText("3:00")).toBeInTheDocument()
    expect(screen.getByText("$9.99")).toBeInTheDocument()
    expect(screen.getByAltText("Test Track")).toHaveAttribute("src", "/test-cover.jpg")
  })

  it("calls onLicense when license button is clicked", () => {
    const mockOnLicense = jest.fn()
    render(<TrackCard track={mockTrack} onLicense={mockOnLicense} />)

    const licenseButton = screen.getByText("License")
    licenseButton.click()

    expect(mockOnLicense).toHaveBeenCalledWith(mockTrack.id)
  })
})

