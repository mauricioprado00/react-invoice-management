import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientForm, { SaveClientEvent } from './ClientForm'

type ClientProps = {

}
const ClientPropTypes = {

}
function ClientEdition(props: ClientProps) {
    const onSave = ({ client }: SaveClientEvent) => {
        console.log('saving the client', client);
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
