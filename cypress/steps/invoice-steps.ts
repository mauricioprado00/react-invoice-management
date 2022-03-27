import { Client } from "models/Client";
import moment from "moment";
import {
  fieldDateValue,
  fieldTextContent,
  fieldType,
  fieldValue,
} from "./form-steps";
import {
  getValidAddress,
  getValidProfileName,
  getValidRegNumber,
  getValidVatNumber,
} from "./profile-steps";

export const isInInvoicesPage = () => {
  cy.url().should("match", /\/invoices$/);
};

export const clickNewInvoiceButton = () =>
  cy.get("button").contains("New Invoice").click();

export const visitInvoiceAddPage = () => {
  cy.visit("invoice");
};

export const visitInvoicesPage = (params?: Record<string, string>) => {
  if (params) {
    const query = new URLSearchParams(params);
    cy.visit(`invoices?${query.toString()}`);
  } else {
    cy.visit("invoices");
  }
};

export const isInInvoiceAddPage = () => {
  cy.url().should("match", /\/invoice$/);
};

export const visitInvoiceEditionPage = (id: string) => {
  cy.visit(`view-invoice/invoice/${id}`);
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
export const getValidInvoiceProjectCode = () =>
  "TST" + (Math.random() * 100).toFixed(0);

export const getValidInvoiceDetailDetail = () =>
  "testing detail uuid" +
  new Date().getTime() +
  "-" +
  (Math.random() * 1000).toFixed(0);
export const getValidInvoiceDetailQuantity = () =>
  parseInt((Math.random() * 8).toString()) + 1;
export const getValidInvoiceDetailRate = () =>
  parseFloat((Math.random() * 1000).toFixed(2));

export const getValidInvoiceDetail = (): InvoiceDetail => {
  const detail: InvoiceDetail = {
    detail: getValidInvoiceDetailDetail(),
    quantity: getValidInvoiceDetailQuantity(),
    rate: getValidInvoiceDetailRate(),
    subtotal: 0,
  };

  detail.subtotal = parseFloat((detail.quantity * detail.rate).toFixed(2));

  return detail;
};

export const getValidInvoiceDetails = (amount?: number) => {
  amount = amount || Math.random() * 4 + 1;
  const amountNumber = parseInt(amount.toString());
  return new Array(amountNumber).fill(null).map(getValidInvoiceDetail);
};

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
  details: InvoiceDetail[];
  total: number;
  clientId: string;
};

type InvoiceDetail = {
  detail: string;
  quantity: number;
  rate: number;
  subtotal: number;
};

export const doFillInvoiceData = async (
  invoiceData: Partial<InvoiceData>
): Promise<Partial<InvoiceData>> => {
  const {
    invoice_number,
    projectCode,
    name,
    anyClient,
    clientId,
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
  if (anyClient || clientId) {
    cy.get('[data-name="client_id"]').within(() => {
      cy.get("button").click();
      if (clientId) {
        cy.get(`[data-clientid="${clientId}"]`).click();
      } else if (anyClient) {
        cy.get("ul li:last").click();
      }
    });
  }
  fieldType({ value: name, name: "name" });
  fieldType({ value: address, name: "address" });
  fieldType({ value: vatNumber, name: "vatNumber" });
  fieldType({ value: regNumber, name: "regNumber" });

  filled.details?.forEach(detail => {
    cy.get('tr:has(input[name="detail"])')
      .parent()
      .within(() => {
        cy.get("tr:last").within(() => {
          fieldType({ value: detail.detail, name: "detail" });
          fieldType({ value: detail.quantity, name: "quantity" });
          fieldType({ value: detail.rate, name: "rate" });
        });
      });
  });

  filled.name = await fieldValue("name");
  filled.address = await fieldValue("address");
  filled.regNumber = await fieldValue("regNumber");
  filled.vatNumber = await fieldValue("vatNumber");
  filled.date = await fieldDateValue("date");
  filled.dueDate = await fieldDateValue("dueDate");
  filled.clientId = await fieldTextContent(
    '[data-testid="client-selector"] button'
  );

  return filled;
};

type InvoiceDataGenerationOptions = {
  amountDetails?: number;
};

export const getValidInvoiceData = (options?: InvoiceDataGenerationOptions) => {
  const invoice = {
    invoice_number: getValidInvoiceNumber(),
    projectCode: getValidInvoiceProjectCode(),
    name: getValidProfileName(),
    anyClient: true,
    clientId: "",
    address: getValidAddress(),
    regNumber: getValidRegNumber(),
    vatNumber: getValidVatNumber(),
    dueDate: getValidInvoiceDate(),
    date: getValidInvoiceDueDate(),
    details: getValidInvoiceDetails(options?.amountDetails),
    total: 0,
  };

  invoice.details.forEach(detail => (invoice.total += detail.subtotal));
  return invoice;
};

export const clickLastInvoicePage = () =>
  cy.get('button[aria-label*="Go to page"]:last').click();

type InvoiceInTableOptions = {
  extraColumns?: boolean;
  client?: Client;
};
export const invoiceIsInCurrentTablePage = (
  invoiceData: InvoiceData,
  options?: InvoiceInTableOptions
) => {
  cy.contains("td", invoiceData.invoice_number)
    .parent()
    .within($tr => {
      if (options?.extraColumns) {
        cy.contains(invoiceData.name);
      }
      cy.contains(moment(invoiceData.dueDate).format("YYYY-MM-DD"));
      cy.contains(moment(invoiceData.date).format("YYYY-MM-DD"));
      if (options?.client) {
        cy.contains(options.client.companyDetails.name);
      }
    });
};

export const clickInvoiceInCurrentTablePage = (invoiceData: InvoiceData) => {
  cy.contains("td", invoiceData.invoice_number).click();
};

export const invoiceIsInPrintPage = (invoiceData: InvoiceData) => {
  cy.contains(invoiceData.name);
  cy.contains(invoiceData.address);
  cy.contains(invoiceData.regNumber);
  cy.contains(invoiceData.vatNumber);
  invoiceData.details.forEach(detail => {
    cy.contains("td", detail.detail)
      .parent()
      .within(() => {
        cy.contains(detail.quantity);
        cy.contains(detail.rate);
        // item subtotal is there
        cy.contains(detail.subtotal);
      });
  });
  cy.get(".amount-due").contains(invoiceData.total.toFixed(2));
};
