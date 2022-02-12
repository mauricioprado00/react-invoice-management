import type { NextPage } from 'next'
import ClientTable from '../components/views/client/ClientTable'
import InvoiceTable from '../components/views/invoice/InvoiceTable';
import { generateInvoices } from '../library/lorem-ipsum';
import { useEffect, useState } from 'react';
import { ClientListN } from '../models/Client'
import createApi, { ignore } from './api/apiclient';

let api = createApi('//localhost:3139', '111');

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0)
  const [clients, setClients]: [ClientListN, any] = useState(null);
  const invoices = generateInvoices(5);

  useEffect(() => {
    api = createApi('//localhost:3139', counter % 2 ? '111' : '222')
    let request = api.getClients();
    setClients(null);
    request.promise.then(clients => {
      if (!request.controller.signal.aborted) setClients(clients)
    }).catch(ignore)

    return request.abort;
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
