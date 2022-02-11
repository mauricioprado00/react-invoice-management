import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'
import InvoiceTable from './components/InvoiceTable';
import { generateClients, generateInvoices } from '../library/lorem-ipsum';

const Home: NextPage = () => {
  const clients  = generateClients(5);
  const invoices = generateInvoices(5);


  return (
    <>
      <ClientTable clients={clients} />
      <InvoiceTable invoices={invoices} />
    </>
  )
}

export default Home
