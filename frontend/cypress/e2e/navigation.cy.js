describe('Navigation Testing', () => {
  it('loads the homepage successfully', () => {
    cy.visit('/')
    // Verificar que algún elemento principal de la página de inicio esté presente.
    // Asumiendo que hay un header o un navbar, por ejemplo podemos buscar el logo o el título.
    // Puedes ajustar el selector según la estructura real de tu aplicación.
    cy.get('body').should('be.visible')
  })
})
