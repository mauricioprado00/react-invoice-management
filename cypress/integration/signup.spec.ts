import { isInClientsPage } from "./client-helpers";
import { isInDashboardPage } from "./dashboard-helpers";
import { isInInvoicesPage } from "./invoice-helpers";
import { isInLoginPage } from "./login-helpers";
import { doLogin } from "./login.spec";
import {
  clickDashboardMenu,
  clickInvoicesMenu,
  clickClientsMenu,
  clickLogoutMenu,
} from "./menu-helpers";
import { doValidRegistration, invalidPasswordTests, strongPass, visitSignupPage } from "./signup-helpers";
import { fillUserProfile, isInProfileEditionPage } from "./user-helpers";


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

  it("shouldnt allow to continue to other pages when profile is filled", () => {
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
