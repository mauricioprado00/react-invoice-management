import classNames from 'classnames'
import Image from 'next/image'
import { ClientWithTotals, ClientWithTotalsPropTypes } from 'models/Client'
import HamburgerDropdown from '../../ui/elements/HamburgerDropdown'
import { isMostValuableClient } from 'store/ClientSlice'
import { getAvatarImageUrl } from '../../ui/forms/AvatarSelector'
import { useGoClientDashboard, useGoClientEdit, useGoClientIdDashboard } from 'library/navigation'
import { useCallback, useState } from 'react'

export type ClientTableRowItemProps = ClientWithTotals

export const ClientTableRowItemPropTypes = ClientWithTotalsPropTypes

const ClientTableRowItem = (client: ClientTableRowItemProps) => {
    const { name, email, totalBilled, companyDetails } = client
    const goEdit = useGoClientEdit();
    const goDashboard = useGoClientIdDashboard(client.id);
    const isMostValuable = isMostValuableClient(client);
    const totalBilledClassnames = classNames(
        "text-left font-medium", isMostValuable ? "text-red-500" : "text-green-500"
    );
    const [actions] = useState(() => [
        { label: 'Edit', type: 'edit', handler: () => goEdit(client.id) },
        { label: 'Profile', type: 'profile', handler: goDashboard },
        { label: 'Invoices', type: 'invoices' },
        { label: 'Remove', type: 'remove' },
    ]);
    const stopPropagation = useCallback(e => e.stopPropagation(), []);
    const keyupHandler = useCallback(e => e.code === 'Enter' && goDashboard(), [goDashboard]);


    return (
        <tr key="nothing" tabIndex={0} onClick={goDashboard} onKeyUp={keyupHandler}>
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
            <td className="p-2 whitespace-nowrap" onClick={stopPropagation} onKeyUp={stopPropagation}>
                <HamburgerDropdown items={actions} />
            </td>
        </tr>
    );
}

ClientTableRowItem.propTypes = ClientTableRowItemPropTypes

export default ClientTableRowItem