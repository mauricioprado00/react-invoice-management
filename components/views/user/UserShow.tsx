import { useGoEditMe } from 'library/navigation'
import React from 'react'
import { useMe, useMeLoading } from 'store/UserSlice'
import UserCard from './UserCard'

type UserShowProps = {}
const ClientShowPropTypes = {}

function UserShow({ }: UserShowProps) {
    const me = useMe();
    const loading = useMeLoading();
    const goEditMe = useGoEditMe();

    return (
        <div className="flex flex-wrap items-center  justify-center">
            {loading && "loading data"}
            {!loading && !me && "sorry we could not find your profile data"}
            {me && <UserCard me={me} onEdit={goEditMe} />}
        </div>
    )
}

UserShow.propTypes = ClientShowPropTypes;

export default UserShow
