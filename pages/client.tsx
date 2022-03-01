import type { NextPage } from 'next'
import store from 'store/configureStore'
import { Provider } from 'react-redux';
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoIndex, useParamClientId } from 'library/navigation';
import Page from 'components/ui/layout/Page';

const Client: NextPage = () => {
    const goIndex = useGoIndex();
    const clientId = useParamClientId();

    return (
        <Page>
            <ClientEdition onCancel={goIndex} onSave={goIndex} clientId={clientId} />
        </Page>
    )
}

const ClientPage = () => {
    return <>
        <Provider store={store}>
            <Client />
        </Provider>
    </>
}

export default ClientPage
