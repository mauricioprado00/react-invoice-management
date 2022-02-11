import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { ClientTableRowItemProps, ClientTableRowItemPropTypes } from './ClientTableRowItem'
import { Table, Column } from '../ui/Table'

export type ClientTableProps = {
  title?: string,
  clients: Array<ClientTableRowItemProps>
}

const ClientTablePropTypes = {
  title: PropTypes.string,
  clients: PropTypes.arrayOf(PropTypes.exact(ClientTableRowItemPropTypes)).isRequired
}


const ClientTable = (props: ClientTableProps) => {
  const { title } = props;
  const clients: Array<ClientTableRowItemProps> = props.clients || []
  return (
    <Table title={title || "Customers"}>
      <Column>Client Name</Column>
      <Column>Company Name</Column>
      <Column>Total Billed</Column>
      {
        clients.map(i =>
          <ClientTableRowItem
            id={i.id}
            clientName={i.clientName}
            email={i.email}
            companyDetails={i.companyDetails}
            key={i.id} />)
      }
    </Table>
  )
}

ClientTable.propTypes = ClientTablePropTypes;

export default ClientTable;