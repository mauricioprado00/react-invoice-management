import React from 'react'
import PropTypes from "prop-types";
import { ClientWithTotals, ClientWithTotalsPropTypes } from 'models/Client'
import ProfileCard from '../profile/ProfileCard';

type ClientDataProps = {
    client: ClientWithTotals
}

const ClientDataPropTypes = {
    client: PropTypes.exact(ClientWithTotalsPropTypes),
}

function ClientData({ client }: ClientDataProps) {
    return (
        <ProfileCard profile={client}>
            <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                <p><span className="font-semibold">${client.totalBilled}</span> Total Billed</p>
            </div>
            <div className="border" />
            <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                <p> <span className="font-semibold">{20} </span> Invoices</p>
            </div>
        </ProfileCard>
    )
}

ClientData.propTypes = ClientDataPropTypes

export default ClientData
