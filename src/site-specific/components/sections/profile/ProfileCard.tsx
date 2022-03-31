import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { AnyClient, AnyClientPropTypes } from 'site-specific/models/Client'
import { Me, MePropTypes } from 'site-specific/models/User'
import { getAvatarImageUrl } from 'elements/AvatarSelector'
import CompanyInfo from '../company/CompanyInfo'
import { Fab } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import Avatar from './Avatar'

type ProfileCardProps = {
    profile: AnyClient | Me,
    children: ReactNode,
    onEdit?: () => void,
}
export const ProfileCardPropTypes = {
    profile: PropTypes.oneOfType([
        PropTypes.exact(AnyClientPropTypes),
        PropTypes.exact(MePropTypes),
    ]).isRequired,
    children: PropTypes.node,
    onEdit: PropTypes.func,
}
function ProfileCard({ children, profile, onEdit }: ProfileCardProps) {
    const { name, email, companyDetails } = profile;
    return (
        <div className="container lg:w-3/6 xl:w-3/7 sm:w-full md:w-2/3    bg-white  shadow-lg    transform   duration-200 easy-in-out">
            <div className=" h-32 overflow-hidden">
                <img className="w-full" src="https://images.unsplash.com/photo-1578836537282-3171d77f8632?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="background image" />
            </div>
            <div className="flex justify-center px-5  -mt-12">
                <Avatar src={profile} />
            </div>
            <div className=" ">
                <div className="text-center px-14 relative">
                    <h2 className="text-gray-800 text-3xl font-bold">{name}</h2>
                    <p className="text-gray-400 mt-2">{email}</p>
                    {companyDetails && <CompanyInfo companyDetails={companyDetails} />}
                    {onEdit && <Fab size="small" color="secondary" aria-label="edit" onClick={onEdit}>
                        <EditIcon />
                    </Fab>
                    }
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
