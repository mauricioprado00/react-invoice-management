import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientForm, { SaveClientEvent } from './ClientForm'
import { useAddClient, useAddClientError, useAddClientLastRequest, useAddClientState } from 'store/ClientSlice'
import ErrorBanner from 'components/utility/ErrorBanner'
import { PayloadAction } from '@reduxjs/toolkit'

type ClientProps = {

}
const ClientPropTypes = {

}
function ClientEdition(props: ClientProps) {
    const addClient = useAddClient();
    const lastRequest = useAddClientLastRequest();
    const addError = useAddClientError();
    const addState = useAddClientState();
    const onSave = async ({ client, clientFormApi }: SaveClientEvent) => {
        let result = await addClient(client) as any
        if (result.error === undefined) {
            clientFormApi.reset();
        }
    }
    const loading = addState === "loading";

    const onCancel = () => {
        console.log('canceled to save the client');
    }

    return (
        <Card title="Add Client">
            <ClientForm onSave={onSave} onCancel={onCancel} disabled={loading} />
            {addError && <ErrorBanner error={addError}>Could not save the client.</ErrorBanner>}
        </Card>
    )
}

ClientEdition.propTypes = ClientPropTypes;

export default ClientEdition
