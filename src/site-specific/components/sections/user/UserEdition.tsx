import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'elements/Card'
import ErrorBanner from 'elements/ErrorBanner'
import { useIsProfileFilled, useMe, useUpdateMe, useUpdateMeError, useUpdateMeState } from 'store/UserSlice'
import { Me } from 'site-specific/models/User'
import { isFullfilledThunk } from 'hooks/use-thunk-dispatch'
import ProfileFormWrapper, { SaveProfileEvent } from '../profile/ProfileFormWrapper'

type UserEditionProps = {
    onCancel?: () => void,
    onSave?: () => void,
}
const UserEditionPropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
}
function UserEdition({ onCancel, onSave }: UserEditionProps) {
    const me = useMe();
    const updateMe = useUpdateMe();
    const error = useUpdateMeError();
    const state = useUpdateMeState();
    const isProfileFilled = useIsProfileFilled();
    const saveHandler = async ({ profile }: SaveProfileEvent) => {
        let result = await updateMe({ ...me as Me, ...profile })
        if (isFullfilledThunk(result)) {
            if (onSave) onSave();
        }
    }
    const loading = state === "loading";
    const title = 'Profile Edition';
    const message = !isProfileFilled ? 'Please fill out before continue' : null;

    const cancelHandler = useCallback(() => {
        if (onCancel) { onCancel(); return true; }
    }, [onCancel]);

    return (
        <Card title={title} transparent={false} background={true}>
            <ProfileFormWrapper onSave={saveHandler}
                onCancel={cancelHandler} profile={me} disabled={loading}
                disabledFields={['avatar', 'email', 'name']} withBank={true} 
                message={message}/>
            {error && <ErrorBanner error={error}>Could not save your profile.</ErrorBanner>}
        </Card>
    )
}

UserEdition.propTypes = UserEditionPropTypes;

export default UserEdition
