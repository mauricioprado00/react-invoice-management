import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientTable from './ClientTable'

function Clients() {
    return (
        <Card fullscreen={true} background={false}>
            <ClientTable />
        </Card>
    )
}

export default Clients
