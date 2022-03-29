import { useGoEditMe } from 'library/navigation'
import React from 'react'
import { useMe, useMeLoading } from 'store/UserSlice'
import UserCard from './UserCard'
import LoadingMask from "elements/LoadingMask"
import ErrorBanner from 'elements/ErrorBanner'

type UserShowProps = {}
const ClientShowPropTypes = {}

function UserShow({ }: UserShowProps) {
    const me = useMe();
    const loading = useMeLoading();
    const goEditMe = useGoEditMe();

    return (
        <div className="flex flex-wrap items-center  justify-center">
            {me ? <UserCard me={me} onEdit={goEditMe} /> : (
             loading ? <LoadingMask /> : 
             <ErrorBanner>sorry we could not find your profile data</ErrorBanner>
         )}
        </div>
    )
}

UserShow.propTypes = ClientShowPropTypes;

export default UserShow
