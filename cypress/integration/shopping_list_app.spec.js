describe('Shopping List app', function ()  {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Smart Shopping List')
    cy.contains('Welcome!')
  })
})