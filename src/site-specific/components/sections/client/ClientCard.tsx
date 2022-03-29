import React from 'react'
import PropTypes from "prop-types";
import { ClientWithTotals, ClientWithTotalsPropTypes } from 'site-specific/models/Client'
import ProfileCard from '../profile/ProfileCard';

type ClientCardProps = {
    client: ClientWithTotals,
    onEdit?: () => void,
}

const ClientCardPropTypes = {
    client: PropTypes.exact(ClientWithTotalsPropTypes),
}

function ClientCard({ client, onEdit }: ClientCardProps) {
    return (
        <ProfileCard profile={client} onEdit={onEdit}>
            <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                <p><span className="font-semibold">${client.totalBilled.toFixed(2)}</span> Total Billed</p>
            </div>
            <div className="border" />
            <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                <p> <span className="font-semibold">{client.invoicesCount ? client.invoicesCount + ' Invoices' : 'No invoices yet'} </span></p>
            </div>
        </ProfileCard>
    )
}

ClientCard.propTypes = ClientCardPropTypes

export default ClientCard
