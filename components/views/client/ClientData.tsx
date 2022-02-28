import React from 'react'
import PropTypes from "prop-types";
import { ClientWithTotals, ClientWithTotalsPropTypes } from 'models/Client'
import { getAvatarImageUrl } from '../../ui/forms/AvatarSelector';

type ClientDataProps = {
    client: ClientWithTotals
}

const ClientDataPropTypes = {
    client: PropTypes.exact(ClientWithTotalsPropTypes),
}

function ClientData({ client }: ClientDataProps) {
    const imageUrl = getAvatarImageUrl(client.avatar);
    return (
        <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3    bg-white  shadow-lg    transform   duration-200 easy-in-out">
            <div className=" h-32 overflow-hidden">
                <img className="w-full" src="https://images.unsplash.com/photo-1578836537282-3171d77f8632?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="background image" />
            </div>
            <div className="flex justify-center px-5  -mt-12">
                <img className="h-32 w-32 bg-white p-2 rounded-full" src={imageUrl} alt="profile avatar" />
            </div>
            <div className=" ">
                <div className="text-center px-14">
                    <h2 className="text-gray-800 text-3xl font-bold">{client.name}</h2>
                    <p className="text-gray-400 mt-2">{client.email}</p>
                    <p className="mt-2 text-gray-600">
                        {client.companyDetails.name} <br />
                        {client.companyDetails.address} <br />
                        <b>Reg Number</b>: {client.companyDetails.regNumber} <br />
                        <b>Vat Number</b>: {client.companyDetails.vatNumber} <br />
                    </p>
                </div>
                <hr className="mt-6" />
                <div className="flex  bg-gray-50 ">
                    <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                        <p><span className="font-semibold">${client.totalBilled}</span> Total Billed</p>
                    </div>
                    <div className="border" />
                    <div className="text-center w-1/2 p-4 hover:bg-gray-100">
                        <p> <span className="font-semibold">{20} </span> Invoices</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

ClientData.propTypes = ClientDataPropTypes

export default ClientData
