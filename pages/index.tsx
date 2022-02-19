import type { NextPage } from 'next'
import ClientTable from 'components/views/client/ClientTable'
import InvoiceTable from 'components/views/invoice/InvoiceTable';
import { useEffect, useMemo, useState } from 'react';
import createClient from 'api/apiclient';
import { InvoiceList, InvoiceListN } from 'models/Invoice';
import store from 'store/configureStore'
import { Provider } from 'react-redux';
import { loadClients } from 'store/ClientSlice';

let client = createClient('//localhost:3139', '111');

const Home: NextPage = () => {
  const [userId, setUserId] = useState('111');
  const [invoices, setInvoices]: [InvoiceListN, any] = useState(null);
  useMemo(() => {client = createClient('//localhost:3139', userId)}, [userId])
  useEffect(() => {
    const dispatchLoadClientPromise = store.dispatch(loadClients());
    setInvoices(null);

    return client.abortAll(
      {
        abort: dispatchLoadClientPromise.abort.bind(dispatchLoadClientPromise)
      },
      client.getInvoices((invoices:InvoiceList) => setInvoices(invoices)),
    );
  }, [client]);

  return (
    <Provider store={store}>
      UserId: {userId}
      <button onClick={() => setUserId(userId => userId === '111' ? '222' : '111')}>Change User</button>
      <ClientTable />
      <InvoiceTable invoices={invoices} />
    </Provider>
  )
}

export default Home
