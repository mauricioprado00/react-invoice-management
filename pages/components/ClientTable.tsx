import PropTypes from 'prop-types'
import ClientTableRowItem from './ClientTableRowItem'
import { ClientTableRowItemProps, ClientTableRowItemPropTypes } from './ClientTableRowItem'
import { Table, Column } from '../ui/Table'
import HeaderContent from '../ui/HeaderContent'
import { useState } from 'react'

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
        clients.map(i =>
          <ClientTableRowItem
            id={i.id}
            name={i.name}
            email={i.email}
            totalBilled={i.totalBilled}
            companyDetails={i.companyDetails}
            key={i.id} />)
      }
    </Table>
  )
}

ClientTable.propTypes = ClientTablePropTypes;

export default ClientTable;