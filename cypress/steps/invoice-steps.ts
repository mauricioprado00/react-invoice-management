import moment, { isMoment } from "moment";
import invoice from "../../pages/invoice";

export const isInInvoicesPage = () => {
  cy.url().should("equal", "http://localhost:3000/invoices");
};

export const clickNewInvoiceButton = () =>
  cy.get("button").contains("New Invoice").click();

export const isInInvoiceAddPage = () => {
  cy.url().should("match", /\/invoice$/);
};

export const isInInvoiceEditionPage = () => {
  cy.url().should("match", /\/view-invoice\?id=[a-z0-9-]+/);
};

export const clickSaveInvoiceButton = () =>
  cy.get("button").contains("Save").click();

type InvoiceData = {
  invoice_number: string;
  projectCode: string;
  name: string;
  anyClient: boolean;
  address: string;
  regNumber: string;
  vatNumber: string;
  date: number;
  dueDate: number;
};

export const doFillInvoiceData = (
  invoiceData: Partial<InvoiceData>
): Partial<InvoiceData> => {
  const {
    invoice_number,
    projectCode,
    name,
    anyClient,
    date,
    dueDate,
    address,
    vatNumber,
    regNumber,
  } = invoiceData;
  const filled = { ...invoiceData };
  invoice_number &&
    cy
      .get('input[name="invoice_number"]')
      .click()
      .type("{selectall}")
      .type(invoice_number);
  projectCode &&
    cy
      .get('input[name="projectCode"]')
      .click()
      .type("{selectall}")
      .type(projectCode);
  date &&
    cy
      .get('input[name="date"]')
      .click()
      .type(moment(date).format("YYYY-MM-DD"));
  dueDate &&
    cy
      .get('input[name="dueDate"]')
      .click()
      .type(moment(dueDate).format("YYYY-MM-DD"));
  if (anyClient) {
    cy.get('[data-name="client_id"]').within(() => {
      cy.get("button").click();
      cy.get("ul li:last").click();
    });
  }
  name && cy.get('input[name="name"]').click().type("{selectall}").type(name);
  address && cy.get('input[name="address"]').click().type("{selectall}").type(address);
  vatNumber && cy.get('input[name="vatNumber"]').click().type("{selectall}").type(vatNumber);
  regNumber && cy.get('input[name="vatNumber"]').click().type("{selectall}").type(regNumber);

  cy.get('input[name="detail"]').click().type("{selectall}").type("testing");
  cy.get('input[name="quantity"]').click().type("{selectall}").type("3");
  cy.get('input[name="rate"]').click().type("{selectall}").type("50");

  cy.get('input[name="name"]')
    .invoke("val")
    .then(value => (filled.name = value?.toString()));
  cy.get('input[name="address"]')
    .invoke("val")
    .then(value => (filled.address = value?.toString()));
  cy.get('input[name="regNumber"]')
    .invoke("val")
    .then(value => (filled.regNumber = value?.toString()));
  cy.get('input[name="vatNumber"]')
    .invoke("val")
    .then(value => (filled.vatNumber = value?.toString()));
  cy.get('input[name="date"]')
    .invoke("val")
    .then(value => {
      if (value && isMoment(value)) {
        filled.date = moment(value).valueOf();
      }
    });
  cy.get('input[name="dueDate"]')
    .invoke("val")
    .then(value => {
      if (value) {
        if (value && isMoment(value)) {
          filled.dueDate = moment(value).valueOf();
        }
      }
    });

  return filled;
};

export const getValidInvoiceData = () => ({
  invoice_number:
    "ABC" + new Date().getTime() + "-" + (Math.random() * 100000).toFixed(0),
  projectCode: "TST" + (Math.random() * 100).toFixed(0),
  name: "John Doe",
  anyClient: true,
  address: "street av 123",
  regNumber: new Date().getTime().toString(),
  vatNumber: new Date().getTime().toString(),
  dueDate: moment().add((Math.random() * 10 + 5).toFixed(), "days").valueOf(),
  date: moment().add((Math.random() * 10 - 5).toFixed(), "days").valueOf(),
});

export const clickLastInvoicePage = () =>
  cy.get('button[aria-label*="Go to page"]:last').click();

type InvoiceInTableOptions = {
  extraColumns?: boolean;
};
export const invoiceIsInCurrentTablePage = (
  invoiceData: InvoiceData,
  options?: InvoiceInTableOptions
) => {
  console.log({ checkContainsInvoice: invoiceData });
  cy.contains("td", invoiceData.invoice_number)
    .parent()
    .within($tr => {
      if (options?.extraColumns) {
        cy.contains(invoiceData.name);
      }
      cy.contains(moment(invoiceData.dueDate).format("YYYY-MM-DD"));
      cy.contains(moment(invoiceData.date).format("YYYY-MM-DD"));
    });
};
