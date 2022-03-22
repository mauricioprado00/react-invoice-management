import InvoiceTableRowItem from './InvoiceTableRowItem'
import PropTypes from 'prop-types'
import { Table, Column, Empty, useSortDirection, SortDirection } from 'components/ui/layout/Table'
import HeaderContent from 'components/ui/layout/HeaderContent'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { useFilteredInvoices, useLoadInvoiceError } from 'store/InvoiceSlice'
import { useGoInvoices, useGoNewInvoice, usePagination } from 'library/navigation'
import InvoiceTableFilters from './InvoiceTableFilters'
import { useRouter } from 'next/router'
import { InvoiceListingArgs } from 'api/apiclient'
import moment from 'moment'

export type InvoiceTableProps = {
    title?: string,
    limit?: number;
    controls?: boolean;
    pageable?: boolean;
    sortable?: boolean;
    extraColumns?: boolean;
    latest?: boolean;
    clientId?: string;
}

const InvoiceTablePropTypes = {
    title: PropTypes.string,
    limit: PropTypes.number,
    controls: PropTypes.bool,
    pageable: PropTypes.bool,
    sortable: PropTypes.bool,
    extraColumns: PropTypes.bool,
    latest: PropTypes.bool,
    clientId: PropTypes.string,
}

export const GetInvoiceListingArgs = (clientId:string|undefined, limit: number, latest: boolean): Required<InvoiceListingArgs> => {
    const router = useRouter();
    const {
        client,
        dateFrom,
        dateTo,
        dueDateFrom,
        dueDateTo,
        sort_date,
        sort_price,
        sort_companyName,
        sort_dueDate,
        page
    }: {
        client?: string,
        dateFrom?: string,
        dateTo?: string,
        dueDateFrom?: string,
        dueDateTo?: string,
        sort_date?: SortDirection,
        sort_price?: SortDirection,
        sort_companyName?: SortDirection,
        sort_dueDate?: SortDirection,
        page?: number,
    } = router.query;

    return {
        filter: {
            clientId: clientId || client,
            date: {
                start: dateFrom ? moment(dateFrom).valueOf() : undefined,
                end: dateTo ? moment(dateTo).valueOf() : undefined,
            },
            dueDate: {
                start: dueDateFrom ? moment(dueDateFrom).valueOf() : undefined,
                end: dueDateTo ? moment(dueDateTo).valueOf() : undefined,
            },
        },

        // TODO send keys sorted in the way router.query provides them
        // TODO Also requires changes on the API
        sort: {
            date: sort_date,
            dueDate: sort_dueDate,
            companyName: sort_companyName,
            price: sort_price,
            creation: latest ? "desc" : "asc",
        },
        limit,
        offset: page ? (page - 1) * limit : 0,
    }
}

const InvoiceTable = ({
    title = "Invoices",
    limit = 5,
    pageable = true,
    sortable = true,
    controls = true,
    extraColumns = false,
    latest = false,
    clientId
}: InvoiceTableProps) => {
    const args = GetInvoiceListingArgs(clientId, limit, latest);
    const filtered = useFilteredInvoices(args);
    const invoices = filtered?.list;
    const total = filtered?.total || 0;
    const loadError = useLoadInvoiceError()
    const loading = !filtered;
    const goNewInvoice = useGoNewInvoice();
    const loaded = !loading;
    const goInvoices = useGoInvoices();
    const [page, , onPageChange] = usePagination();
    const offset = (page - 1) * limit;
    pageable = controls && pageable;
    sortable = controls && sortable;
    const pagination = !pageable ? undefined : { limit, total, offset, onPageChange }
    const dateSort = useSortDirection('sort_date');
    const priceSort = useSortDirection('sort_price');
    const companyNameSort = useSortDirection('sort_companyName');
    const dueDateSort = useSortDirection('sort_dueDate');

    return (
        <Table title={title} loading={loading} error={loadError} pagination={pagination}>
            {loaded && <HeaderContent>
                {controls && <>
                    <InvoiceTableFilters />
                    <Button styled={ButtonStyle.FlatPrimary} onClick={goNewInvoice}>New Invoice</Button>
                    {!pageable && <Button styled={ButtonStyle.FlatPrimary} onClick={goInvoices}>All Invoices</Button>}
                </>}
            </HeaderContent>}
            <Column {...(sortable ? dateSort : {})}>Date</Column>
            <Column >Number</Column>
            <Column {...(sortable ? companyNameSort : {})}>Company</Column>
            {extraColumns && <Column>Billed To</Column>}
            <Column {...(sortable ? dueDateSort : {})}>Due</Column>
            <Column {...(sortable ? priceSort : {})}>Value</Column>
            <Empty>No invoices found</Empty>
            {
                (invoices || []).map(invoice =>
                    <InvoiceTableRowItem key={invoice.invoice.id} {...invoice} extraColumns={extraColumns}/>)
            }
        </Table>
    )
}

InvoiceTable.propTypes = InvoiceTablePropTypes

export default InvoiceTable;