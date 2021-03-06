import React from 'react'
import Card from 'elements/Card'
import ClientTable from './client/ClientTable'
import InvoiceTable from './invoice/InvoiceTable'

function Dashboard() {
    return (
        <Card size='big' fullscreen={false} background="">
            <ClientTable controls={false} title="Latest Clients" latest={true}/>
            <div className="pt-5"></div>
            <InvoiceTable controls={false} title="Latest Invoices" latest={true} />
        </Card>
    )
}

export default Dashboard
