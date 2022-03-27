export const paginationClickLastPage = () =>
  cy.get('button[aria-label*="Go to page"]:last').click();

export const paginationGetPageButton = (page: number) =>
  cy.get(`button[aria-label="Go to page ${page}"]`);

export const paginationClickPage = (page: number) =>
  paginationGetPageButton(page).click();
