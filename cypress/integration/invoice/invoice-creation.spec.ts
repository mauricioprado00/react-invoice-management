import {
  fixtureClientAll,
  FixtureClients,
  fixtureInvoicesPage,
  fixtureUserMe,
  interceptClientAll,
  responseClientAll,
} from "cy-steps/api-steps";
import { isInDashboardPage } from "cy-steps/dashboard-steps";
import {
  clickInvoiceClientProfileButton,
  clickInvoiceInCurrentTablePage,
  clickLastInvoicePage,
  clickNewInvoiceButton,
  clickSaveInvoiceButton,
  doFillInvoiceData,
  getValidInvoiceData,
  invoiceIsInCurrentTablePage,
  invoiceIsInPrintPage,
  isInInvoiceAddPage,
  isInInvoiceEditionPage,
  isInInvoicesPage,
  visitInvoiceAddPage,
} from "cy-steps/invoice-steps";
import { givenUserIsLoggedIn } from "cy-steps/login-steps";
import {
  clickClientsMenu,
  clickDashboardMenu,
  clickInvoicesMenu,
} from "cy-steps/menu-steps";
import { Client } from "site-specific/models/Client";

const invoiceData = getValidInvoiceData();

describe("Invoice Creation", () => {
  before(() => {
    givenUserIsLoggedIn();
  });

  beforeEach(() => {
    interceptClientAll();
  });

  it.only("will show created invoice in the invoice list", async () => {
    clickInvoicesMenu();
    isInInvoicesPage();

    clickNewInvoiceButton();
    isInInvoiceAddPage();

    // pick any client from intercepted client api response
    const clientsResponse = await responseClientAll();
    let client = clientsResponse.clients.slice().pop();

    expect(client).not.to.be.null;
    client = client as Client;

    const filledInvoiceData = await doFillInvoiceData({
      ...invoiceData,
      ...{ clientId: client?.id },
    });
    clickSaveInvoiceButton();

    const savedInvoice = { ...invoiceData, ...filledInvoiceData };

    // invoice is visible in client profile "last invoices"
    clickInvoiceClientProfileButton();
    invoiceIsInCurrentTablePage(savedInvoice, { client });

    // invoice is visibile in last page of invoices listing page
    clickInvoicesMenu();
    isInInvoicesPage();

    clickLastInvoicePage();
    invoiceIsInCurrentTablePage(savedInvoice, { extraColumns: true, client });

    // invoice is visibile in dashboard "latest invoices" table
    clickDashboardMenu();
    isInDashboardPage();
    invoiceIsInCurrentTablePage(savedInvoice, { client });

    // clicking in the table will lead to print view
    clickInvoiceInCurrentTablePage(savedInvoice);
    isInInvoiceEditionPage();

    // invoice is displayed in the print view
    invoiceIsInPrintPage(savedInvoice);

    // client name and company name are shown
    cy.contains(client.name);
    cy.contains(client.companyDetails.name);
  });
});

describe("Invoice form validation", () => {
  const invoiceData = getValidInvoiceData({ amountDetails: 1 });
  beforeEach(() => {
    fixtureUserMe();
    fixtureClientAll();
    fixtureInvoicesPage({ p: 1 });
  });

  // check required fields
  ["invoice_number", "projectCode", "details"].forEach(field => {
    const invalidInvoiceData = { ...invoiceData };
    (invalidInvoiceData as Record<string, any>)[field] = undefined;
    it("field " + field + " is required to proceed", () => {
      visitInvoiceAddPage();
      doFillInvoiceData(invalidInvoiceData);
      clickSaveInvoiceButton();
      cy.contains("Your invoice has missing or incorrect data, please review");
      isInInvoiceAddPage();
    });
  });

  it("field client is required to proceed", () => {
    visitInvoiceAddPage();
    doFillInvoiceData({ ...invoiceData, anyClient: false });
    clickSaveInvoiceButton();
    cy.contains("Your invoice has missing or incorrect data, please review");
    isInInvoiceAddPage();
  });
});

describe("Api error handling", () => {
  const invoiceData = getValidInvoiceData({ amountDetails: 1 });

  it("will not proceed when invoice creation returns an error", () => {
    fixtureUserMe();
    fixtureClientAll();
    fixtureInvoicesPage({ p: 1 });
    const message = "Failed to create invoice";
    cy.intercept("POST", "**/invoices", {
      statusCode: 400,
      body: message,
    });

    visitInvoiceAddPage();
    doFillInvoiceData(invoiceData);
    clickSaveInvoiceButton();
    isInInvoiceAddPage();
    cy.contains("Could not save the invoice.");
    cy.contains(message);
  });

  it("Will show loading mask when clients are not loaded", () => {
    fixtureUserMe();
    fixtureClientAll(5000);

    visitInvoiceAddPage();
    cy.get('[data-testid="loading-mask"]');
  });

  it("Will now show page until user validation is done", () => {
    fixtureUserMe(5000);
    fixtureClientAll();

    visitInvoiceAddPage();
    cy.contains("loading");
  });
});

export {};
