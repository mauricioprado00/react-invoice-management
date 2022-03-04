import PropTypes from 'prop-types'
import React from 'react'
import { useLoadMeState, useMe } from 'store/UserSlice'
import ProfileData from './ProfileData'

type ProfileShowProps = {
}
const ClientShowPropTypes = {
}

function ProfileShow({ }: ProfileShowProps) {
    const me = useMe();
    const state = useLoadMeState();
    const loading = state === 'none' || state === 'loading';

    return (
        <div className="h-screen bg-gray-200  dark:bg-gray-800   flex flex-wrap items-center  justify-center">
            {loading && "loading data"}
            {!loading && !me && "sorry we could not find your profile data"}
            {me && <ProfileData me={me} />}
        </div>
    )
}

ProfileShow.propTypes = ClientShowPropTypes;

export default ProfileShow
