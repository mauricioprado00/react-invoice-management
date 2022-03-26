import { fieldType } from "./form-steps";
import { getValidIban, getValidRegNumber, getValidSwift, getValidVatNumber } from "./profile-steps";

export const isInProfileEditionPage = () => {
  cy.url().should("match", /\/update-profile$/);
  cy.get("h2").contains("Profile Edition");
};
export const isInProfilePage = () => {
  cy.url().should("match", /\/me$/);
};

export const fillUserProfile = () => {
  fieldType({ value: "ABC GmbH", name: "companyName" });
  fieldType({ value: "Street 123", name: "address" });
  fieldType({ value: getValidVatNumber(), name: "vatNumber" });
  fieldType({ value: getValidRegNumber(), name: "regNumber" });
  fieldType({ value: getValidIban(), name: "iban" });
  fieldType({ value: getValidSwift(), name: "swift" });
  cy.get("button").contains("Save").click();
};
