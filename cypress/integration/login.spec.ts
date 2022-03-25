import { isInDashboardPage } from "./dashboard-helpers";
import { doLogin, loginWithFullUser, visitLoginPage } from "./login-helpers";
import { isInProfileEditionPage } from "./user-helpers";

describe("User login", () => {
  it("should navigate to the dashboard when profile is completed", () => {
    visitLoginPage();
    loginWithFullUser();
    isInDashboardPage();
    cy.get("h2").contains("Latest Clients");
  });

  it("should navigate to the profile edition when profile is not completed", () => {
    visitLoginPage();
    doLogin("user-without-completed-profile@officehourtesting.com", "123456");
    isInProfileEditionPage();
  });

  it("should give a warning when email is wrong", () => {
    visitLoginPage();
    doLogin("mywrongemail", "123456");
    cy.get("p.text-red").contains("wrong email");
  });

  it("should give a warning when password is not given", () => {
    visitLoginPage();
    doLogin("mywrongemail");
    cy.get("p.text-red").contains("Please fill out this field");
  });

  it("should show the error message given by the login API", () => {
    const message = "Invalid Credentials";
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: message
    })
    visitLoginPage();
    loginWithFullUser();
    cy.contains(message)
  })
});

export {};
