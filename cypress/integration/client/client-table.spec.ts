import { fixtureClientsPage, fixtureUserMe } from "cy-steps/api-steps";
import { visitClientsPage } from "cy-steps/client-steps";

describe("Sorting", () => {
  beforeEach(() => {
    fixtureUserMe();
    fixtureClientsPage();
  });
  it("will sort clients by name", () => {
    fixtureClientsPage({ sort: { clientName: "asc" } });
    fixtureClientsPage({ sort: { clientName: "desc" } });
    visitClientsPage();

    // will sort desc
    cy.contains("Client Name").click();
    cy.contains("Adkins Sosa");

    // will sort asc
    cy.contains("Client Name").click();
    cy.contains("Woods Hughes");

    // will sort by creation
    cy.contains("Client Name").click();
    cy.contains("Shaw Ferrell");
  });

  it("will sort clients by company name", () => {
    fixtureClientsPage({ sort: { companyName: "asc" } });
    fixtureClientsPage({ sort: { companyName: "desc" } });
    visitClientsPage();

    // will sort asc
    cy.contains("Company Name").click();
    cy.contains("Accupharm");

    // will sort dess
    cy.contains("Company Name").click();
    cy.contains("Zytrex");

    // will sort by creation
    cy.contains("Company Name").click();
    cy.contains("Shaw Ferrell");
  });

  it("will sort clients by invoices count", () => {
    fixtureClientsPage({ sort: { invoicesCount: "asc" } });
    fixtureClientsPage({ sort: { invoicesCount: "desc" } });
    visitClientsPage();

    // will sort asc
    cy.get('[data-testid="table-header-column"]').contains("Invoices").click();
    cy.get('[data-testid="invoice-count"]').contains("0");

    // will sort dess
    cy.get('[data-testid="table-header-column"]').contains("Invoices").click();
    cy.get('[data-testid="invoice-count"]').contains("11");

    // will sort by creation
    cy.get('[data-testid="table-header-column"]').contains("Invoices").click();
    cy.get('[data-testid="invoice-count"]').contains("3");
  });

  it.only("will multi-sort clients", () => {
    fixtureClientsPage({ sort: { invoicesCount: "asc" } });
    fixtureClientsPage({ sort: { invoicesCount: "desc" } });
    fixtureClientsPage({ sort: { totalBilled: "asc", invoicesCount: "desc" } });
    fixtureClientsPage({
      sort: { totalBilled: "desc", invoicesCount: "desc" },
    });
    visitClientsPage();

    // will sort asc by total billed desc
    cy.get('[data-testid="table-header-column"]').contains("Invoices").click();
    cy.get('[data-testid="table-header-column"]').contains("Invoices").click();

    // will sort asc by total billed asc
    cy.contains("Total Billed").click();
    cy.contains("Meghan Hubbard");

    cy.contains("Total Billed").click();
    cy.contains("Petty Massey");
  });

  it("Will now show page until user validation is done", () => {});
});

export {};
