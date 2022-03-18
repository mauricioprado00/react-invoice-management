import React from 'react'
import ClientTable from './client/ClientTable'
import InvoiceTable from './invoice/InvoiceTable'

function Dashboard() {
    return (
        <>
            <ClientTable />
            <InvoiceTable />
        </>
    )
}

export default Dashboard
