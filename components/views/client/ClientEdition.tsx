import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientForm, { SaveClientEvent } from './ClientForm'
import { useClientList, useUpsertClient, useUpsertClientError, useUpsertClientState } from 'store/ClientSlice'
import ErrorBanner from 'components/utility/ErrorBanner'
import { PayloadAction } from '@reduxjs/toolkit'

type ClientProps = {

}
const ClientPropTypes = {

}
function ClientEdition(props: ClientProps) {
    const clients = useClientList()
    const upsertClient = useUpsertClient();
    const error = useUpsertClientError();
    const state = useUpsertClientState();
    const onSave = async ({ client, clientFormApi }: SaveClientEvent) => {
        let result = await upsertClient(client) as any
        if (result.error === undefined) {
            clientFormApi.reset();
        }
    }
    const loading = state === "loading";
    const client = clients.length ? clients[clients.length-1] : null;

    const onCancel = () => {
        console.log('canceled to save the client');
    }

    console.log({editing: client});

    return (
        <Card title="Add Client">
            <ClientForm onSave={onSave} onCancel={onCancel} client={client} disabled={loading} />
            {error && <ErrorBanner error={error}>Could not save the client.</ErrorBanner>}
        </Card>
    )
}

ClientEdition.propTypes = ClientPropTypes;

export default ClientEdition
