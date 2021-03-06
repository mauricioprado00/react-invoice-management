import { useGoClientIdEdit } from 'site-specific/hooks/use-navigation'
import PropTypes from 'prop-types'
import React from 'react'
import { useClientById, useClientLoading } from 'store/ClientSlice'
import ClientCard from './ClientCard'
import LoadingMask from "elements/LoadingMask"
import ErrorBanner from 'elements/ErrorBanner'

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
        <div className="flex flex-wrap items-center  justify-center">
            {client ? <ClientCard client={client} onEdit={goEditClient} /> : (
             loading ? <LoadingMask /> : 
                <ErrorBanner>sorry we could not find the client</ErrorBanner>
            )}
        </div>
    )
}

ClientShow.propTypes = ClientPropTypes;

export default ClientShow
