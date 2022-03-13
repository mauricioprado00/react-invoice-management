import InvoiceTableRowItem from './InvoiceTableRowItem'
import { InvoiceTableRowItemProps, InvoiceTableRowItemPropTypes } from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import HeaderContent from 'components/ui/layout/HeaderContent'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { useCallback } from 'react'
import { useInvoiceList, useInvoiceLoading, useLoadInvoiceError } from 'store/InvoiceSlice'
import { useGoNewInvoice } from 'library/navigation'

export type InvoiceTableProps = {
    title?: string,
}

const InvoiceTablePropTypes = {
    title: PropTypes.string,
}

const InvoiceTable = ({ title = "Latest Invoices" }: InvoiceTableProps) => {
    const invoices = useInvoiceList()
    const loadError = useLoadInvoiceError()
    const loading = useInvoiceLoading();
    const goNewInvoice = useGoNewInvoice();

    const loaded = !loading;
    const allInvoices = useCallback((e) => {
        alert('All invoices');
        e.preventDefault();
    }, [])
    return (
        <Table title={title || "Latest Invoices"} loading={loading} error={loadError}>
            {loaded && <HeaderContent>
                <Button styled={ButtonStyle.FlatPrimary} onClick={goNewInvoice}>New Invoice</Button>
                {invoices.length > 0 && <Button styled={ButtonStyle.FlatPrimary} onClick={allInvoices}>All Invoices</Button>}
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