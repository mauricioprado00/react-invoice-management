import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'elements/Card'
import { UpsertClientResult, useClientById, useClientLoading, useUpsertClient, useUpsertClientError, useUpsertClientState } from 'store/ClientSlice'
import ErrorBanner from 'elements/ErrorBanner'
import { Client } from 'site-specific/models/Client'
import ProfileForm, { SaveProfileEvent } from '../profile/ProfileForm'
import { isFullfilledThunk } from 'hooks/use-thunk-dispatch'

type ClientProps = {
    onCancel?: (client:Client|null) => void,
    onSave?: (client:Client) => void,
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
    const saveHandler = async ({ profile }: SaveProfileEvent) => {
        let result = await upsertClient(profile)
        if (isFullfilledThunk(result)) {
            if (onSave) onSave(result.payload.client);
        }
    }
    const saving = upsertState === "loading";
    const title = clientId ? 'Edit Client' : 'Add Client';
    const adding = clientId === null;
    const showForm = adding || (!adding && client !== null && !loading);

    const cancelHandler = useCallback(() => {
        if (onCancel) { onCancel(client); return true; }
    }, [onCancel, client]);

    return (
        <Card title={title} transparent={false}>
            {!showForm && loading && "loading data"}
            {!showForm && !loading && !client && "sorry we could not find the client"}
            {showForm && <ProfileForm onSave={saveHandler}
                onCancel={cancelHandler} profile={client} disabled={saving} />}
            {upsertError && <ErrorBanner error={upsertError}>Could not save the client.</ErrorBanner>}
        </Card>
    )
}

ClientEdition.propTypes = ClientPropTypes;

export default ClientEdition
