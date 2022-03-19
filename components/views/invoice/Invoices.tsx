import React from 'react'
import Card from 'components/ui/layout/Card'
import InvoiceTable from './InvoiceTable'

function Invoices() {
    return (
        <Card size='giant'>
            <InvoiceTable extraColumns={true} />
        </Card>
    )
}

export default Invoices
