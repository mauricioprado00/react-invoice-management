import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientTable from './client/ClientTable'
import InvoiceTable from './invoice/InvoiceTable'

function Dashboard() {
    return (
        <Card size='big' fullscreen={false} background="">
            <ClientTable controls={false} title="Latest Clients" />
            <div className="pt-5"></div>
            <InvoiceTable controls={false} title="Latest Invoices" />
        </Card>
    )
}

export default Dashboard
