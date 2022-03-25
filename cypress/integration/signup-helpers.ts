import { isInProfileEditionPage } from "./user-helpers";

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

export const doValidRegistration = () => {
  const email = new Date().getTime() + "@officehourtesting.com";
  cy.visit("http://localhost:3000/get-started");

  cy.get('input[name="name"]').click().type("testing user");
  cy.get('input[name="email"]').click().type(email);
  cy.get('input[name="password"]').click().type(strongPass);
  cy.get('input[name="confirmPassword"]').click().type(strongPass);

  cy.get("button").contains("Register").click();
  isInProfileEditionPage();

  return email;
};

export const visitSignupPage = () => cy.visit("http://localhost:3000/get-started");