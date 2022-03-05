import type { NextPage } from 'next'
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoClientDashboard, useGoDashboard, useParamClientId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import { useCallback } from 'react';
import { Client } from 'models/Client';

const Client: NextPage = () => {
    const clientId = useParamClientId();
    const goClientDashboard = useGoClientDashboard();
    const goDashboard = useGoDashboard();
    const goBack = useCallback((client:Client|null) => {
        if (client) {
            goClientDashboard(client.id);
        } else {
            goDashboard();
        }
    }, [goClientDashboard, goDashboard]);

    return <ClientEdition onCancel={goBack} onSave={goBack} clientId={clientId} />
}

export default AuthPageWithStore(Client)
