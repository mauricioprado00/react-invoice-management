import type { NextPage } from 'next'
import ClientEdition from 'site-specific/components/sections/client/ClientEdition';
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import { useCallback } from 'react';
import { Client } from 'site-specific/models/Client';
import { useGoBack, useParamId } from 'hooks/use-url';
import { useRouter } from 'next/router';

const InvoiceClientPage: NextPage = () => {
    const clientId = useParamId();
    const goBack = useGoBack();
    const router = useRouter();
    const goViewSaved = useCallback((client: Client) => {
        router.push('/invoice?clientId=' + client.id)
    }, [router]);

    return <ClientEdition onCancel={goBack} onSave={goViewSaved} clientId={clientId} />
}

export default AuthPageWithStore(InvoiceClientPage)
