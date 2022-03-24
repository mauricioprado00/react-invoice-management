import { isInDashboardPage, isInProfileEditionPage } from "./signup.spec";

export const visitLoginPage = () => {
  cy.visit("http://localhost:3000/login");
}

export const doLogin = (email?:string, password?:string):void => {
  email && cy.get('input[name="email"]').click().type(email);
  password && cy.get('input[name="password"]').click().type(password);
  cy.get('button').contains('Sign In').click();
}

export const loginWithFullUser = () => {
  doLogin('fake_user1@officehourtesting.com', '123456')
}

describe("User login", () => {
  
  it("should navigate to the dashboard when profile is completed", () => {
    visitLoginPage()
    loginWithFullUser()
    isInDashboardPage();
    cy.get("h2").contains("Latest Clients");
  });

  it("should navigate to the profile edition when profile is not completed", () => {
    visitLoginPage()
    doLogin("user-without-completed-profile@officehourtesting.com", "123456")
    isInProfileEditionPage();
  });

  it("should give a warning when email is wrong", () => {
    visitLoginPage()
    doLogin('mywrongemail', '123456');
    cy.get('p.text-red').contains('wrong email');
  })

  it("should give a warning when password is not given", () => {
    visitLoginPage()
    doLogin("mywrongemail")
    cy.get('p.text-red').contains('Please fill out this field');
  })
});

export {}