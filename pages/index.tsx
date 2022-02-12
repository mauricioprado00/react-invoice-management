import type { NextPage } from 'next'
import ClientTable from '../components/views/client/ClientTable'
import InvoiceTable from '../components/views/invoice/InvoiceTable';
import { useEffect, useMemo, useState } from 'react';
import { ClientListN } from '../models/Client'
import createClient from './api/apiclient';
import { InvoiceListN } from '../models/Invoice';

let client = createClient('//localhost:3139', '111');

const Home: NextPage = () => {
  const [userId, setUserId] = useState('111');
  const [clients, setClients]: [ClientListN, any] = useState([]);
  const [invoices, setInvoices]: [InvoiceListN, any] = useState(null);
  useMemo(() => {client = createClient('//localhost:3139', userId)}, [userId])
  useEffect(() => {
    setClients(null);
    setInvoices(null);

    return client.abortAll(
      client.getInvoices(invoices => setInvoices(invoices)),
      client.getClients(clients => setClients(clients))
    );
  }, [client]);

  return (
    <>
      UserId: {userId}
      <button onClick={() => setUserId(userId => userId === '111' ? '222' : '111')}>Change User</button>
      <ClientTable clients={clients} />
      <InvoiceTable invoices={invoices} />
    </>
  )
}

export default Home
