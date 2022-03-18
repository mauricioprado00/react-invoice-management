import InvoiceTableRowItem from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column, Empty, useSortDirection } from 'components/ui/layout/Table'
import HeaderContent from 'components/ui/layout/HeaderContent'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { useInvoiceList, useInvoiceLoading, useLoadInvoiceError } from 'store/InvoiceSlice'
import { useGoInvoices, useGoNewInvoice, usePagination } from 'library/navigation'

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
    const [page, , onPageChange] = usePagination();
    const offset = (page - 1) * limit;
    pageable = controls && pageable;
    sortable = controls && sortable;
    const pagination = !pageable ? undefined : { limit, total: 100, offset, onPageChange }
    const dateSort = useSortDirection('sort_date');
    const priceSort = useSortDirection('sort_price');
    const companyNameSort = useSortDirection('sort_companyName');
    const dueDateSort = useSortDirection('sort_dueDate');

    return (
        <Table title={title} loading={loading} error={loadError} pagination={pagination}>
            {loaded && <HeaderContent>
                {controls && <>
                    <Button styled={ButtonStyle.FlatPrimary} onClick={goNewInvoice}>New Invoice</Button>
                    {!pageable && <Button styled={ButtonStyle.FlatPrimary} onClick={goInvoices}>All Invoices</Button>}
                </>}
            </HeaderContent>}
            <Column {...(sortable ? dateSort : {})}>Date</Column>
            <Column >Invoice Number</Column>
            <Column {...(sortable ? companyNameSort : {})}>Company Name</Column>
            <Column {...(sortable ? dueDateSort : {})}>Due Date</Column>
            <Column {...(sortable ? priceSort : {})}>Value</Column>
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