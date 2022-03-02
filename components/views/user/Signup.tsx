import PropTypes from 'prop-types'
import React from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import SignupForm, { SaveUserEvent } from './SignupForm'

type SignupProps = {
    onCancel?: () => void,
    onSave?: () => void,
}
const SignupPropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
}
function Signup({ onCancel, onSave }: SignupProps) {
    const error = false;
    const state = 'loaded';
    // const insertClient = useInsertUser();
    // const error = useInsertClientError();
    // const state = useInsertClientState();
    const saveHandler = async ({ user, signupFormApi }: SaveUserEvent) => {
        // let result = await insertUser(user) as any
        // if (result.error === undefined) {
        //     signupFormApi.reset();
        //     if (onSave) onSave();
        // }
        if (onSave) onSave();
    }
    const loading = false;//state === "loading";
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
