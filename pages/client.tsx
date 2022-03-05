import type { NextPage } from 'next'
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoClientIdDashboard, useParamClientId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';

const Client: NextPage = () => {
    const clientId = useParamClientId();
    const goClientDashboard = useGoClientIdDashboard(clientId);

    return <ClientEdition onCancel={goClientDashboard} onSave={goClientDashboard} clientId={clientId} />
}

export default AuthPageWithStore(Client)
