
describe("Client Creation", () => {

});

export const loginWithUser = () => {
  cy.get('input[name="email"]').click().type("fake_user1@officehourtesting.com");
  cy.get('input[name="password"]').click().type("123456");
  cy.get('button').contains('Sign In').click();
}

export {};
