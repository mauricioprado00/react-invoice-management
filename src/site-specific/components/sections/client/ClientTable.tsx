import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { TableHeaderContent, Table, Column, Empty, useSortDirection, SortDirection } from 'components/Table'
import { useClientList, useLoadClientError } from 'store/ClientSlice'
import Button, { ButtonStyle } from 'elements/Button'
import { useGoClients, useGoNewClient } from 'site-specific/hooks/use-navigation'
import { useRouter } from 'next/router'
import { ClientListingArgs } from 'api/apiclient'
import { usePagination } from 'hooks/use-url'

export type ClientTableProps = {
  title?: string;
  limit?: number;
  controls?: boolean;
  pageable?: boolean;
  sortable?: boolean;
  latest?: boolean;
}

const ClientTablePropTypes = {
  title: PropTypes.string,
  limit: PropTypes.number,
  controls: PropTypes.bool,
  pageable: PropTypes.bool,
  sortable: PropTypes.bool,
  latest: PropTypes.bool,
}

export const GetClientListingArgs = (limit: number, latest: boolean): Required<ClientListingArgs> => {
  const router = useRouter();
  const {
      sort_name,
      sort_company,
      sort_total,
      sort_count,
      page
  }: {
      sort_name?: SortDirection,
      sort_company?: SortDirection,
      sort_total?: SortDirection,
      sort_count?: SortDirection,
      page?: number,
  } = router.query;

  return {
      filter: {},

      // TODO send keys sorted in the way router.query provides them
      // TODO Also requires changes on the API
      sort: {
          clientName: sort_name,
          companyName: sort_company,
          totalBilled: sort_total,
          invoicesCount: sort_count,
          creation: latest ? "desc" : "asc",
      },
      limit,
      offset: page ? (page - 1) * limit : 0,
  }
}

const AddNewClientMessage = () => {
  const goNewClient = useGoNewClient();
  return <p className="mt-4">
    You can add a &nbsp;
    <button className="font-bold" onClick={goNewClient}>new one here</button>
  </p>
}


const ClientTable = ({
  title = "Clients",
  limit = 5,
  pageable = true,
  sortable = true,
  controls = true,
  latest = false,
}: ClientTableProps) => {
  const args = GetClientListingArgs(limit, latest);
  const filtered = useClientList(args)
  const clients = filtered?.list;
  const total = filtered?.total || 0;
  const loadError = useLoadClientError()
  const loading = !filtered?.loaded;
  const goNewClient = useGoNewClient();
  const goClients = useGoClients();
  const [page, , onPageChange] = usePagination();
  const offset = (page - 1) * limit;
  pageable = controls && pageable;
  sortable = controls && sortable;
  const pagination = !pageable ? undefined : { limit, total, offset, onPageChange }
  const nameSort = useSortDirection('sort_name');
  const companySort = useSortDirection('sort_company');
  const countSort = useSortDirection('sort_count');
  const totalSort = useSortDirection('sort_total');

  return (
    <Table title={title} loading={loading} error={loadError} pagination={pagination}>
      {!loading && <TableHeaderContent>
        {controls && <>
          <Button styled={ButtonStyle.FlatPrimary} onClick={goNewClient}>New Client</Button>
          {!pageable && <Button styled={ButtonStyle.FlatPrimary} onClick={goClients}>All Clients</Button>}
        </>}
      </TableHeaderContent>}
      <Column {...(sortable ? nameSort : {})}>Client Name</Column>
      <Column {...(sortable ? companySort : {})}>Company Name</Column>
      <Column {...(sortable ? countSort : {})}>Invoices</Column>
      <Column {...(sortable ? totalSort : {})}>Total Billed</Column>
      <Empty>No clients found</Empty>
      <Empty><AddNewClientMessage /></Empty>
      {
        (clients || []).map(client =>
          <ClientTableRowItem key={client.id} {...client} />)
      }
    </Table>
  )
}

ClientTable.propTypes = ClientTablePropTypes;

export default ClientTable;