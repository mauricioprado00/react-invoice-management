import React from 'react'
import Card from 'components/ui/layout/Card'
import ClientTable from './client/ClientTable'
import InvoiceTable from './invoice/InvoiceTable'

function Dashboard() {
    return (
        <Card fullscreen={false} background="none">
            <ClientTable limit={5} pageable={false} sortable={false} />
            <div className="pt-5"></div>
            <InvoiceTable limit={5} pageable={false} sortable={false} />
        </Card>
    )
}

export default Dashboard
