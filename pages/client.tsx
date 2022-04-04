import type { NextPage } from 'next'
import ClientEdition from 'site-specific/components/sections/client/ClientEdition';
import { useGoClientDashboard } from 'site-specific/hooks/use-navigation';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import { useCallback } from 'react';
import { Client } from 'site-specific/models/Client';
import { useGoBack, useParamId } from 'hooks/use-url';

type ClientPageProps = {
    onSave: (client: Client) => void
};

const ClientPage: NextPage = ({ onSave }: ClientPageProps) => {
    const clientId = useParamId();
    const goClientDashboard = useGoClientDashboard();
    const goBack = useGoBack();
    const goViewSaved = useCallback((client:Client) => {
        goClientDashboard(client.id);
    }, [goClientDashboard]);

    return <ClientEdition onCancel={goBack} onSave={goViewSaved} clientId={clientId} />
}

export default AuthPageWithStore(ClientPage)
