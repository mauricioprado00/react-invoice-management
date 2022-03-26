import { isInClientsPage } from "../steps/client-steps";
import { isInDashboardPage } from "../steps/dashboard-steps";
import { isInInvoicesPage } from "../steps/invoice-steps";
import { doLogin, isInLoginPage } from "../steps/login-steps";
import {
  clickDashboardMenu,
  clickInvoicesMenu,
  clickClientsMenu,
  clickLogoutMenu,
} from "../steps/menu-steps";
import { doValidRegistration, inputValidRegistration, invalidPasswordTests, strongPass, visitSignupPage } from "../steps/signup-steps";
import { fillUserProfile, isInProfileEditionPage } from "../steps/user-steps";


describe("User Signup", () => {
  invalidPasswordTests.forEach(([name, password, message]) => {
    it(name, () => {
      visitSignupPage();

      cy.get('input[name="name"]').click().type("testing user");
      cy.get('input[name="email"]')
        .click()
        .type(new Date().getTime() + "@officehourtesting.com");
      cy.get('input[name="password"]').click().type(password);
      cy.get('input[name="confirmPassword"]').click().type(password);

      cy.get("button").contains("Register").click();
      cy.get("p.text-red").contains(message);
    });
  });

  it("will display warning when user already exists", () => {
    const message = "Email already used by another account";
    cy.intercept('POST', '**/register', {
      statusCode: 400,
      body: message
    })
    inputValidRegistration();
    cy.contains(message)
  });

  it("should navigate to profile edition after registration", () => {
    doValidRegistration();
  });

  it("should not allow to continue without filling the profile", () => {
    doValidRegistration();
    cy.get("button").contains("Save").click();
    cy.get(".text-red").should("not.have.length", 0);
  });

  it("shouldnt allow to continue to other pages without filling profile", () => {
    const email = doValidRegistration();

    clickDashboardMenu();
    isInProfileEditionPage();

    clickInvoicesMenu();
    isInProfileEditionPage();

    clickClientsMenu();
    isInProfileEditionPage();

    clickLogoutMenu();
    isInLoginPage();

    doLogin(email, strongPass);
    isInProfileEditionPage();

    clickDashboardMenu();
    isInProfileEditionPage();
  });

  it("should allow to continue to other pages after profile is filled", () => {
    const email = doValidRegistration();

    isInProfileEditionPage();
    fillUserProfile();

    clickInvoicesMenu();
    isInInvoicesPage();

    clickClientsMenu();
    isInClientsPage();

    clickDashboardMenu();
    isInDashboardPage();
  });
});

export {};
