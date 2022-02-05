import InvoiceTableRowItem from './InvoiceTableRowItem'
import { InvoiceTableRowItemProps, InvoiceTableRowItemPropTypes } from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column } from '../ui/Table'
import HeaderContent from '../ui/HeaderContent'
import Button from '../ui/Button'
import { useCallback } from 'react'

export type InvoiceTableProps = {
    title?: string,
    invoices: Array<InvoiceTableRowItemProps>
}

const InvoiceTablePropTypes = {
    title: 'string',
    invoices: PropTypes.arrayOf(PropTypes.exact(InvoiceTableRowItemPropTypes))
}

const InvoiceTable = (props: InvoiceTableProps) => {
    const { title, invoices } = props;
    const newInvoice = useCallback((e) => {
        alert('new invoice');
        e.preventDefault();
    }, [])
    const allInvoices = useCallback((e) => {
        alert('All invoices');
        e.preventDefault();
    }, [])
    return (
        <Table title={title || "Latest Invoices"}>
            <Column>Invoice Number</Column>
            <Column>Company Name</Column>
            <Column>Value</Column>
            <Column>Due Date</Column>
            <HeaderContent>
                <Button onClick={newInvoice}>New Invoice</Button>
                <Button onClick={allInvoices}>All Invoices</Button>
            </HeaderContent>
            {
                invoices.map(i =>
                    <InvoiceTableRowItem
                        id={i.id}
                        number={i.number}
                        company={i.company}
                        value={i.value}
                        dueDate={i.dueDate}
                        key={i.id} />)
            }
        </Table>
    )
}

InvoiceTable.propTypes = InvoiceTablePropTypes

export default InvoiceTable;