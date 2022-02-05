import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'
import InvoiceTable from './components/InvoiceTable';
import { aName, aLastName, aCompany, anAmount, aDate } from '../library/helpers'

const Home: NextPage = () => {
  const clients = new Array(5).fill(0).map((_, id) => ({
    id,
    clientName: aName() + " " + aLastName(),
    email: (aName() + "." + aLastName()).toLowerCase() + "@" + aCompany().toLowerCase() + ".com",
    companyDetails: {
      name: aCompany(),
      totalBilled: anAmount(3000, 10000, 5000)
    }
  }));
  const invoices = new Array(5).fill(0).map((_, id) => ({
    id,
    number: "Invoice#" + (Math.random() * 100000000).toFixed(0),
    company: aCompany(),
    value: anAmount(1000, 5000, 2000),
    dueDate: aDate('2020-01-01', '2021-01-01')
  }));


  return (
    <>
      <ClientTable clients={clients} />
      <InvoiceTable invoices={invoices} />
    </>
  )
}

export default Home
