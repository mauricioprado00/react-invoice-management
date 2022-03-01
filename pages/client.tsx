import type { NextPage } from 'next'
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoIndex, useParamClientId } from 'library/navigation';
import PageWithStore from 'components/utility/PageWithStore';

const Client: NextPage = () => {
    const goIndex = useGoIndex();
    const clientId = useParamClientId();

    return <ClientEdition onCancel={goIndex} onSave={goIndex} clientId={clientId} />
}

export default PageWithStore(Client)
