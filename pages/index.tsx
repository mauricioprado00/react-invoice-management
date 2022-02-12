import type { NextPage } from 'next'
import ClientTable from '../components/views/client/ClientTable'
import InvoiceTable from '../components/views/invoice/InvoiceTable';
import { useMemo, useState } from 'react';
import { ClientListN } from '../models/Client'
import createApi from './api/apiclient';
import { InvoiceListN } from '../models/Invoice';

let api = createApi('//localhost:3139', '111');

const Home: NextPage = () => {
  const [userId, setUserId] = useState('111');
  const [clients, setClients]: [ClientListN, any] = useState([]);
  const [invoices, setInvoices]: [InvoiceListN, any] = useState(null);
  useMemo(() => {api = createApi('//localhost:3139', userId)}, [userId])
  api.useGetClients((received, abort) => {
    setClients(null);
    received(clients => setClients(clients));
    return abort
  }, [api]);

  api.useGetInvoices((received, abort) => {
    setInvoices(null);
    received(invoices => setInvoices(invoices));
    return abort
  }, [api])

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
