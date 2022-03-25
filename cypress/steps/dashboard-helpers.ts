export const isInDashboardPage = () => {
  cy.url().should("equal", "http://localhost:3000/");
};
