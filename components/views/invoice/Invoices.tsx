import React from 'react'
import Card from 'components/ui/layout/Card'
import InvoiceTable from './InvoiceTable'

function Invoices() {
    return (
        <Card fullscreen={true} background={false}>
            <InvoiceTable />
        </Card>
    )
}

export default Invoices
