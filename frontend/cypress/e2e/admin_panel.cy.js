describe('Admin Panel Flow', () => {
  beforeEach(() => {
    // Intercept the dashboard API
    cy.intercept('GET', '**/admin/dashboard', {
      statusCode: 200,
      body: {
        confirmed_purchases: 42,
        movies: [
          { id: 1, titulo: 'The Shawshank Redemption', sold_seats: 18 },
          { id: 8, titulo: 'The Lord of the Rings', sold_seats: 12 }
        ]
      }
    }).as('getDashboard')

    // Intercept the reports API
    cy.intercept('GET', '**/admin/reports', {
      statusCode: 200,
      body: {
        total_revenue: 1250.50,
        occupancy_rate: 37,
        total_seats_sold: 30,
        total_capacity: 80,
        revenue_by_ticket_type: [
          { tipo: 'estandard', revenue: 900.00, count: 20 },
          { tipo: 'vip', revenue: 350.50, count: 10 }
        ],
        sales_evolution: [
          { date: '2026-03-01', count: 5, revenue: 62.50 },
          { date: '2026-03-02', count: 8, revenue: 100.00 }
        ]
      }
    }).as('getReports')

    // Intercept the realtime state API
    cy.intercept('GET', '**/admin/state', {
      statusCode: 200,
      body: {
        global: { totalConnected: 5, totalLocked: 2 },
        rooms: []
      }
    }).as('getRealtimeState')
  })

  it('visits Detailed Reports, returns to home, views The Lord of the Rings, then re-enters Detailed Reports', () => {
    // ─────────────────────────────────────────────────────
    // STEP 1: Navigate to the homepage and activate admin mode
    // by clicking on the admin toggle button in the navbar
    // ─────────────────────────────────────────────────────
    cy.visit('/')

    // The navbar has an .admin-toggle-btn button that toggles isAdmin state
    // and auto-navigates to /admin once activated
    cy.get('.admin-toggle-btn').click()

    // Should now be on /admin and the dashboard API should fire
    cy.url({ timeout: 10000 }).should('include', '/admin')
    cy.wait('@getDashboard', { timeout: 10000 })

    // Verify the dashboard renders
    cy.contains('Admin Dashboard').should('be.visible')
    cy.contains('Active Users').should('be.visible')
    cy.contains('Locked Seats').should('be.visible')
    cy.contains('Confirmed Purchases').should('be.visible')

    // ─────────────────────────────────────────────────────
    // STEP 2: Click "Detailed Reports" and verify the page
    // ─────────────────────────────────────────────────────
    cy.contains('Detailed Reports').click()
    cy.url().should('include', '/admin/informes')
    cy.wait('@getReports', { timeout: 10000 })

    cy.contains('Detailed Reports').should('be.visible')
    cy.contains('Total Revenue').should('be.visible')
    cy.contains('Global Occupancy Rate').should('be.visible')
    cy.contains('Revenue By Ticket Type').should('be.visible')
    cy.contains('Sales Evolution').should('be.visible')

    // ─────────────────────────────────────────────────────
    // STEP 3: Exit via back arrow → return to /admin dashboard
    // ─────────────────────────────────────────────────────
    cy.get('a[href="/admin"]').first().click()
    cy.url().should('include', '/admin')
    cy.contains('Admin Dashboard').should('be.visible')

    // ─────────────────────────────────────────────────────
    // STEP 4: Deactivate admin mode and go to homepage
    // Then click on "The Lord of the Rings" movie
    // ─────────────────────────────────────────────────────
    // Click the toggle again to exit admin mode (it navigates to /)
    cy.get('.admin-toggle-btn').click()
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/')

    // Wait for movies to load on homepage
    cy.contains('h3', 'The Lord of the Rings', { timeout: 10000 }).should('be.visible')

    // Click the movie card
    cy.contains('h3', 'The Lord of the Rings').click()
    cy.url({ timeout: 10000 }).should('include', '/asientos')

    // Verify the seat selection map renders
    cy.get('.screen-curve', { timeout: 10000 }).should('be.visible')

    // ─────────────────────────────────────────────────────
    // STEP 5: Enable admin mode again and go back to Detailed Reports
    // ─────────────────────────────────────────────────────
    cy.get('.admin-toggle-btn').click()
    cy.url({ timeout: 10000 }).should('include', '/admin')
    cy.wait('@getDashboard', { timeout: 10000 })

    // Navigate to Detailed Reports
    cy.contains('Detailed Reports').click()
    cy.url().should('include', '/admin/informes')
    cy.wait('@getReports', { timeout: 10000 })

    // Verify the reports page loaded
    cy.contains('Detailed Reports').should('be.visible')
    cy.contains('Total Revenue').should('be.visible')
    cy.contains('estandard').should('be.visible')
    cy.contains('vip').should('be.visible')
  })
})
