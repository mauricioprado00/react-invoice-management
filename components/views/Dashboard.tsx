import React from 'react'
import PropTypes from 'prop-types'
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

Dashboard.propTypes = {}

export default Dashboard
