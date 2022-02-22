import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import { useSelector } from 'react-redux'
import { clientSliceLastRequestSelector, clientSliceSelector, loadClientErrorSelector, loadClientStateSelector } from 'store/ClientSlice'

export type ClientTableProps = {
  title?: string
}

const ClientTablePropTypes = {
  title: PropTypes.string
}

const ClientTable = ({title = "Clients"}: ClientTableProps) => {
  const clientSlice = useSelector(clientSliceSelector)
  const loadeError = useSelector(loadClientErrorSelector)
  const loadState = useSelector(loadClientStateSelector)
  const loading = loadState === 'loading';
  const clients = clientSlice.list;

  return (
    <Table title={title} loading={loading} error={loadeError}>
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