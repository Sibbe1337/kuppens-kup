describe("Social Media Sharing", () => {
  beforeEach(() => {
    cy.login("test@example.com", "password123")
  })

  it("allows sharing a track on social media", () => {
    cy.visit("/tracks")
    cy.get('[data-testid="track-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="share-button"]').click()
      })
    cy.get('[data-testid="share-modal"]').should("be.visible")
    cy.get('[data-testid="facebook-share"]').should("be.visible")
    cy.get('[data-testid="twitter-share"]').should("be.visible")
    // Note: We can't actually test the sharing functionality due to browser security restrictions
    cy.get('[data-testid="share-link"]').should("not.be.empty")
  })
})

