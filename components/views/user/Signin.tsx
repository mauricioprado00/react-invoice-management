import PropTypes from 'prop-types'
import React from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import SigninForm, { LoginUserEvent } from './SigninForm'
//import { useRegisterUser, useRegisterUserError, useRegisterUserState } from 'store/UserSlice'

type SigninProps = {
    onLogin?: () => void,
}
const SigninPropTypes = {
    onLogin: PropTypes.func,
}
function Signin({ onLogin }: SigninProps) {
    const error = false;
    const state = 'loaded';
    // const registerUser = useRegisterUser();
    // const error = useRegisterUserError();
    // const state = useRegisterUserState();
    const loginHandler = async ({ userLogin, signinFormApi }: LoginUserEvent) => {
        // let result = await registerUser(user) as any
        // if (result.error === undefined) {
        //     signinFormApi.reset();
        //     if (onLogin) onLogin();
        // }
        if (onLogin) onLogin();
    }
    const loading = false;//state === "loading";

    return (
        <Card title="Sign In" fullscreen={true} background={true}>
            <SigninForm onLogin={loginHandler} disabled={loading} />
            {error && <ErrorBanner error={error}>Could not sign in.</ErrorBanner>}
        </Card>
    )
}

Signin.propTypes = SigninPropTypes;

export default Signin
