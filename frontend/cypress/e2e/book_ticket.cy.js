describe('Booking Flow - The Lord of the Rings', () => {
  it('buys the first available seat and completes checkout', () => {
    // 1. Visit the homepage
    cy.visit('/')

    // Wait for movies to load. Look for "The Lord of the Rings" in an h3 tag.
    // Clicking the h3 within the NuxtLink should trigger the navigation.
    cy.contains('h3', 'The Lord of the Rings', { timeout: 10000 }).click()

    // Wait for the backend to return occupied seats before selecting a seat
    cy.intercept('GET', '**/asientos-ocupados').as('getOccupiedSeats')

    // 2. We should now be on the seats selection page
    cy.url().should('include', '/asientos')
    cy.get('.screen-curve', { timeout: 10000 }).should('be.visible') // Wait for seats to render

    // Cypress is faster than the network. Wait until the occupied seats are identified and blocked!
    cy.wait('@getOccupiedSeats')

    // Find the first available seat within the seating grid and click it
    // Ensure we scope it to the .grid so we don't accidentally click nav bar buttons
    cy.get('.grid button').not('[disabled]').first().click()

    // 3. Proceed to Ticket Selection
    // The button says "Select Tickets"
    cy.contains('button', 'Select Tickets').click()

    // 4. We should now be on the tickets page
    cy.url().should('include', '/entradas')
    
    // Wait for the ticket selector to appear and select the 'adult' ticket type
    cy.get('select').first().should('be.visible').select('adult')

    // Proceed to payment
    cy.contains('button', 'Proceed to Payment').click()

    // 5. We should now be on the payment page
    cy.url().should('include', '/pago')

    // Fill the checkout form
    // Full Name
    cy.get('input[placeholder="Marcus Aurelius"]').type('John Doe Cypress')
    // Email Address
    cy.get('input[placeholder="marcus@rome.com"]').type('johndoe@cypress-test.io')
    // Card Number
    cy.get('input[placeholder="0000 0000 0000 0000"]').type('4242424242424242')
    // Expiry
    cy.get('input[placeholder="MM/YY"]').type('12/28')
    // CVV
    cy.get('input[placeholder="***"]').type('123')

    // Submit payment
    cy.contains('button', 'Pay Securely').click()

    // 6. Verify success confirmation
    // It should navigate to /reserva/[id]-confirmacion
    cy.url({ timeout: 15000 }).should('include', '-confirmacion')
    
    // Ensure that it reached confirmation correctly
    cy.contains(/Booking Confirmed|Payment Successful/i).should('exist')
  })
})
