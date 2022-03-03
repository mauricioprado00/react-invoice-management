import PropTypes from 'prop-types'
import React from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import SignupForm, { SaveUserEvent } from './SignupForm'
import { useRegisterUser, useRegisterUserError, useRegisterUserState } from 'store/UserSlice'

type SignupProps = {
    onCancel?: () => void,
    onSave?: () => void,
}
const SignupPropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
}
function Signup({ onCancel, onSave }: SignupProps) {
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
    const cancelHandler = () => {
        if (onCancel) {onCancel(); return true;}
    }

    return (
        <Card title="Sign Up" fullscreen={true} background={true}>
            <SignupForm onSave={saveHandler} onCancel={cancelHandler} disabled={loading} />
            {error && <ErrorBanner error={error}>Could not sign up.</ErrorBanner>}
        </Card>
    )
}

Signup.propTypes = SignupPropTypes;

export default Signup
