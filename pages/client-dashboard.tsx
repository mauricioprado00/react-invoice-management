import type { NextPage } from 'next'
import { useParamClientId } from 'library/navigation';
import ClientShow from 'components/views/client/ClientShow';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';

const ClientDashboardPage: NextPage = () => {
    const clientId = useParamClientId();

    return <ClientShow clientId={clientId} />
}

export default AuthPageWithStore(ClientDashboardPage)
