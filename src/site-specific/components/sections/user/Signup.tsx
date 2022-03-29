import PropTypes from 'prop-types'
import React from 'react'
import Card from 'elements/Card'
import ErrorBanner from 'elements/ErrorBanner'
import SignupForm, { SaveUserEvent } from './SignupForm'
import { useLoginUser, useRegisterUser, useRegisterUserError, useRegisterUserState } from 'store/UserSlice'
import { isFullfilledThunk } from 'hooks/use-thunk-dispatch'

type SignupProps = {
    onRegisteredAndLoggedIn?: () => boolean,
}
const SignupPropTypes = {
    onRegisteredAndLoggedIn: PropTypes.func,
}
function Signup({ onRegisteredAndLoggedIn }: SignupProps) {
    const loginUser = useLoginUser();
    const registerUser = useRegisterUser();
    const error = useRegisterUserError();
    const state = useRegisterUserState();
    const saveHandler = async ({ user, signupFormApi }: SaveUserEvent) => {
        let result = await registerUser(user)
        if (isFullfilledThunk(result)) {
            let loginResult = await loginUser(user);
            if (isFullfilledThunk(loginResult)) {
                if (onRegisteredAndLoggedIn) if (onRegisteredAndLoggedIn()) return;
                signupFormApi.reset();
            }
        }
    }
    const loading = state === "loading";

    return (
        <Card title="Sign Up" transparent={false} background={true}>
            <SignupForm onSave={saveHandler} disabled={loading} />
            {error && <ErrorBanner error={error}>Could not sign up.</ErrorBanner>}
        </Card>
    )
}

Signup.propTypes = SignupPropTypes;

export default Signup
