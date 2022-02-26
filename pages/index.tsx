import type { NextPage } from 'next'
import ClientTable from 'components/views/client/ClientTable'
import InvoiceTable from 'components/views/invoice/InvoiceTable';
import { useEffect, useMemo, useState } from 'react';
import createClient from 'api/apiclient';
import store from 'store/configureStore'
import { Provider } from 'react-redux';
import { loadClients } from 'store/ClientSlice';
import { newBearerToken } from 'store/UserSlice';
import { enableMapSet } from 'immer';
import { loadClientInvoices } from 'store/InvoiceSlice';
import AddInvoice from 'components/views/invoice/AddInvoice';
import ClientEdition from 'components/views/client/ClientEdition';

let client = createClient('//localhost:3139', '111');
enableMapSet();

const Home: NextPage = () => {
  const [userId, setUserId] = useState('111');

  // simulate login
  useMemo(() => {
    client.newBearerToken(userId);
    store.dispatch(newBearerToken(userId))
  }, [userId])
  useEffect(() => {
    const loadClientPromise = store.dispatch(loadClients());
    const loadInvoicePromise = store.dispatch(loadClientInvoices());

    return client.abortAll(
      {
        abort: loadClientPromise.abort.bind(loadClientPromise)
      },
      {
        abort: loadInvoicePromise.abort.bind(loadInvoicePromise)
      },
    );
  }, [userId]);

  return (
    <Provider store={store}>
      UserId: {userId}
      <button onClick={() => setUserId(userId => userId === '111' ? '222' : '111')}>Change User</button>
      <ClientTable />
      <InvoiceTable />
      <AddInvoice />
      <ClientEdition />
    </Provider>
  )
}

export default Home
