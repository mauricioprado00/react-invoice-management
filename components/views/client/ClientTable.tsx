import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { ClientTableRowItemProps, ClientTableRowItemPropTypes } from './ClientTableRowItem'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from 'store/configureStore'
import { loadClients } from 'store/ClientsSlice'

export type ClientTableProps = {
  title?: string,
  clients: null | Array<ClientTableRowItemProps>
}

const ClientTablePropTypes = {
  title: PropTypes.string,
  clients: PropTypes.arrayOf(PropTypes.exact(ClientTableRowItemPropTypes))
}


const ClientTable = ({clients, title = "Clients"}: ClientTableProps) => {
  const dispatch = useAppDispatch();
  dispatch(loadClients());
  const loaded = clients !== null;
  return (
    <Table title={title} loading={!loaded}>
      <Column>Client Name</Column>
      <Column>Company Name</Column>
      <Column>Total Billed</Column>
      <Empty>No clients found</Empty>
      {
        (clients||[]).map(client =>
          <ClientTableRowItem key={client.id} {...client} />)
      }
    </Table>
  )
}

ClientTable.propTypes = ClientTablePropTypes;

export default ClientTable;