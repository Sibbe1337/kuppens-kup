describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("displays the main heading", () => {
    cy.get("h1").should("contain", "Music Licensing Platform")
  })

  it("allows searching for tracks", () => {
    cy.get('input[placeholder="Search tracks..."]').type("test track")
    cy.get("button").contains("Search").click()
    cy.get('[data-testid="track-card"]').should("have.length.greaterThan", 0)
  })

  it("navigates to the licensing page when a track is selected", () => {
    cy.get('[data-testid="track-card"]').first().click()
    cy.url().should("include", "/license")
  })
})

