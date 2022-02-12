import { Client } from './Client'

export type Invoice = {
  id: string
  user_id?: string
  invoice_number: string
  client_id: string
  date: number
  dueDate: number
  value: number
}

export type InvoiceN = null | Invoice
export type InvoiceList = Invoice[]
export type InvoiceListN = null | InvoiceList

export type ClientInvoice = {
  invoice: Invoice
  client: Client
}
