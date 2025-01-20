/// <reference types="cypress" />

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
    // Add assertions for search results when implemented
  })

  it("displays track cards", () => {
    cy.get('[data-testid="track-card"]').should("have.length.at.least", 1)
  })
})

