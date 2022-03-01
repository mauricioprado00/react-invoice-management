import type { NextPage } from 'next'
import Dashboard from 'components/views/Dashboard';
import PageWithStore from 'components/utility/PageWithStore';

const Home: NextPage = () => {
  return <Dashboard />
}

export default PageWithStore(Home)
