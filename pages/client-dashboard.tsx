import type { NextPage } from 'next'
import store from 'store/configureStore'
import { Provider } from 'react-redux';
import { useGoIndex, useParamClientId } from 'library/navigation';
import ClientShow from 'components/views/client/ClientShow';

const ClientDashboard: NextPage = () => {
    const goIndex = useGoIndex();
    const clientId = useParamClientId();

    return (
        <Provider store={store}>
            <ClientShow clientId={clientId}/>
        </Provider>
    )
}

export default ClientDashboard
