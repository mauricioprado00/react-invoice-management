import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'
import InvoiceTable from './components/InvoiceTable';
import { generateClients, generateInvoices } from '../library/lorem-ipsum';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  // const clients = generateClients(5);
  const [clients, setClients] = useState(null);
  const invoices = generateInvoices(5);

  useEffect(() => {
    (async () => {
      const fetchPromise = fetch('//localhost:3139/clients', {
        headers: {
          "Authorization": "Bearer 111",
        }
      });
      const httpResponse = await fetchPromise; 
      const jsonResponse = await httpResponse.json();
      setClients(jsonResponse.clients);
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
