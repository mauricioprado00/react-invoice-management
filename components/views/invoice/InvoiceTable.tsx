import InvoiceTableRowItem from './InvoiceTableRowItem'
import { InvoiceTableRowItemProps, InvoiceTableRowItemPropTypes } from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import HeaderContent from 'components/ui/layout/HeaderContent'
import Button from 'components/ui/forms/Button'
import { useCallback } from 'react'

export type InvoiceTableProps = {
    title?: string,
    invoices: null | Array<InvoiceTableRowItemProps>
}

const InvoiceTablePropTypes = {
    title: PropTypes.string,
    invoices: PropTypes.arrayOf(PropTypes.exact(InvoiceTableRowItemPropTypes))
}

const InvoiceTable = ({invoices, title="Latest Invoices"}: InvoiceTableProps) => {
    const loaded = invoices !== null;
    const newInvoice = useCallback((e) => {
        alert('new invoice');
        e.preventDefault();
    }, [])
    const allInvoices = useCallback((e) => {
        alert('All invoices');
        e.preventDefault();
    }, [])
    return (
        <Table title={title || "Latest Invoices"} loading={!loaded}>
            {loaded && <HeaderContent>
                <Button onClick={newInvoice}>New Invoice</Button>
                {invoices.length > 0 && <Button onClick={allInvoices}>All Invoices</Button>}
            </HeaderContent>}
            <Column>Invoice Number</Column>
            <Column>Company Name</Column>
            <Column>Value</Column>
            <Column>Due Date</Column>
            <Empty>No invoices found</Empty>
            {
                (invoices||[]).map(invoice =>
                    <InvoiceTableRowItem key={invoice.invoice.id} {...invoice} />)
            }
        </Table>
    )
}

InvoiceTable.propTypes = InvoiceTablePropTypes

export default InvoiceTable;