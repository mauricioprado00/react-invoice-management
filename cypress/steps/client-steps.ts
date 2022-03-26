import { getValidRegNumber, getValidVatNumber } from "./profile-steps";

export const isInClientsPage = () => {
  cy.url().should("equal", "http://localhost:3000/clients");
};

export const clickNewClientButton = () =>
  cy.get("button").contains("New Client").click();

export const isInClientAddPage = () => {
  cy.url().should("equal", "http://localhost:3000/client");
};

export const isInClientEditionPage = () => {
  cy.url().should("contain", "http://localhost:3000/client/");
};

type Profile = {
  name: string;
  email: string;
  companyName: string;
  address: string;
  regNumber: string;
  vatNumber: string;
};

export const doFillClientProfile = ({
  name,
  email,
  address,
  companyName,
  regNumber,
  vatNumber,
}: Partial<Profile>) => {
  name && cy.get('input[name="name"]').click().type('{selectall}').type(name);
  email && cy.get('input[name="email"]').click().type('{selectall}').type(email);
  companyName && cy.get('input[name="companyName"]').click().type('{selectall}').type(companyName);
  address && cy.get('input[name="address"]').click().type('{selectall}').type(address);
  regNumber && cy.get('input[name="regNumber"]').click().type('{selectall}').type(regNumber);
  vatNumber && cy.get('input[name="vatNumber"]').click().type('{selectall}').type(vatNumber);
};

export const getValidClientProfile = () => ({
  name: "John Doe",
  email: new Date().getTime() + "@gmail.com",
  companyName: "ABC GmbH",
  address: "Street 123",
  regNumber: getValidVatNumber(),
  vatNumber: getValidRegNumber(),
});

export const clickSaveClientButton = () =>
  cy.get("button").contains("Save").click();

export const clickLastClientPage = () =>
  cy.get('button[aria-label*="Go to page"]:last').click();

export const clientIsInCurrentTablePage = (profile: Profile) => {
  cy.contains("td", profile.email)
    .parent() 
    .within($tr => {
        cy.contains(profile.name)
        cy.contains(profile.companyName)
    })
};
