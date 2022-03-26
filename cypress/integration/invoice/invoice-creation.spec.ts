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
} from "cy-steps/invoice-steps";
import { givenUserIsLoggedIn } from "cy-steps/login-steps";
import { clickDashboardMenu, clickInvoicesMenu } from "cy-steps/menu-steps";

const invoiceData = getValidInvoiceData();

describe("Invoice Creation", () => {
  before(() => {
    givenUserIsLoggedIn();
  });

  it("will show created invoice in the invoice list", async () => {
    clickInvoicesMenu();
    isInInvoicesPage();

    clickNewInvoiceButton();
    isInInvoiceAddPage();

    const filledInvoiceData = await doFillInvoiceData(invoiceData);
    clickSaveInvoiceButton();

    const savedInvoice = { ...invoiceData, ...filledInvoiceData };

    // invoice is visibile in last page of invoices listing page
    clickInvoicesMenu();
    isInInvoicesPage();

    clickLastInvoicePage();
    invoiceIsInCurrentTablePage(savedInvoice, { extraColumns: true });

    // invoice is visibile in dashboard "latest invoices" table
    clickDashboardMenu();
    isInDashboardPage();
    invoiceIsInCurrentTablePage(savedInvoice);

    // clicking in the table will lead to print view
    clickInvoiceInCurrentTablePage(savedInvoice);
    isInInvoiceEditionPage();

    // invoice is displayed in the print view
    invoiceIsInPrintPage(savedInvoice);
  });
});

export {};
