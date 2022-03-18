import React from 'react'
import ClientTable from './client/ClientTable'
import InvoiceTable from './invoice/InvoiceTable'

function Dashboard() {
    return (
        <>
            <ClientTable limit={5} pageable={false} sortable={false} />
            <InvoiceTable limit={5} pageable={false} sortable={false} />
        </>
    )
}

export default Dashboard
