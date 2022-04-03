import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'elements/Card'
import { useClientById, useClientLoading, useUpsertClient, useUpsertClientError, useUpsertClientState } from 'store/ClientSlice'
import ErrorBanner from 'elements/ErrorBanner'
import { Client } from 'site-specific/models/Client'
import { isFullfilledThunk } from 'hooks/use-thunk-dispatch'
import ProfileFormWrapper, { SaveProfileEvent } from '../profile/ProfileFormWrapper'
import { ConditionalContent } from 'elements/ConditionalContent'

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
    const hasError = !loading && clientId && !client;

    const cancelHandler = useCallback(() => {
        if (onCancel) { onCancel(client); return true; }
    }, [onCancel, client]);

    return (
        <Card title={title} transparent={false}>
            <ConditionalContent loading={!adding && loading} error={hasError ? { message: 'could not find the client' } : null}>
                <ProfileFormWrapper onSave={saveHandler}
                    onCancel={cancelHandler} profile={client} disabled={saving} />
            </ConditionalContent> 
            {upsertError && <ErrorBanner error={upsertError}>Could not save the client.</ErrorBanner>}
        </Card>
    )
}

ClientEdition.propTypes = ClientPropTypes;

export default ClientEdition
