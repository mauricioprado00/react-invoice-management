
describe("User Signup", () => {
  const strongPass = "!Abcdef123@";

  const invalidPasswordTests = [
    [
      "dont allow password without alpha characters",
      "123456",
      "Must contain an aphabetic character.",
    ],
    [
      "dont allow password without uppercase alpha characters",
      "abc123456",
      "Must contain an uppercase letter.",
    ],
    [
      "dont allow password without lowercase alpha characters",
      "ABC123456",
      "Must contain an lowercase letter.",
    ],
    [
      "dont allow password without a number",
      "abcABCdefg",
      "Must contain a number.",
    ],
    [
      "dont allow password without a symbol",
      "abcABC123456",
      "Must contain a symbol.",
    ],
    [
      "dont allow passwords shorter than 8 characters",
      "abAB15!",
      "Must be contain at least 8 characters.",
    ],
  ];

  const clickDashboard = () => cy.get('a').contains('Dashboard').click();
  const clickInvoices = () => cy.get('a').contains('Invoices').click();
  const clickClients = () => cy.get('a').contains('Clients').click();
  const clickLogout = () => cy.get('a').contains('Logout').click();
  const isInProfileEdition = () => {
    cy.url().should("equal", "http://localhost:3000/update-profile");
  }
  const isInLogin = () => {
    cy.url().should("equal", "http://localhost:3000/login");
  }
  const isInProfile = () => {
    cy.url().should("equal", "http://localhost:3000/me");
  }
  const isInDashboard = () => {
    cy.url().should("equal", "http://localhost:3000/");
  }
  const isInInvoices = () => {
    cy.url().should("equal", "http://localhost:3000/invoices");
  }
  const isInClients = () => {
    cy.url().should("equal", "http://localhost:3000/clients");
  }

  const doValidRegistration = () => {
    const email = new Date().getTime() + "@officehourtesting.com";
    cy.visit("http://localhost:3000/get-started");

    cy.get('input[name="name"]').click().type("testing user");
    cy.get('input[name="email"]')
      .click()
      .type(email);
    cy.get('input[name="password"]').click().type(strongPass);
    cy.get('input[name="confirmPassword"]').click().type(strongPass);

    cy.get("button").contains("Register").click();
    isInProfileEdition();
    cy.get("h2").contains("Profile Edition");

    return email;
  };

  const fillProfile = () => {
    cy.get('input[name="companyName"]').click().type("ABC GmbH");
    cy.get('input[name="address"]').click().type('Street 123');
    cy.get('input[name="regNumber"]').click().type(new Date().getTime().toString());
    cy.get('input[name="vatNumber"]').click().type(new Date().getTime().toString());
    cy.get('input[name="iban"]').click().type('DE89370400440532013000');
    cy.get('input[name="swift"]').click().type('CTCBIDJASBY');
    cy.get("button").contains("Save").click();
  };

  const loginWith = (email:string, password:string) => {
    cy.get('input[name="email"]').click().type(email);
    cy.get('input[name="password"]').click().type(password);
    cy.get('button').contains('Sign In').click();
  }

  invalidPasswordTests.forEach(([name, password, message]) => {
    it(name, () => {
      cy.visit("http://localhost:3000/get-started");

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
    cy.get('.text-red').should('not.have.length', 0);
    
  });

  it("shouldnt allow to continue to other pages without filling profile", () => {
    const email = doValidRegistration();

    clickDashboard();
    isInProfileEdition();
    
    clickInvoices();
    isInProfileEdition();
    
    clickClients();
    isInProfileEdition();

    clickLogout();
    isInLogin();

    loginWith(email, strongPass);
    isInProfileEdition();

    clickDashboard();
    isInProfileEdition();
  })

  it("shouldnt allow to continue to other pages when profile is filled", () => {
    const email = doValidRegistration();

    isInProfileEdition();
    fillProfile();
    
    clickInvoices();
    isInInvoices();
    
    clickClients();
    isInClients();

    clickDashboard();
    isInDashboard();
    
  })
});

export {};
