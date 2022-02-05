import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'
import InvoiceTable from './components/InvoiceTable';

const Home: NextPage = () => {
  const randomItem = (items: Array<any>) => items[Math.floor(Math.random() * items.length)]
  const aCompany = ():string => randomItem(['Acme', 'Ibm', 'HP', 'Google', 'Ferry', 'Rempel', 'Sawayn'])
  const aName = ():string => randomItem(["Jane", "Anna", "Laura", "Loretta"])
  const aLastName = ():string => randomItem(["Smith", "Gomez", "Krombacher"])
  const anAmount = (minimum: number, maximum: number, center: number):number => parseInt(((Math.random() * (maximum - minimum) * ((center-minimum)/(maximum - minimum))) + minimum).toFixed(0))
  const aDate = (from:string, to:string):string => {
    let sFrom = (new Date(from)).getTime()
    let sTo = (new Date(to)).getTime()
    let date = new Date(anAmount(sFrom, sTo, (sFrom+sTo)/2))
    return date.toISOString().substring(0, 10)
  }

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
