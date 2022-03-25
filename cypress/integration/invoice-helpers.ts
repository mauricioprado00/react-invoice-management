export const isInInvoicesPage = () => {
  cy.url().should("equal", "http://localhost:3000/invoices");
};
