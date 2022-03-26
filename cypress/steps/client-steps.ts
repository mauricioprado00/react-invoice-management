import { fieldType } from "./form-steps";
import { getValidAddress, getValidCompany, getValidEmail, getValidProfileName, getValidRegNumber, getValidVatNumber } from "./profile-steps";

export const isInClientsPage = () => {
  cy.url().should("match", /\/clients$/);
};

export const clickNewClientButton = () =>
  cy.get("button").contains("New Client").click();

export const isInClientAddPage = () => {
  cy.url().should("match", /\/client$/);
};

export const isInClientEditionPage = () => {
  cy.url().should("match", /\/client\?id=[a-z0-9-]+/);
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
  fieldType({ value: name, name: "name" });
  fieldType({ value: email, name: "email" });
  fieldType({ value: companyName, name: "companyName" });
  fieldType({ value: address, name: "address" });
  fieldType({ value: regNumber, name: "regNumber" });
  fieldType({ value: vatNumber, name: "vatNumber" });
};

export const getValidClientProfile = () => ({
  name: getValidProfileName(),
  email: getValidEmail(),
  companyName: getValidCompany(),
  address: getValidAddress(),
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
