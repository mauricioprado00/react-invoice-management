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
import Dashboard from 'components/views/Dashboard';
import Page from 'components/ui/layout/Page';

let client = createClient('//localhost:3139', '111');
enableMapSet();

const Home: NextPage = () => {
  return (
    <Provider store={store}>
      <Page>
        <Dashboard />
      </Page>
    </Provider>
  )
}

export default Home
