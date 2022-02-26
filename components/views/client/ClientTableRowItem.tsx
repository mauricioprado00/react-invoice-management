import classNames from 'classnames'
import Image from 'next/image'
import { ClientWithTotals, ClientWithTotalsPropTypes } from 'models/Client'
import HamburgerDropdown from '../../ui/elements/HamburgerDropdown'
import { isMostValuableClient } from 'store/ClientSlice'
import { getAvatarImageUrl } from '../../ui/forms/AvatarSelector'

export type ClientTableRowItemProps = ClientWithTotals

export const ClientTableRowItemPropTypes = ClientWithTotalsPropTypes

const ClientTableRowItem = (client: ClientTableRowItemProps) => {
    const { name, email, totalBilled, companyDetails } = client
    const isMostValuable = isMostValuableClient(client);
    const totalBilledClassnames = classNames(
        "text-left font-medium", isMostValuable ? "text-red-500" : "text-green-500"
    );
    const actions = [
        { label: 'Profile', type: 'profile' },
        { label: 'Invoices', type: 'invoices' },
        { label: 'Remove', type: 'remove' },
    ];

    return (
        <tr key="nothing" tabIndex={0}>
            <td className="px-2 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <Image className="h-10 w-10 rounded-full" src={getAvatarImageUrl(client.avatar)} alt="" width={32} height={32} />
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