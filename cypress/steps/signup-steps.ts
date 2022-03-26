import { fieldType } from "./form-steps";
import { isInProfileEditionPage } from "./user-steps";

export const strongPass = "!Abcdef123@";

export const invalidPasswordTests = [
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

export const inputValidRegistration = () => {
  const email = new Date().getTime() + "@officehourtesting.com";
  cy.visit("get-started");

  fieldType({ value: 'testing user', name: "name" });
  fieldType({ value: email, name: "email" });
  fieldType({ value: strongPass, name: "password" });
  fieldType({ value: strongPass, name: "confirmPassword" });

  cy.get("button").contains("Register").click();
  return email;
}

export const doValidRegistration = () => {
  const email = inputValidRegistration();
  isInProfileEditionPage();

  return email;
};

export const visitSignupPage = () => cy.visit("get-started");