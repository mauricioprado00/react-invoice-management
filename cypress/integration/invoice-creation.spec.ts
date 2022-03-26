import { isInDashboardPage } from "../steps/dashboard-steps";
import {
  clickLastInvoicePage,
  clickNewInvoiceButton,
  clickSaveInvoiceButton,
  doFillInvoiceData,
  getValidInvoiceData,
  invoiceIsInCurrentTablePage,
  isInInvoiceAddPage,
  isInInvoicesPage,
} from "../steps/invoice-steps";
import { givenUserIsLoggedIn } from "../steps/login-steps";
import { clickDashboardMenu, clickInvoicesMenu } from "../steps/menu-steps";

const invoiceData = getValidInvoiceData();

describe("Invoice Creation", () => {
  before(() => {
    givenUserIsLoggedIn();
  });

  it("will show created invoice in the invoice list", () => {
    clickInvoicesMenu();
    isInInvoicesPage();

    clickNewInvoiceButton();
    isInInvoiceAddPage();

    doFillInvoiceData(invoiceData);
    clickSaveInvoiceButton();

    // invoice is visibile in last page of invoices listing page
    clickInvoicesMenu();
    isInInvoicesPage();

    clickLastInvoicePage();
    invoiceIsInCurrentTablePage(invoiceData);

    // invoice is visibile in dashboard "latest invoices" table
    clickDashboardMenu();
    isInDashboardPage();
    invoiceIsInCurrentTablePage(invoiceData);
  });
});

export {};
