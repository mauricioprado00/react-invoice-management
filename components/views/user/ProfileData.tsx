import React from 'react'
import PropTypes from "prop-types";
import { getAvatarImageUrl } from '../../ui/forms/AvatarSelector';
import { Me, MePropTypes } from 'models/User';
import { useInvoiceCount, useInvoiceSum } from 'store/InvoiceSlice';
import ProfileCard from './ProfileCard';

type ProfileDataProps = {
    me: Me
}

const ProfileDataPropTypes = {
    me: PropTypes.exact(MePropTypes),
}

function ProfileData({ me }: ProfileDataProps) {
    const invoiceCount = useInvoiceCount();
    const invoiceSum = useInvoiceSum();
    return (
        <ProfileCard profile={me}>
            <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                <p><span className="font-semibold">${invoiceSum}</span> Total Invoiced</p>
            </div>
            <div className="border" />
            <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                <p> <span className="font-semibold">{invoiceCount} </span> Invoices</p>
            </div>
        </ProfileCard>
    )
}

ProfileData.propTypes = ProfileDataPropTypes

export default ProfileData
