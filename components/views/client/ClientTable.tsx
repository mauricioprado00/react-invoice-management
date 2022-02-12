import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { ClientTableRowItemProps, ClientTableRowItemPropTypes } from './ClientTableRowItem'
import { Table, Column } from '../../../components/ui/layout/Table'

export type ClientTableProps = {
  title?: string,
  clients: null|Array<ClientTableRowItemProps>
}

const ClientTablePropTypes = {
  title: PropTypes.string,
  clients: PropTypes.arrayOf(PropTypes.exact(ClientTableRowItemPropTypes))
}


const ClientTable = (props: ClientTableProps) => {
  const loaded = props.clients !== null; 
  const { title } = props;
  const clients: Array<ClientTableRowItemProps> = props.clients || []
  return (
    <Table title={title || "Customers"} loading={!loaded}>
      <Column>Client Name</Column>
      <Column>Company Name</Column>
      <Column>Total Billed</Column>
      {
        clients.map(client =>
          <ClientTableRowItem key={client.id} {...client} />)
      }
    </Table>
  )
}

ClientTable.propTypes = ClientTablePropTypes;

export default ClientTable;