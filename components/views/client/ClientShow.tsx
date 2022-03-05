import { useGoClientIdEdit } from 'library/navigation'
import PropTypes from 'prop-types'
import React from 'react'
import { useClientById, useClientLoading } from 'store/ClientSlice'
import ClientCard from './ClientCard'

type ClientProps = {
    clientId: string | null,
}
const ClientPropTypes = {
    clientId: PropTypes.string,
}
function ClientShow({ clientId }: ClientProps) {
    const client = useClientById(clientId);
    const loading = useClientLoading();
    const goEditClient = useGoClientIdEdit(clientId);

    return (
        <div className="h-screen bg-gray-200  dark:bg-gray-800   flex flex-wrap items-center  justify-center">
            {loading && "loading data"}
            {!loading && !client && "sorry we could not find the client"}
            {client && <ClientCard client={client} onEdit={goEditClient} />}
        </div>
    )
}

ClientShow.propTypes = ClientPropTypes;

export default ClientShow
