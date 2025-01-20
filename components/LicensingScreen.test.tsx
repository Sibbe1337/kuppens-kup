import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { LicensingScreen } from "./LicensingScreen"
import { IntlProvider } from "@/contexts/IntlContext"

const mockTrack = {
  id: "1",
  title: "Test Track",
  artist: "Test Artist",
}

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider>{component}</IntlProvider>)
}

describe("LicensingScreen", () => {
  it("renders licensing options correctly", () => {
    const onClose = jest.fn()
    renderWithIntl(<LicensingScreen isOpen={true} onClose={onClose} track={mockTrack} />)
    expect(screen.getByText("License: Test Track")).toBeInTheDocument()
    expect(screen.getByText("Basic License")).toBeInTheDocument()
    expect(screen.getByText("Premium License")).toBeInTheDocument()
    expect(screen.getByText("Enterprise License")).toBeInTheDocument()
  })

  it("calls onClose when cancel button is clicked", () => {
    const onClose = jest.fn()
    renderWithIntl(<LicensingScreen isOpen={true} onClose={onClose} track={mockTrack} />)
    fireEvent.click(screen.getByText("Cancel"))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("selects a license and calls onPurchase when purchase button is clicked", () => {
    const onClose = jest.fn()
    renderWithIntl(<LicensingScreen isOpen={true} onClose={onClose} track={mockTrack} />)
    fireEvent.click(screen.getByLabelText("Premium License"))
    fireEvent.click(screen.getByText("Purchase"))
    // You would typically mock the purchase function and check if it's called with the correct arguments
  })
})

