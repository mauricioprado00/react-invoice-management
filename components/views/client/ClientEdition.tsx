import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientForm, { SaveClientEvent } from './ClientForm'
import { useAddClient } from 'store/ClientSlice'

type ClientProps = {

}
const ClientPropTypes = {

}
function ClientEdition(props: ClientProps) {
    const addClient = useAddClient();
    const onSave = ({ client }: SaveClientEvent) => {
        console.log('saving the client', client);
        addClient(client)
    }
    const onCancel = () => {
        console.log('canceled to save the client');
    }
    return (
        <Card title="Add Client">
            <ClientForm onSave={onSave} onCancel={onCancel} />
        </Card>
    )
}

ClientEdition.propTypes = ClientPropTypes;

export default ClientEdition
