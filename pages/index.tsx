import type { NextPage } from 'next'
import Dashboard from 'components/views/Dashboard';
import PageWithStore from 'components/utility/PageWithStore';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';

const Home: NextPage = () => {
  return <Dashboard />
}

export default AuthPageWithStore(Home)
