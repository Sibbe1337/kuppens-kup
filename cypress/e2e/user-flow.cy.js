describe('User Flow', () => {
  it('allows a user to browse tracks, license a track, and complete checkout', () => {
    // Visit the home page
    cy.visit('/')

    // Navigate to the music library
    cy.contains('Browse Tracks').click()

    // Search for a track
    cy.get('input[placeholder="Search tracks..."]').type('Rock')

    // Select the first track
    cy.get('.card').first().within(() => {
      cy.contains('License').click()
    })

    // Select a license type
    cy.get('input[type="radio"]').first().check()

    // Verify the license summary is displayed
    cy.contains('Selected License Summary').should('be.visible')

    // Proceed to checkout
    cy.contains('Proceed to Checkout').click()

    // Fill in email
    cy.get('input[type="email"]').type('test@example.com')
    cy.contains('Next').click()

    // Verify card element is displayed
    cy.get('#card-element').should('be.visible')

    // Fill in card details (using Stripe test card)
    cy.get('#card-element').within(() => {
      cy.fillElementsInput('cardNumber', '4242424242424242')
      cy.fillElementsInput('cardExpiry', '1225')
      cy.fillElementsInput('cardCvc', '123')
    })
    cy.contains('Next').click()

    // Verify order summary
    cy.contains('Order Summary').should('be.visible')

    // Complete the purchase
    cy.contains('Complete Purchase').click()

    // Verify success message
    cy.contains('Purchase Successful').should('be.visible')
  })
})

