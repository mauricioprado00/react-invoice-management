import type { NextPage } from 'next'
import ClientTable from 'components/views/client/ClientTable'
import InvoiceTable from 'components/views/invoice/InvoiceTable';
import { useEffect, useMemo, useState } from 'react';
import { ClientList, ClientListN } from 'models/Client'
import createClient from 'api/apiclient';
import { InvoiceList, InvoiceListN } from 'models/Invoice';
import store from 'store/configureStore'
import StoreContext from 'contexts/storeContext'
import {loadClients} from 'store/ClientsSlice'

let client = createClient('//localhost:3139', '111');

const Home: NextPage = () => {
  const [userId, setUserId] = useState('111');
  const [clients, setClients]: [ClientListN, any] = useState(null);
  const [invoices, setInvoices]: [InvoiceListN, any] = useState(null);
  store.dispatch(loadClients())
  useMemo(() => {client = createClient('//localhost:3139', userId)}, [userId])
  useEffect(() => {
    setClients(null);
    setInvoices(null);

    return client.abortAll(
      client.getInvoices((invoices:InvoiceList) => setInvoices(invoices)),
      client.getClients((clients:ClientList) => setClients(clients))
    );
  }, [client]);

  return (
    <StoreContext.Provider value={store.getState()}>
      UserId: {userId}
      <button onClick={() => setUserId(userId => userId === '111' ? '222' : '111')}>Change User</button>
      <ClientTable clients={clients} />
      <InvoiceTable invoices={invoices} />
    </StoreContext.Provider>
  )
}

export default Home
