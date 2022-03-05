import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import { useMe, useUpdateMe, useUpdateMeError, useUpdateMeState } from 'store/UserSlice'
import ProfileForm, { SaveProfileEvent } from '../profile/ProfileForm'
import { MeFull } from 'models/User'

type ProfileEditionProps = {
    onCancel?: () => void,
    onSave?: () => void,
}
const ProfileEditionPropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
}
function ProfileEdition({ onCancel, onSave }: ProfileEditionProps) {
    const me = useMe();
    const updateMe = useUpdateMe();
    const error = useUpdateMeError();
    const state = useUpdateMeState();
    const saveHandler = async ({ profile }: SaveProfileEvent) => {
        let result = await updateMe({ ...me as MeFull, ...profile }) as any
        if (result.error === undefined) {
            if (onSave) onSave();
        }
    }
    const loading = state === "loading";
    const title = 'Profile Edition';

    const cancelHandler = useCallback(() => {
        if (onCancel) { onCancel(); return true; }
    }, [onCancel]);

    return (
        <Card title={title} fullscreen={true} background={true}>
            <ProfileForm onSave={saveHandler}
                onCancel={cancelHandler} profile={me} disabled={loading}
                disabledFields={['avatar', 'email', 'name']} />
            {error && <ErrorBanner error={error}>Could not save your profile.</ErrorBanner>}
        </Card>
    )
}

ProfileEdition.propTypes = ProfileEditionPropTypes;

export default ProfileEdition
