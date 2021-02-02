describe('Shopping List app', function ()  {
  it('main page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Smart Shopping List')
    cy.contains('Create new list')
    cy.contains('Join an existing shopping list by entering a three word token')
  })

  it('user can create new list', function() {
    cy.get('button').contains('Create new list').click()
    cy.contains('Share your list with this token')
    cy.contains('Your shopping list is currently empty.')
    cy.get('button').contains('Add item')
  })
})