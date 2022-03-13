import PropTypes from "prop-types";
import { Client } from "./Client";

// typescript types

export type Invoice = {
  id: string;
  user_id?: string;
  invoice_number: string;
  client_id: string;
  date: number;
  dueDate: number;
  value: number;
  projectCode?: string;
  meta?: Record<string, any>
};

export type InvoiceN = null | Invoice;
export type InvoiceList = Invoice[];
export type InvoiceListN = null | InvoiceList;

export type ClientInvoice = {
  invoice: Invoice;
  client: Client;
};

export type ClientInvoiceN = null | ClientInvoice;
export type ClientInvoiceList = ClientInvoice[];
export type ClientInvoiceListN = null | ClientInvoiceList

// React PropTypes definitions for components

export const InvoicePropTypes = {
  id: PropTypes.string,
  user_id: PropTypes.string,
  invoice_number: PropTypes.string.isRequired,
  client_id: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  dueDate: PropTypes.number.isRequired,
  company: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  projectCode: PropTypes.string,
  meta: PropTypes.object,
};
