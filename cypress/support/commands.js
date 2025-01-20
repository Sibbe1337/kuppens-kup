Cypress.Commands.add('fillElementsInput', (field, value) => {
  cy.get(`[data-elements-stable-field-name="${field}"]`)
    .should('exist')
    .then(($input) => {
      if (Cypress.dom.isVisible($input)) {
        cy.wrap($input).type(value)
      } else {
        cy.wrap($input).invoke('val', value).trigger('change')
      }
    })
})

