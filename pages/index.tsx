import type { NextPage } from 'next'
import Dashboard from 'components/views/Dashboard';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';

const Home: NextPage = () => {
  return <Dashboard />
}

export default AuthPageWithStore(Home)
