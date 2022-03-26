export const visitLoginPage = () => {
  cy.visit("http://localhost:3000/login");
};

export const isInLoginPage = () => {
  cy.url().should("equal", "http://localhost:3000/login");
};

export const doLogin = (email?: string, password?: string): void => {
  email && cy.get('input[name="email"]').click().type(email);
  password && cy.get('input[name="password"]').click().type(password);
  cy.get("button").contains("Sign In").click();
};

export const loginWithFullUser = () => {
  doLogin("fake_user1@officehourtesting.com", "123456");
};

export const givenUserIsLoggedIn = () => {
  visitLoginPage();
  loginWithFullUser();
};
