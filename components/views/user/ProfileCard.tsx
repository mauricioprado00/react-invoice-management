import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Client, ClientPropTypes } from 'models/Client'
import { Me, MePropTypes } from 'models/User'
import { getAvatarImageUrl } from '../../ui/forms/AvatarSelector'
import CompanyInfo from '../company/CompanyInfo'

type ProfileCardProps = {
    profile: Client | Me,
    children: ReactNode,
    onEdit?: () => void,
}
export const ProfileCardPropTypes = {
    profile: PropTypes.oneOfType([
        PropTypes.exact(ClientPropTypes),
        PropTypes.exact(MePropTypes),
    ]).isRequired,
    children: PropTypes.node,
    onEdit: PropTypes.func,
}
function ProfileCard({ children, profile, onEdit }: ProfileCardProps) {
    const imageUrl = getAvatarImageUrl(profile.avatar);
    const { name, email, companyDetails } = profile;
    return (
        <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3    bg-white  shadow-lg    transform   duration-200 easy-in-out">
            <div className=" h-32 overflow-hidden">
                <img className="w-full" src="https://images.unsplash.com/photo-1578836537282-3171d77f8632?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="background image" />
            </div>
            <div className="flex justify-center px-5  -mt-12">
                <img className="h-32 w-32 bg-white p-2 rounded-full" src={imageUrl} alt="profile avatar" />
            </div>
            <div className=" ">
                <div className="text-center px-14 relative">
                    <h2 className="text-gray-800 text-3xl font-bold">{name}</h2>
                    <p className="text-gray-400 mt-2">{email}</p>
                    {companyDetails && <CompanyInfo companyDetails={companyDetails} />}
                    {onEdit && <div className="absolute bottom-px right-2.5 cursor-pointer" onClick={onEdit}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-700" fill="currentColor" viewBox="0 0 24 24" width={24} height={24}><path fill="none" d="M0 0h24v24H0z" /><path d="M9.243 19H21v2H3v-4.243l9.9-9.9 4.242 4.244L9.242 19zm5.07-13.556l2.122-2.122a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414l-2.122 2.121-4.242-4.242z" /></svg>
                    </div>}
                </div>
                <hr className="mt-6" />
                <div className="flex  bg-gray-50 ">
                    {children}
                </div>
            </div>
        </div>
    )
}

ProfileCard.propTypes = ProfileCardPropTypes

export default ProfileCard
