import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import { useClientList, useClientLoading, useLoadClientError } from 'store/ClientSlice'
import HeaderContent from '../../ui/layout/HeaderContent'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import { useGoClients, useGoNewClient } from 'library/navigation'

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

  return (
    <Table title={title} loading={loading} error={loadError}>
      {!loading && <HeaderContent>
        {controls && <>
          <Button styled={ButtonStyle.FlatPrimary} onClick={goNewClient}>New Client</Button>
          {!pageable && <Button styled={ButtonStyle.FlatPrimary} onClick={goClients}>All Clients</Button>}
        </>}
      </HeaderContent>}
      <Column>Client Name</Column>
      <Column>Company Name</Column>
      <Column>Total Billed</Column>
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