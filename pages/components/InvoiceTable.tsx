import InvoiceTableRowItem from './InvoiceTableRowItem'
import { InvoiceTableRowItemProps, InvoiceTableRowItemPropTypes } from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column } from '../../components/ui/Table'
import HeaderContent from '../../components/ui/HeaderContent'
import Button from '../../components/ui/Button'
import { useCallback, useState } from 'react'

export type InvoiceTableProps = {
    title?: string,
    invoices: Array<InvoiceTableRowItemProps>
}

const InvoiceTablePropTypes = {
    title: PropTypes.string,
    invoices: PropTypes.arrayOf(PropTypes.exact(InvoiceTableRowItemPropTypes)).isRequired
}

const InvoiceTable = (props: InvoiceTableProps) => {
    const [loaded, setLoaded] = useState(false); 
    const { title } = props;
    const invoices: Array<InvoiceTableRowItemProps> = props.invoices || []
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
            <HeaderContent>
                {loaded  && <Button onClick={newInvoice}>New Invoice</Button>}
                {loaded  && <Button onClick={allInvoices}>All Invoices</Button>}
                {!loaded && <button onClick={() => setLoaded(true)}>Load</button>}
            </HeaderContent>
            <Column>Invoice Number</Column>
            <Column>Company Name</Column>
            <Column>Value</Column>
            <Column>Due Date</Column>
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