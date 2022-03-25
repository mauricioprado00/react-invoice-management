export const isInProfileEditionPage = () => {
  cy.url().should("equal", "http://localhost:3000/update-profile");
  cy.get("h2").contains("Profile Edition");
};
export const isInProfilePage = () => {
  cy.url().should("equal", "http://localhost:3000/me");
};

export const fillUserProfile = () => {
  cy.get('input[name="companyName"]').click().type("ABC GmbH");
  cy.get('input[name="address"]').click().type("Street 123");
  cy.get('input[name="regNumber"]')
    .click()
    .type(new Date().getTime().toString());
  cy.get('input[name="vatNumber"]')
    .click()
    .type(new Date().getTime().toString());
  cy.get('input[name="iban"]').click().type("DE89370400440532013000");
  cy.get('input[name="swift"]').click().type("CTCBIDJASBY");
  cy.get("button").contains("Save").click();
};
