import type { NextPage } from 'next'
import ClientTable from '../components/views/client/ClientTable'
import InvoiceTable from '../components/views/invoice/InvoiceTable';
import { generateInvoices } from '../library/lorem-ipsum';
import { useState } from 'react';
import { ClientListN } from '../models/Client'
import createApi from './api/apiclient';
import { InvoiceListN } from '../models/Invoice';

let api = createApi('//localhost:3139', '111');

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0)
  const [clients, setClients]: [ClientListN, any] = useState(null);
  const [invoices, setInvoices]: [InvoiceListN, any] = useState(null);
  api.useGetClients((received, abort) => {
    api = createApi('//localhost:3139', counter % 2 ? '111' : '222')
    setClients(null);
    received(clients => setClients(clients));
    return abort
  }, [counter]);

  api.useGetInvoices((received, abort) => {
    setInvoices(null);
    received(invoices => setInvoices(invoices));
    return abort
  }, [])

  return (
    <>
      counter: {counter}
      <button onClick={() => setCounter(c => c + 1)}>more</button>
      <ClientTable clients={clients} />
      <InvoiceTable invoices={invoices} />
    </>
  )
}

export default Home
