import type { NextPage } from 'next'
import { useParamClientId } from 'library/navigation';
import ClientShow from 'components/views/client/ClientShow';
import PageWithStore from 'components/utility/PageWithStore';

const ClientDashboard: NextPage = () => {
    const clientId = useParamClientId();

    return <ClientShow clientId={clientId} />
}

export default PageWithStore(ClientDashboard)
