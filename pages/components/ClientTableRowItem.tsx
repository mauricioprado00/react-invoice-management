import PropTypes from 'prop-types'
import classNames from 'classnames'

export type CompanyDetails = {
    name: string,
    totalBilled: number,
}

export type ClientTableRowItemProps = {
    clientName: string,
    email: string,
    companyDetails: CompanyDetails
}

const CompanyDetailsPropType = {
    name: PropTypes.string,
    totalBilled: PropTypes.number,
}

const ClientTableRowItemPropTypes = {
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

ClientTableRowItem.propTypes = ClientTableRowItemPropTypes

export default ClientTableRowItem