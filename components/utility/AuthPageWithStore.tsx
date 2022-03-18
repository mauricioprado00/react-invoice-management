import { useGoEditMe, useGoLogin, useIsEditMe } from 'library/navigation';
import React, { FunctionComponent, ReactNode } from 'react'
import { Provider } from 'react-redux';
import store from 'store/configureStore';
import { useInitLoggedFromStorage, useIsLoggedIn, useIsProfileFilled, useMeLoading } from 'store/UserSlice';
import Page from '../ui/layout/Page';

type CheckProps = {
    children: ReactNode,
}

function CheckAuthorizedUsers(props: CheckProps) {
    const loggedIn = useIsLoggedIn();
    const goLogin = useGoLogin();
    const loading = loggedIn === null;
    useInitLoggedFromStorage();
    if (loggedIn === false) {
        goLogin();
    }

    return (<>
        {loading && 'loading'}
        {!loading && loggedIn && <>
            {props.children}
        </>}
    </>);
}

function CheckProfileIsFilled(props:CheckProps) {
    const isProfileFilled = useIsProfileFilled();
    const goEditMe = useGoEditMe();
    const isEditMe = useIsEditMe();
    const loading = useMeLoading();
    // it can be not loading, because useEffect didn't yet run
    // so isProfileFilled will be null when me is not loaded
    const mustEditFirst = !loading && isProfileFilled!== null && !isProfileFilled && !isEditMe;
    if (mustEditFirst) {
        goEditMe();
    }

    return (<>
        {loading && 'loading'}
        {!loading && !mustEditFirst && <>
            {props.children}
        </>}
    </>)
}

function AuthPageWithStore(ChildComponent: FunctionComponent<{}>) {
    const component = () => {
        return (
            <Provider store={store}>
                <CheckAuthorizedUsers>
                    <CheckProfileIsFilled>
                        <Page>
                            <ChildComponent />
                        </Page>
                    </CheckProfileIsFilled>
                </CheckAuthorizedUsers>
            </Provider>
        )
    };

    component.displayName = 'AuthPageWithStore';

    return component;
}

export default AuthPageWithStore
