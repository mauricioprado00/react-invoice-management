import { fixtureInvoicesPage, fixtureUserMe } from "cy-steps/api-steps";
import { visitInvoicesPage } from "cy-steps/invoice-steps";
import { paginationClickPage } from "cy-steps/page-steps";

describe("Invoice table sorting", () => {
  beforeEach(() => {
    fixtureUserMe();
    fixtureInvoicesPage();
  });
  it("will sort invoices by date", () => {
    fixtureInvoicesPage({ sort: { date: "asc" } });
    fixtureInvoicesPage({ sort: { date: "desc" } });
    visitInvoicesPage();

    // will sort desc
    cy.contains("Date").click();
    cy.contains("2021-01-01");

    // will sort asc
    cy.contains("Date").click();
    cy.contains("2022-04-29");

    // will sort by creation
    cy.contains("Date").click();
    cy.contains("2022-02-10");
  });

  it("will sort clients by company name", () => {
    fixtureInvoicesPage({ sort: { companyName: "asc" } });
    fixtureInvoicesPage({ sort: { companyName: "desc" } });
    visitInvoicesPage();

    // will sort asc
    cy.contains("Company").click();
    cy.contains("Accupharm");

    // will sort dess
    cy.contains("Company").click();
    cy.contains("Zytrex");

    // will sort by creation
    cy.contains("Company").click();
    cy.contains("Interfind");
  });

  it("will sort clients by due date", () => {
    fixtureInvoicesPage({ sort: { dueDate: "asc" } });
    fixtureInvoicesPage({ sort: { dueDate: "desc" } });
    visitInvoicesPage();

    // will sort asc
    cy.contains("Due").click();
    cy.contains("2021-01-03");

    // will sort dess
    cy.contains("Due").click();
    cy.contains("2022-04-29");

    // will sort by creation
    cy.contains("Due").click();
    cy.contains("2021-08-18");
  });

  it("will sort clients by value", () => {
    fixtureInvoicesPage({ sort: { price: "asc" } });
    fixtureInvoicesPage({ sort: { price: "desc" } });
    visitInvoicesPage();

    // will sort asc
    cy.contains("Value").click();
    cy.contains("$596.70");

    // will sort dess
    cy.contains("Value").click();
    cy.contains("$17676.10");

    // will sort by creation
    cy.contains("Value").click();
    cy.contains("$3730.80");
  });

  it("will multi-sort clients", () => {
    fixtureInvoicesPage({ sort: { date: "asc" } });
    fixtureInvoicesPage({
      sort: { date: "asc", dueDate: "asc" },
    });
    visitInvoicesPage();

    // will sort asc by date
    cy.contains("Date").click();

    // will sort asc by due date
    cy.contains("Due").click();

    cy.contains("Faulkner Hodges 20220327_123100");
  });

  it("will show the loading mask when click sort", () => {
    fixtureInvoicesPage({ sort: { date: "asc" }, delay: 5000 });

    visitInvoicesPage();

    cy.contains("Date").click();
    cy.get('[data-testid="loading-mask"]');
  });

  it("will show error if sort fails", () => {
    const body = "[testing] Some error happened while retrieving client page";
    fixtureInvoicesPage({
      sort: { date: "asc" },
      reply: { statusCode: 400, body },
    });

    visitInvoicesPage();

    cy.contains("Date").click();
    cy.contains("There are connectivity problems, we could not load the data");
    cy.contains(body);
  });
});

describe("Invoice table pagination", () => {
  beforeEach(() => {
    fixtureUserMe();
    fixtureInvoicesPage();
  });

  it("will load selected pages", () => {
    fixtureInvoicesPage({ p: 2 });
    fixtureInvoicesPage({ p: 46 });
    visitInvoicesPage();

    paginationClickPage(2);
    cy.contains("Campbell Dawson");

    paginationClickPage(46);
    cy.contains("Alexandria Cain");
  });

  it("will load page from url param", () => {
    fixtureInvoicesPage({ p: 46 });
    visitInvoicesPage({ page: "46" });

    cy.contains("Alexandria Cain");
  });

  it("will load sorted pages", () => {
    fixtureInvoicesPage({ p: 2 });
    fixtureInvoicesPage({ p: 2, sort: { companyName: "asc" } });

    visitInvoicesPage();

    paginationClickPage(2);
    cy.contains("Company").click();

    cy.contains("Balooba");
  });

  it("will show error if pagination fails", () => {
    const body = "[testing] Some error happened while retrieving client page";
    fixtureInvoicesPage({
      p: 2,
      reply: { statusCode: 400, body },
    });

    visitInvoicesPage();

    paginationClickPage(2);
    cy.contains("There are connectivity problems, we could not load the data");
    cy.contains(body);
  });
});

export {};
