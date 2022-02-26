import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { Table, Column, Empty } from 'components/ui/layout/Table'
import { useClientList, useLoadClientError, useLoadClientState } from 'store/ClientSlice'
import HeaderContent from '../../ui/layout/HeaderContent'
import Button, { ButtonStyle } from '../../ui/forms/Button'
import { useGoNewClient } from 'library/navigation'

export type ClientTableProps = {
  title?: string
}

const ClientTablePropTypes = {
  title: PropTypes.string
}

const ClientTable = ({ title = "Clients" }: ClientTableProps) => {
  
  const clients = useClientList()
  const loadError = useLoadClientError()
  const loadState = useLoadClientState()
  const loading = loadState === 'loading' || loadState === 'none';
  const newClientHandler = useGoNewClient();

  return (
    <Table title={title} loading={loading} error={loadError}>
      {!loading && <HeaderContent>
          <Button styled={ButtonStyle.FlatGreen} onClick={newClientHandler}>New Client</Button>
          {clients.length > 0 && <Button styled={ButtonStyle.FlatGreen}>All Clients</Button>}
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