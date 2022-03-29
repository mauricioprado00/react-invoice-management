import React, { FunctionComponent } from 'react'
import { Provider } from 'react-redux'
import store from 'store/configureStore'
import Page from './Page';

function PageWithStore(ChildComponent: FunctionComponent<{}>) {
    const component = () => {
        return (
            <Provider store={store}>
                <Page>
                    <ChildComponent />
                </Page>
            </Provider>
        )
    };

    component.displayName = 'PageWithStore';

    return component;
}

export default PageWithStore
