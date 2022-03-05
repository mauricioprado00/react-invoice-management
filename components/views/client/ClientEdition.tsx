import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'components/ui/layout/Card'
import ClientForm, { SaveClientEvent } from './ClientForm'
import { useClientById, useClientLoading, useUpsertClient, useUpsertClientError, useUpsertClientState } from 'store/ClientSlice'
import ErrorBanner from 'components/utility/ErrorBanner'

type ClientProps = {
    onCancel?: () => void,
    onSave?: () => void,
    clientId: string | null,
}
const ClientPropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    clientId: PropTypes.string,
}
function ClientEdition({ onCancel, onSave, clientId }: ClientProps) {
    const client = useClientById(clientId);
    const upsertClient = useUpsertClient();
    const upsertError = useUpsertClientError();
    const upsertState = useUpsertClientState();
    const loading = useClientLoading();
    const saveHandler = async ({ client }: SaveClientEvent) => {
        let result = await upsertClient(client) as any
        if (result.upsertError === undefined) {
            if (onSave) onSave();
        }
    }
    const saving = upsertState === "loading";
    const title = clientId ? 'Edit Client' : 'Add Client';
    const adding = clientId === null;
    const showForm = adding || (!adding && client !== null && !loading);

    const cancelHandler = useCallback(() => {
        if (onCancel) { onCancel(); return true; }
    }, [onCancel]);

    return (
        <Card title={title} fullscreen={true} background={true}>
            {!showForm && loading && "loading data"}
            {!showForm && !loading && !client && "sorry we could not find the client"}
            {showForm && <ClientForm onSave={saveHandler} onCancel={cancelHandler} client={client} disabled={saving} />}
            {upsertError && <ErrorBanner error={upsertError}>Could not save the client.</ErrorBanner>}
        </Card>
    )
}

ClientEdition.propTypes = ClientPropTypes;

export default ClientEdition
