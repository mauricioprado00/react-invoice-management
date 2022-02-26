import PropTypes from 'prop-types'
import React from 'react'
import { useClientById, useLoadClientState } from 'store/ClientSlice'
import ClientData from './ClientData'

type ClientProps = {
    clientId: string | null,
}
const ClientPropTypes = {
    clientId: PropTypes.string,
}
function ClientShow({ clientId }: ClientProps) {
    const client = useClientById(clientId);
    const state = useLoadClientState();
    const loading = state === 'none' || state === 'loading';



    return (
        <div className="h-screen bg-gray-200  dark:bg-gray-800   flex flex-wrap items-center  justify-center">
            {loading && "loading data"}
            {!loading && !client && "sorry we could not find the client"}
            {client && <ClientData client={client} />}
        </div>
    )
}

ClientShow.propTypes = ClientPropTypes;

export default ClientShow
