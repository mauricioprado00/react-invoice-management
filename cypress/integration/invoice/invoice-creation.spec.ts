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
import { clickDashboardMenu, clickInvoicesMenu } from "cy-steps/menu-steps";

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

    const clientsResponse = await responseClientAll();
    const client = clientsResponse.clients.slice().pop();

    const filledInvoiceData = await doFillInvoiceData({
      ...invoiceData,
      ...{ clientId: client?.id },
    });
    clickSaveInvoiceButton();

    const savedInvoice = { ...invoiceData, ...filledInvoiceData };

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
  });
});

describe("Invoice form validation", () => {
  const invoiceData = getValidInvoiceData({ amountDetails: 1 });
  beforeEach(() => {
    fixtureUserMe();
    fixtureClientAll();
    fixtureInvoicesPage(1);
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
  beforeEach(() => {
    fixtureUserMe();
    fixtureClientAll();
    fixtureInvoicesPage(1);
  });

  it("will not proceed when invoice creation returns an error", () => {
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
});

export {};
