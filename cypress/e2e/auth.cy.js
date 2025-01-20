describe("Authentication", () => {
  it("allows a user to register", () => {
    cy.visit("/register")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/dashboard")
    cy.contains("Welcome, test@example.com")
  })

  it("allows a user to log in", () => {
    cy.visit("/login")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/dashboard")
    cy.contains("Welcome, test@example.com")
  })
})

