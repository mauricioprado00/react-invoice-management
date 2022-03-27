import { fixtureClientsPage, fixtureUserMe } from "cy-steps/api-steps";
import { visitClientsPage } from "cy-steps/client-steps";
import { paginationClickPage } from "cy-steps/page-steps";

describe("Client table sorting", () => {
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

  it("will multi-sort clients", () => {
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

  it("will show the loading mask when click sort", () => {
    fixtureClientsPage({ sort: { totalBilled: "asc" }, delay: 5000 });

    visitClientsPage();

    cy.contains("Total Billed").click();
    cy.get('[data-testid="loading-mask"]');
  });

  it("will show error if sort fails", () => {
    const body = "[testing] Some error happened while retrieving client page";
    fixtureClientsPage({
      sort: { totalBilled: "asc" },
      reply: { statusCode: 400, body },
    });

    visitClientsPage();

    cy.contains("Total Billed").click();
    cy.contains("There are connectivity problems, we could not load the data");
    cy.contains(body);
  });
});

describe("Client table pagination", () => {
  beforeEach(() => {
    fixtureUserMe();
    fixtureClientsPage();
  });

  it("will load selected pages", () => {
    fixtureClientsPage({ p: 2 });
    fixtureClientsPage({ p: 10 });
    visitClientsPage();

    paginationClickPage(2);
    cy.contains("Judy Hogan");

    paginationClickPage(10);
    cy.contains("Oneil Carroll");
  });

  it("will load page from url param", () => {
    fixtureClientsPage({ p: 10 });
    visitClientsPage({ page: "10" });

    cy.contains("Oneil Carroll");
  });

  it("will load sorted pages", () => {
    fixtureClientsPage({ p: 2 });
    fixtureClientsPage({ p: 2, sort: { companyName: "asc" } });

    visitClientsPage();

    paginationClickPage(2);
    cy.contains("Company Name").click();

    cy.contains("Richmond Shannon");
  });

  it("will load sorted pages from url parameters", () => {
    fixtureClientsPage({ p: 2, sort: { companyName: "asc" } });

    visitClientsPage({ page: "2", sort_company: "asc" });

    cy.contains("Richmond Shannon");
  });
  
  it.only("will show the loading mask when paginating", () => {
    fixtureClientsPage({ p: 2, delay: 5000 });

    visitClientsPage();

    paginationClickPage(2);
    cy.get('[data-testid="loading-mask"]');
  });


  it("will show error if pagination fails", () => {
    const body = "[testing] Some error happened while retrieving client page";
    fixtureClientsPage({
      p: 2,
      reply: { statusCode: 400, body },
    });

    visitClientsPage();

    paginationClickPage(2);
    cy.contains("There are connectivity problems, we could not load the data");
    cy.contains(body);
  });
});

export {};
