import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { Table, Column, Empty, useSortDirection } from 'components/ui/layout/Table'
import { useClientList, useClientLoading, useLoadClientError } from 'store/ClientSlice'
import HeaderContent from '../../ui/layout/HeaderContent'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import { useGoClients, useGoNewClient, usePagination, useUrlParam } from 'library/navigation'

export type ClientTableProps = {
  title?: string;
  limit?: number;
  controls?: boolean;
  pageable?: boolean;
  sortable?: boolean;
}

const ClientTablePropTypes = {
  title: PropTypes.string,
  limit: PropTypes.number,
  controls: PropTypes.bool,
  pageable: PropTypes.bool,
  sortable: PropTypes.bool,
}

const ClientTable = ({
  title = "Clients",
  limit = 5,
  pageable = true,
  sortable = true,
  controls = true,
}: ClientTableProps) => {

  const clients = useClientList()
  const loadError = useLoadClientError()
  const loading = useClientLoading()
  const goNewClient = useGoNewClient();
  const goClients = useGoClients();
  const [page, , onPageChange] = usePagination();
  const offset = (page - 1) * limit;
  pageable = controls && pageable;
  sortable = controls && sortable;
  const pagination = !pageable ? undefined : { limit, total: 100, offset, onPageChange }
  const nameSort = useSortDirection('sort_name');
  const companySort = useSortDirection('sort_company');
  const countSort = useSortDirection('sort_count');
  const totalSort = useSortDirection('sort_total');

  return (
    <Table title={title} loading={loading} error={loadError} pagination={pagination}>
      {!loading && <HeaderContent>
        {controls && <>
          <Button styled={ButtonStyle.FlatPrimary} onClick={goNewClient}>New Client</Button>
          {!pageable && <Button styled={ButtonStyle.FlatPrimary} onClick={goClients}>All Clients</Button>}
        </>}
      </HeaderContent>}
      <Column {...(sortable ? nameSort : {})}>Client Name</Column>
      <Column {...(sortable ? companySort : {})}>Company Name</Column>
      <Column {...(sortable ? countSort : {})}>Invoices</Column>
      <Column {...(sortable ? totalSort : {})}>Total Billed</Column>
      <Empty>No clients found</Empty>
      {
        (clients).map(client =>
          <ClientTableRowItem key={client.id} {...client} />)
      }
    </Table>
  )
}

ClientTable.propTypes = ClientTablePropTypes;

export default ClientTable;