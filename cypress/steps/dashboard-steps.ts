export const isInDashboardPage = () => {
  cy.url().should("equal", Cypress.config().baseUrl);
};
