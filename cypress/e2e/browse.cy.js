describe("Browsing", () => {
  beforeEach(() => {
    // Log in before each test
    cy.login("test@example.com", "password123")
  })

  it("allows browsing tracks", () => {
    cy.visit("/tracks")
    cy.get('[data-testid="track-card"]').should("have.length.at.least", 1)
    cy.get('[data-testid="track-card"]').first().click()
    cy.url().should("include", "/tracks/")
    cy.contains("License")
  })

  it("allows browsing playlists", () => {
    cy.visit("/playlists")
    cy.get('[data-testid="playlist-card"]').should("have.length.at.least", 1)
    cy.get('[data-testid="playlist-card"]').first().click()
    cy.url().should("include", "/playlists/")
    cy.contains("Tracks")
  })
})

