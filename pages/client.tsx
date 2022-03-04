import type { NextPage } from 'next'
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoIndex, useParamClientId } from 'library/navigation';
import AuthPageWithStore from 'components/utility/AuthPageWithStore';

const Client: NextPage = () => {
    const goIndex = useGoIndex();
    const clientId = useParamClientId();

    return <ClientEdition onCancel={goIndex} onSave={goIndex} clientId={clientId} />
}

export default AuthPageWithStore(Client)
