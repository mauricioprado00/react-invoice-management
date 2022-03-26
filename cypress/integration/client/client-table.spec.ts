import { fixtureClientsPage, fixtureUserMe } from "cy-steps/api-steps";
import { visitClientsPage } from "cy-steps/client-steps";

describe("Sorting", () => {
  beforeEach(() => {
    fixtureUserMe();
    fixtureClientsPage();
  });
  it("will sort clients by name", () => {
    fixtureClientsPage({ sort: { clientName: "asc", creation: "asc" } });
    fixtureClientsPage({ sort: { clientName: "desc", creation: "asc" } });
    visitClientsPage();
    cy.contains("Client Name").click();
    cy.contains("Adkins Sosa");
    cy.contains("Client Name").click();
    cy.contains("Woods Hughes");
  });

  it("Will now show page until user validation is done", () => {});
});

export {};
