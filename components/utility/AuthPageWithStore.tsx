import { useGoLogin } from 'library/navigation';
import React, { FunctionComponent, ReactNode } from 'react'
import { Provider } from 'react-redux';
import store from 'store/configureStore';
import { useInitLoggedFromStorage, useIsLoggedIn } from 'store/UserSlice';
import Page from '../ui/layout/Page';

type CheckAuthorizedUsersProps = {
    children: ReactNode,
}

function CheckAuthorizedUsers(props: CheckAuthorizedUsersProps) {
    const loggedIn = useIsLoggedIn();
    const goLogin = useGoLogin();
    const loading = loggedIn === null;
    useInitLoggedFromStorage();
    console.log({loggedIn})
    if (loggedIn === false) {
        goLogin();
    }

    return (<>
        {loading && 'loading'}
        {!loading && loggedIn && <Page>
            {props.children}
        </Page>}
    </>);
}

function AuthPageWithStore(ChildComponent: FunctionComponent<{}>) {
    const component = () => {
        return (
            <Provider store={store}>
                <CheckAuthorizedUsers>
                    <ChildComponent />
                </CheckAuthorizedUsers>
            </Provider>
        )
    };

    component.displayName = 'AuthPageWithStore';

    return component;
}

export default AuthPageWithStore
