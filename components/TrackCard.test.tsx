import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { TrackCard } from "./TrackCard"
import { IntlProvider } from "@/contexts/IntlContext"

const mockTrack = {
  id: "1",
  title: "Test Track",
  artist: "Test Artist",
  price: 9.99,
}

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider>{component}</IntlProvider>)
}

describe("TrackCard", () => {
  it("renders track information correctly", () => {
    renderWithIntl(<TrackCard track={mockTrack} />)
    expect(screen.getByText("Test Track")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
    expect(screen.getByText("$9.99")).toBeInTheDocument()
  })

  it("calls onPlay when play button is clicked", () => {
    const onPlay = jest.fn()
    renderWithIntl(<TrackCard track={mockTrack} onPlay={onPlay} />)
    fireEvent.click(screen.getByText("Play"))
    expect(onPlay).toHaveBeenCalledTimes(1)
  })

  it("calls onLicense when license button is clicked", () => {
    const onLicense = jest.fn()
    renderWithIntl(<TrackCard track={mockTrack} onLicense={onLicense} />)
    fireEvent.click(screen.getByText("License"))
    expect(onLicense).toHaveBeenCalledTimes(1)
  })
})

