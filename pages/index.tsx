import type { NextPage } from 'next'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const isType = (component: any, names: Array<string>): boolean => {
  let type = component.type;
  if (typeof type === 'object') {
    type = type.name;
  }
  console.log(names);
  return names.some(name => name === type);
}


type CompanyDetails = {
  name: string,
  totalBilled: number,
}

type ClientTableRowItemProps = {
  clientName: string,
  email: string,
  companyDetails: CompanyDetails
}

const CompanyDetailsPropType = {
  name: PropTypes.string,
  totalBilled: PropTypes.number,
}

const ClientTableRowItemPropType = {
  clientName: PropTypes.string,
  email: PropTypes.string,
  companyDetails: PropTypes.exact(CompanyDetailsPropType)
}

const ClientTableRowItem = (props: ClientTableRowItemProps) => {
  const { companyDetails, clientName, email } = props;
  const isOverLimit = companyDetails.totalBilled >= 5000;
  const totalBilledClassnames = classNames(
    "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
  )
  return (
    <tr key="nothing">
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60" alt="" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {clientName}
            </div>
            <div className="text-sm text-gray-500">
              {email}
            </div>
          </div>
        </div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{companyDetails.name}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className={totalBilledClassnames}>${companyDetails.totalBilled}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
          </svg>
        </div>
      </td>
    </tr>
  );
}

ClientTableRowItem.propTypes = ClientTableRowItemPropType


const TableHeaderColumn = (props) => {
  return (
    <th className="p-2 whitespace-nowrap">
      <div className="font-semibold text-left">{props.children}</div>
    </th>
  )
}

const Table = (props) => {
  const { title, children } = props
  const headerColumns = props.children.filter(child => isType(child, ['TableHeaderColumn']))
  const rows = props.children.filter(child => !isType(child, ['TableHeaderColumn']))

  return (
    <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
      <div className="flex flex-col justify-center h-full">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">{title}</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    {headerColumns}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


type ClientTableProps = {
  clients: Array<ClientTableRowItemProps>
}

const ClientTable = (props: ClientTableProps) => {
  const { clients } = props;
  return (
    <Table title="Customers">
      <TableHeaderColumn>Client Name</TableHeaderColumn>
      <TableHeaderColumn>Company Name</TableHeaderColumn>
      <TableHeaderColumn>Total Billed</TableHeaderColumn>
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


const Home: NextPage = () => {
  const clients = new Array(5).fill(0).map(i => ({
    clientName: "Jane Cooper",
    email: "jane.cooper@example.com",
    companyDetails: {
      name: "Acme",
      totalBilled: parseInt(((Math.random() * (5000 * 2 - 3000) * 0.6) + 3000).toFixed(0))
    }
  }));
  return (
    <>
      <Table title="something">
        <TableHeaderColumn>Client Name</TableHeaderColumn>
        <tr><td>hola</td></tr>
      </Table>
      <ClientTable clients={clients} />
    </>
  )
}

export default Home
