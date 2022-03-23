import type { NextPage } from 'next'
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoBack, useGoClientDashboard, useParamId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';
import { useCallback } from 'react';
import { Client } from 'models/Client';

const ClientPage: NextPage = () => {
    const clientId = useParamId();
    const goClientDashboard = useGoClientDashboard();
    const goBack = useGoBack();
    const goViewSaved = useCallback((client:Client) => {
        goClientDashboard(client.id);
    }, [goClientDashboard]);

    return <ClientEdition onCancel={goBack} onSave={goViewSaved} clientId={clientId} />
}

export default AuthPageWithStore(ClientPage)
