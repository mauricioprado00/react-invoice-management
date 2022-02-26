import InvoiceTableRowItem from './InvoiceTableRowItem'
import { InvoiceTableRowItemProps, InvoiceTableRowItemPropTypes } from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import HeaderContent from 'components/ui/layout/HeaderContent'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { useCallback } from 'react'
import { useInvoiceList, useLoadInvoiceError, useLoadInvoiceState } from 'store/InvoiceSlice'

export type InvoiceTableProps = {
    title?: string,
}

const InvoiceTablePropTypes = {
    title: PropTypes.string,
}

const InvoiceTable = ({ title = "Latest Invoices" }: InvoiceTableProps) => {
    const invoices = useInvoiceList()
    const loadError = useLoadInvoiceError()
    const loadState = useLoadInvoiceState()
    const loading = loadState === 'loading' || loadState === 'none';

    const loaded = !loading;
    const newInvoice = useCallback((e) => {
        alert('new invoice');
        e.preventDefault();
    }, [])
    const allInvoices = useCallback((e) => {
        alert('All invoices');
        e.preventDefault();
    }, [])
    return (
        <Table title={title || "Latest Invoices"} loading={loading} error={loadError}>
            {loaded && <HeaderContent>
                <Button styled={ButtonStyle.FlatGreen} onClick={newInvoice}>New Invoice</Button>
                {invoices.length > 0 && <Button styled={ButtonStyle.FlatGreen} onClick={allInvoices}>All Invoices</Button>}
            </HeaderContent>}
            <Column>Invoice Number</Column>
            <Column>Company Name</Column>
            <Column>Value</Column>
            <Column>Due Date</Column>
            <Empty>No invoices found</Empty>
            {
                (invoices || []).map(invoice =>
                    <InvoiceTableRowItem key={invoice.invoice.id} {...invoice} />)
            }
        </Table>
    )
}

InvoiceTable.propTypes = InvoiceTablePropTypes

export default InvoiceTable;