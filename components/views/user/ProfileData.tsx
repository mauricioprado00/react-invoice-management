import React from 'react'
import PropTypes from "prop-types";
import { Me, MePropTypes } from 'models/User';
import { useInvoiceCount, useInvoiceSum } from 'store/InvoiceSlice';
import ProfileCard from '../profile/ProfileCard';

type ProfileDataProps = {
    me: Me, 
    onEdit?: () => void,
}

const ProfileDataPropTypes = {
    me: PropTypes.exact(MePropTypes),
    onEdit: PropTypes.func,
}

function ProfileData({ me, onEdit }: ProfileDataProps) {
    const invoiceCount = useInvoiceCount();
    const invoiceSum = useInvoiceSum();
    return (
        <ProfileCard profile={me} onEdit={onEdit}>
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
