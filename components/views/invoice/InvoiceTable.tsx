import InvoiceTableRowItem from './InvoiceTableRowItem'
import { InvoiceTableRowItemProps, InvoiceTableRowItemPropTypes } from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import HeaderContent from 'components/ui/layout/HeaderContent'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { useCallback } from 'react'
import { useInvoiceList, useInvoiceLoading, useLoadInvoiceError } from 'store/InvoiceSlice'
import { useGoInvoices, useGoNewInvoice } from 'library/navigation'

export type InvoiceTableProps = {
    title?: string,
    limit?: number;
    controls?: boolean;
    pageable?: boolean;
    sortable?: boolean;
}

const InvoiceTablePropTypes = {
    title: PropTypes.string,
    limit: PropTypes.number,
    controls: PropTypes.bool,
    pageable: PropTypes.bool,
    sortable: PropTypes.bool,
}

const InvoiceTable = ({
    title = "Invoices",
    limit = 5,
    pageable = true,
    sortable = true,
    controls = true,
}: InvoiceTableProps) => {
    const invoices = useInvoiceList()
    const loadError = useLoadInvoiceError()
    const loading = useInvoiceLoading();
    const goNewInvoice = useGoNewInvoice();

    const loaded = !loading;
    const goInvoices = useGoInvoices();
    return (
        <Table title={title || "Latest Invoices"} loading={loading} error={loadError}>
            {loaded && <HeaderContent>
                {controls && <>
                    <Button styled={ButtonStyle.FlatPrimary} onClick={goNewInvoice}>New Invoice</Button>
                    {!pageable && <Button styled={ButtonStyle.FlatPrimary} onClick={goInvoices}>All Invoices</Button>}
                </>}
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