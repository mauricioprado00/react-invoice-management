import type { NextPage } from 'next'
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import Clients from 'components/views/client/Clients';

const ClientsPage: NextPage = () => {
  return <Clients />
}

export default AuthPageWithStore(ClientsPage)
