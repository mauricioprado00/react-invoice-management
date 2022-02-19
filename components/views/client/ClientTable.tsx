import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import { useSelector } from 'react-redux'
import { clientSliceSelector, loadClientErrorSelector } from 'store/ClientSlice'

export type ClientTableProps = {
  title?: string
}

const ClientTablePropTypes = {
  title: PropTypes.string
}


const ClientTable = ({title = "Clients"}: ClientTableProps) => {
  const clientSlice = useSelector(clientSliceSelector)
  const loadClientError = useSelector(loadClientErrorSelector)
  const loaded = clientSlice.loadClientsState === 'loaded';
  const clients = clientSlice.list;
  return (
    <Table title={title} loading={!loaded} error={loadClientError}>
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