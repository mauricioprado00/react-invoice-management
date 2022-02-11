import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'
import InvoiceTable from './components/InvoiceTable';
import { generateInvoices } from '../library/lorem-ipsum';
import { useEffect, useState } from 'react';
import { ClientListN } from './models/Client'
import createApi from './api/apiclient';

const api = createApi('//localhost:3139');

const Home: NextPage = () => {
  const [clients, setClients]: [ClientListN, any] = useState(null);
  const invoices = generateInvoices(5);

  useEffect(() => {
    (async () => {
      setClients(await api.getClients())
    })()
    
  }, []);

  return (
    <>
      <ClientTable clients={clients} />
      <InvoiceTable invoices={invoices} />
    </>
  )
}

export default Home
