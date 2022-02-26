import type { NextPage } from 'next'
import store from 'store/configureStore'
import { Provider } from 'react-redux';
import ClientEdition from 'components/views/client/ClientEdition';
import { useGoIndex, useParamClientId } from 'library/navigation';

const Client: NextPage = () => {
    const goIndex = useGoIndex();
    const clientId = useParamClientId();

    return (
        <Provider store={store}>
            <ClientEdition onCancel={goIndex} onSave={goIndex} clientId={clientId}/>
        </Provider>
    )
}

export default Client
