import type { NextPage } from 'next'
import ClientTable from './components/ClientTable'

const Home: NextPage = () => {
  const clients = new Array(5).fill(0).map(i => ({
    clientName: "Jane Cooper",
    email: "jane.cooper@example.com",
    companyDetails: {
      name: "Acme",
      totalBilled: parseInt(((Math.random() * (5000 * 2 - 3000) * 0.6) + 3000).toFixed(0))
    }
  }));
  return (
    <>
      <ClientTable clients={clients} />
    </>
  )
}

export default Home
