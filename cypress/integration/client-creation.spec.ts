import { clickLastClientPage, clickNewClientButton, clickSaveClientButton, clientIsInCurrentTablePage, doFillClientProfile, getValidClientProfile, isInClientAddPage, isInClientsPage } from "../steps/client-steps";
import { isInDashboardPage } from "../steps/dashboard-steps";
import { givenUserIsLoggedIn } from "../steps/login-steps";
import { clickClientsMenu, clickDashboardMenu } from "../steps/menu-steps";

const profile = getValidClientProfile();

describe("Client Creation", () => {
  

  before(() => {
    givenUserIsLoggedIn();
  })

  it("will show created client in the client list", () => {
    
    clickClientsMenu();
    isInClientsPage();
    
    clickNewClientButton();
    isInClientAddPage();
    
    doFillClientProfile(profile)
    clickSaveClientButton();
    
    // client is visibile in last page of clients listing page
    clickClientsMenu();
    isInClientsPage();

    clickLastClientPage();
    clientIsInCurrentTablePage(profile);

    // client is visibile in dashboard "latest clients" table
    clickDashboardMenu();
    isInDashboardPage();
    clientIsInCurrentTablePage(profile);
    
  })

  // check that all fields are required and user cannot create a client without it
  Object.keys(profile).forEach(field => {
    const invalidProfile = {...profile};
    (invalidProfile as Record<string, string>)[field] = '';
    it("field " + field + " is required to proceed", () => {

      clickClientsMenu();
      isInClientsPage();
      
      clickNewClientButton();
      isInClientAddPage();
      
      doFillClientProfile(invalidProfile)
      clickSaveClientButton();
      cy.contains('Please fill out this field.');
      isInClientAddPage();
    })
  })
});

describe("Field Validations", () => {
  before(() => {
    givenUserIsLoggedIn();

    clickClientsMenu();
    isInClientsPage();
    
    clickNewClientButton();
    isInClientAddPage();
  })

  beforeEach(() => {
    doFillClientProfile(profile)
  })

  it("wont allow an invalid email address", () => {
    doFillClientProfile({email: 'incomplete@gmail'});
    cy.contains('wrong email');
    clickSaveClientButton();
  })

  it("wont allow an invalid reg number", () => {
    doFillClientProfile({regNumber: "ABC123"});
    cy.contains('Please provide a valid Reg Number.');
    clickSaveClientButton();
  })

  it("wont allow an invalid vat number", () => {
    doFillClientProfile({vatNumber: "ABC123"});
    cy.contains('The Vat Number is not valid.');
    clickSaveClientButton();
  })

})

export {};
