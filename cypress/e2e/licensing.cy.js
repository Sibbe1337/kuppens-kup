describe("Licensing", () => {
  beforeEach(() => {
    cy.login("test@example.com", "password123")
  })

  it("allows purchasing a license", () => {
    cy.visit("/tracks")
    cy.get('[data-testid="track-card"]').first().click()
    cy.get('[data-testid="license-button"]').click()
    cy.get('[data-testid="license-option"]').first().click()
    cy.get('[data-testid="purchase-button"]').click()
    cy.get('[data-testid="payment-form"]').within(() => {
      cy.get('input[name="cardNumber"]').type("4242424242424242")
      cy.get('input[name="expDate"]').type("1225")
      cy.get('input[name="cvc"]').type("123")
      cy.get('button[type="submit"]').click()
    })
    cy.contains("License purchased successfully")
  })
})

