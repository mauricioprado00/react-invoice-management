import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'
import InvoiceTable from './components/InvoiceTable';
import { generateInvoices } from '../library/lorem-ipsum';
import { useEffect, useState } from 'react';
import { ClientListN } from './models/Client'
import createApi from './api/apiclient';

let api = createApi('//localhost:3139', '111');

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0)
  const [clients, setClients]: [ClientListN, any] = useState(null);
  const invoices = generateInvoices(5);

  useEffect(() => {
    api = createApi('//localhost:3139', counter % 2 ? '111' : '222')
    let result = api.getClients();

    (async () => {
      setClients(null);
      let clients = await result.promise;
      if (result.aborted === false)
        setClients(clients)
    })()

    return result.abort;
  }, [counter]);

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
