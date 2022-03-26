import { fieldType } from "./form-steps";

export const visitLoginPage = () => {
  cy.visit("login");
};

export const isInLoginPage = () => {
  cy.url().should("match", /\/login$/);
};

export const doLogin = (email?: string, password?: string): void => {
  fieldType({ value: email, name: "email" });
  fieldType({ value: password, name: "password" });
  cy.get("button").contains("Sign In").click();
};

export const loginWithFullUser = () => {
  doLogin("fake_user1@officehourtesting.com", "123456");
};

export const givenUserIsLoggedIn = () => {
  visitLoginPage();
  loginWithFullUser();
};
