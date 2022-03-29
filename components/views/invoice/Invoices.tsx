import React from 'react'
import Card from 'elements/Card'
import InvoiceTable from './InvoiceTable'

function Invoices() {
    return (
        <Card size='giant'>
            <InvoiceTable extraColumns={true} />
        </Card>
    )
}

export default Invoices
