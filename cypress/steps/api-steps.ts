import { ClientList } from "models/Client";

const getParams = (params: Record<string, any>) => {
  return new URLSearchParams({ params: JSON.stringify(params) }).toString();
};
export const fixtureUserMe = () => {
  localStorage["userSlice.bearerToken"] = "testing";
  cy.intercept(
    {
      method: "GET",
      pathname: "**/me",
    },
    {
      statusCode: 200,
      fixture: "user/me.json",
    }
  ).as("UserMe");
};

export const fixtureClientAll = () => {
  cy.intercept("GET", "**/clients?" + getParams({ limit: 9999999 }) + "**", {
    statusCode: 200,
    fixture: "client/all-clients.json",
  }).as("ClientAll");
};

// pages without sorting nor filtering
export const fixtureInvoicesPage = (p: number) => {
  cy.intercept("GET", "**/invoices?" + getParams({ limit: 20 }), {
    statusCode: 200,
    fixture: `invoice/invoice-p${p}.json`,
  }).as(`InvoicePage${p}`);
};

export type FixtureClients = {
  clients: ClientList;
  total: number;
};

export const getFixtureClientAll = () =>
  cy.fixture<FixtureClients>("client/all-clients.json");

export const interceptClientAll = () =>
  cy
    .intercept({
      method: "GET",
      pathname: "/clients",
    })
    .as("ClientAll");

export const responseClientAll = () =>
  new Promise<FixtureClients>((resolve, reject) => {
    cy.wait("@ClientAll").then(interception => {
      if (interception.response) {
        resolve(interception.response.body);
      } else {
        reject();
      }
    });
  });
