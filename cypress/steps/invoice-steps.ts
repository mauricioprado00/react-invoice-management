import moment, { isMoment } from "moment";
import invoice from "../../pages/invoice";
import { fieldDateValue, fieldType, fieldValue } from "./form-steps";
import { getValidAddress, getValidProfileName, getValidRegNumber, getValidVatNumber } from "./profile-steps";

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

export const getValidInvoiceDate = () =>
  moment()
    .add((Math.random() * 10 + 5).toFixed(), "days")
    .valueOf();

export const getValidInvoiceDueDate = () =>
  moment()
    .add((Math.random() * 10 - 5).toFixed(), "days")
    .valueOf();
export const getValidInvoiceNumber = () =>
  "ABC" + new Date().getTime() + "-" + (Math.random() * 100000).toFixed(0);
export const getValidInvoiceProjectCode = () => "TST" + (Math.random() * 100).toFixed(0);

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

export const doFillInvoiceData = async (
  invoiceData: Partial<InvoiceData>
): Promise<Partial<InvoiceData>> => {
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
  fieldType({ value: invoice_number, name: "invoice_number" });
  fieldType({ value: projectCode, name: "projectCode" });
  fieldType({ value: date, name: "date", isDate: true });
  fieldType({ value: dueDate, name: "dueDate", isDate: true });
  if (anyClient) {
    cy.get('[data-name="client_id"]').within(() => {
      cy.get("button").click();
      cy.get("ul li:last").click();
    });
  }
  fieldType({ value: name, name: "name" });
  fieldType({ value: address, name: "address" });
  fieldType({ value: vatNumber, name: "vatNumber" });
  fieldType({ value: regNumber, name: "regNumber" });

  fieldType({ value: "testing", name: "detail" });
  fieldType({ value: "3", name: "quantity" });
  fieldType({ value: "50", name: "rate" });

  filled.name = await fieldValue("name");
  filled.address = await fieldValue("address");
  filled.regNumber = await fieldValue("regNumber");
  filled.vatNumber = await fieldValue("vatNumber");
  filled.date = await fieldDateValue("date");
  filled.dueDate = await fieldDateValue("dueDate");

  return filled;
};

export const getValidInvoiceData = () => ({
  invoice_number: getValidInvoiceNumber(),
  projectCode: getValidInvoiceProjectCode(),
  name: getValidProfileName(),
  anyClient: true,
  address: getValidAddress(),
  regNumber: getValidRegNumber(),
  vatNumber: getValidVatNumber(),
  dueDate: getValidInvoiceDate(),
  date: getValidInvoiceDueDate(),
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
