import PropTypes from 'prop-types'
import classNames from 'classnames'
import Image from 'next/image'
import { Client } from 'models/Client'
import HamburgerDropdown from '../../ui/elements/HamburgerDropdown'

export type ClientTableRowItemProps = Client

const CompanyDetailsPropType = {
    name: PropTypes.string.isRequired,
    vatNumber: PropTypes.string.isRequired,
    regNumber: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
}

export const ClientTableRowItemPropTypes = {
    id: PropTypes.string.isRequired,
    user_id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    totalBilled: PropTypes.number.isRequired,
    companyDetails: PropTypes.exact(CompanyDetailsPropType)
}

const ClientTableRowItem = ({ name, email, totalBilled, companyDetails }: ClientTableRowItemProps) => {
    const isOverLimit = totalBilled >= 5000;
    const totalBilledClassnames = classNames(
        "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
    );
    const actions = [
        { label: 'Profile', type: 'profile' },
        { label: 'Invoices', type: 'invoices' },
        { label: 'Remove', type: 'remove' },
    ];
    return (
        <tr key="nothing">
            <td className="px-2 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <Image className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60" alt="" width={32} height={32} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {name}
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
                <div className={totalBilledClassnames}>${totalBilled}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <HamburgerDropdown items={actions} />
            </td>
        </tr>
    );
}

ClientTableRowItem.propTypes = ClientTableRowItemPropTypes

export default ClientTableRowItem