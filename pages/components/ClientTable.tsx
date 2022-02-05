import ClientTableRowItem from './ClientTableRowItem'
import { ClientTableRowItemProps } from './ClientTableRowItem'
import { Table, Column } from '../ui/Table'

export type ClientTableProps = {
  clients: Array<ClientTableRowItemProps>
}

const ClientTable = (props: ClientTableProps) => {
  const { clients } = props;
  return (
    <Table title="Customers">
      <Column>Client Name</Column>
      <Column>Company Name</Column>
      <Column>Total Billed</Column>
      {
        clients.map(i =>
          <ClientTableRowItem
            clientName={i.clientName}
            email={i.email}
            companyDetails={i.companyDetails}
            key="x" />)
      }
    </Table>
  )
}

export default ClientTable;