import PropTypes from 'prop-types'
import React from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import SignupForm, { SaveUserEvent } from './SignupForm'
import { useRegisterUser, useRegisterUserError, useRegisterUserState } from 'store/UserSlice'

type SignupProps = {
    onSave?: () => void,
}
const SignupPropTypes = {
    onSave: PropTypes.func,
}
function Signup({ onSave }: SignupProps) {
    const registerUser = useRegisterUser();
    const error = useRegisterUserError();
    const state = useRegisterUserState();
    const saveHandler = async ({ user, signupFormApi }: SaveUserEvent) => {
        let result = await registerUser(user) as any
        if (result.error === undefined) {
            signupFormApi.reset();
            if (onSave) onSave();
        }
    }
    const loading = state === "loading";

    return (
        <Card title="Sign Up" fullscreen={true} background={true}>
            <SignupForm onSave={saveHandler} disabled={loading} />
            {error && <ErrorBanner error={error}>Could not sign up.</ErrorBanner>}
        </Card>
    )
}

Signup.propTypes = SignupPropTypes;

export default Signup
