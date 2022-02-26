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
        <Provider store={store}>
            <Page>
                <ClientEdition onCancel={goIndex} onSave={goIndex} clientId={clientId} />
            </Page>
        </Provider>
    )
}

export default Client
