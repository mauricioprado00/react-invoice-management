import type { NextPage } from 'next'
import ClientEdition from 'site-specific/containers/client/ClientEdition';
import { useGoClientDashboard } from 'site-specific/hooks/use-navigation';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import { useCallback } from 'react';
import { Client } from 'models/Client';
import { useGoBack, useParamId } from 'hooks/use-url';

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
