import { useGoEditMe } from 'library/navigation'
import React from 'react'
import { useLoadMeState, useMe } from 'store/UserSlice'
import UserCard from './UserCard'

type UserShowProps = {}
const ClientShowPropTypes = {}

function UserShow({ }: UserShowProps) {
    const me = useMe();
    const state = useLoadMeState();
    const loading = state === 'none' || state === 'loading';
    const goEditMe = useGoEditMe();

    return (
        <div className="h-screen bg-gray-200  dark:bg-gray-800   flex flex-wrap items-center  justify-center">
            {loading && "loading data"}
            {!loading && !me && "sorry we could not find your profile data"}
            {me && <UserCard me={me} onEdit={goEditMe} />}
        </div>
    )
}

UserShow.propTypes = ClientShowPropTypes;

export default UserShow
