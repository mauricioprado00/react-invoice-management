
describe("User login", () => {
  
  it("should navigate to the dashboard when profile is completed", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]').click().type("fake_user1@officehourtesting.com");
    cy.get('input[name="password"]').click().type("123456");
    cy.get('button').contains('Sign In').click();
    cy.url().should("equal", "http://localhost:3000/");
    cy.get("h2").contains("Latest Clients");
  });

  it("should navigate to the profile edition when profile is not completed", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]').click().type("user-without-completed-profile@officehourtesting.com");
    cy.get('input[name="password"]').click().type("123456");
    cy.get('button').contains('Sign In').click();
    cy.url().should("equal", "http://localhost:3000/update-profile");
    cy.get("h2").contains("Profile Edition");
  });
});

export {}