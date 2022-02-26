import type { NextPage } from 'next'
import store from 'store/configureStore'
import { Provider } from 'react-redux';
import { useParamClientId } from 'library/navigation';
import ClientShow from 'components/views/client/ClientShow';
import Page from 'components/ui/layout/Page';

const ClientDashboard: NextPage = () => {
    const clientId = useParamClientId();

    return (
        <Provider store={store}>
            <Page>
                <ClientShow clientId={clientId} />
            </Page>
        </Provider>
    )
}

export default ClientDashboard
