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
};

export type InvoiceN = null | Invoice;
export type InvoiceList = Invoice[];
export type InvoiceListN = null | InvoiceList;

export type ClientInvoice = {
  invoice: Invoice;
  client: Client;
};

// React PropTypes definitions for components

export const InvoicePropType = {
  id: PropTypes.string,
  user_id: PropTypes.string,
  invoice_number: PropTypes.string,
  client_id: PropTypes.string,
  date: PropTypes.number,
  dueDate: PropTypes.number,
  company: PropTypes.string,
  value: PropTypes.number,
};
