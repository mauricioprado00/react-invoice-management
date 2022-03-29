import classNames from 'classnames'
import Image from 'next/image'
import { ClientWithTotals, ClientWithTotalsPropTypes } from 'models/Client'
import { isMostValuableClient } from 'store/ClientSlice'
import { getAvatarImageUrl } from 'elements/AvatarSelector'
import { useGoClientIdDashboard, useGoClientIdEdit } from 'library/navigation'
import { useCallback } from 'react'
import ClientTableRowActions from './ClientTableRowActions'

export type ClientTableRowItemProps = ClientWithTotals

export const ClientTableRowItemPropTypes = ClientWithTotalsPropTypes

const stopPropagation = (e:{stopPropagation: () => void}) => e.stopPropagation();

const ClientTableRowItem = (client: ClientTableRowItemProps) => {
    const { name, email, totalBilled, invoicesCount, companyDetails } = client
    const goEdit = useGoClientIdEdit(client.id);
    const goDashboard = useGoClientIdDashboard(client.id);
    const goInvoices = useGoClientIdDashboard(client.id, true);
    const isMostValuable = isMostValuableClient(client);
    const totalBilledClassnames = classNames(
        "text-left font-medium", isMostValuable ? "text-red-500" : "text-green-500"
    );
    const keyupHandler = useCallback(e => e.code === 'Enter' && goDashboard(), [goDashboard]);


    return (
        <tr key="nothing" tabIndex={0} onClick={goDashboard} onKeyUp={keyupHandler}>
            <td className="px-2 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <Image className="h-10 w-10 rounded-full" src={getAvatarImageUrl(client.avatar)} alt="" width={32} height={32} />
                    </div>
                    <div className="ml-4 max-w-[10rem]">
                        <div className="text-sm font-medium text-gray-900" title={name}>
                            {name}
                        </div>
                        <div className="text-sm text-gray-500 overflow-hidden text-ellipsis" title={email}>
                            {email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{companyDetails.name}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-center" data-testid="invoice-count">{invoicesCount}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className={totalBilledClassnames}>${totalBilled.toFixed(2)}</div>
            </td>
            <td className="p-2 whitespace-nowrap" onClick={stopPropagation} onKeyUp={stopPropagation}>
                <ClientTableRowActions onEdit={goEdit} onProfile={goDashboard} onInvoices={goInvoices}/>
            </td>
        </tr>
    );
}

ClientTableRowItem.propTypes = ClientTableRowItemPropTypes

export default ClientTableRowItem