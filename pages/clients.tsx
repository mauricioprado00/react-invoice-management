import type { NextPage } from 'next'
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import Clients from 'components/views/client/Clients';

const ClientsPage: NextPage = () => {
  return <Clients />
}

export default AuthPageWithStore(ClientsPage)
