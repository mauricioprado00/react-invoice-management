import { isInDashboardPage } from "../steps/dashboard-helpers";
import {
  clickLastInvoicePage,
  clickNewInvoiceButton,
  clickSaveInvoiceButton,
  doFillClientInvoiceData,
  getValidInvoiceData,
  invoiceIsInCurrentTablePage,
  isInInvoiceAddPage,
  isInInvoicesPage,
} from "../steps/invoice-helpers";
import { givenUserIsLoggedIn } from "../steps/login-helpers";
import { clickDashboardMenu, clickInvoicesMenu } from "../steps/menu-helpers";

const invoiceData = getValidInvoiceData();

describe("Client Creation", () => {
  before(() => {
    givenUserIsLoggedIn();
  });

  it("will show created client in the client list", () => {
    clickInvoicesMenu();
    isInInvoicesPage();

    clickNewInvoiceButton();
    isInInvoiceAddPage();

    doFillClientInvoiceData(invoiceData);
    clickSaveInvoiceButton();

    // client is visibile in last page of clients listing page
    clickInvoicesMenu();
    isInInvoicesPage();

    clickLastInvoicePage();
    invoiceIsInCurrentTablePage(invoiceData);

    // client is visibile in dashboard "latest clients" table
    clickDashboardMenu();
    isInDashboardPage();
    invoiceIsInCurrentTablePage(invoiceData);
  });
});

export {};
