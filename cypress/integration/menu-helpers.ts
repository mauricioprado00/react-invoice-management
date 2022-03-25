export const clickDashboardMenu = () =>
  cy.get("a").contains("Dashboard").click();
export const clickInvoicesMenu = () => cy.get("a").contains("Invoices").click();
export const clickClientsMenu = () => cy.get("a").contains("Clients").click();
export const clickLogoutMenu = () => cy.get("a").contains("Logout").click();
