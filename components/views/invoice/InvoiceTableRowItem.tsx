import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ClientInvoice, InvoicePropTypes } from 'models/Invoice'
import { ClientPropTypes } from 'models/Client'
import { useGoInvoiceIdEdit } from 'library/navigation'

export type InvoiceTableRowItemProps = ClientInvoice


export const InvoiceTableRowItemPropTypes = {
    invoice: PropTypes.exact(InvoicePropTypes),
    client: PropTypes.exact(ClientPropTypes)
}

const InvoiceTableRowItem = ({
    invoice: { id, invoice_number, value, dueDate, meta },
    client: { companyDetails: { name: company } }
}: InvoiceTableRowItemProps) => {
    const goEdit = useGoInvoiceIdEdit(id);
    const isOverLimit = value >= 5000;
    const valueBilledClassnames = classNames(
        "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
    )
    if (meta?.billTo?.name) {
        company = meta.billTo.name;
    }
    return (
        <tr key="nothing" tabIndex={0} onClick={goEdit}>
            <td className="px-2 py-4 whitespace-nowrap">
                <div className="text-left">{invoice_number}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{company}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className={valueBilledClassnames}>${value}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{dueDate}</div>
            </td>
        </tr>
    );
}

InvoiceTableRowItem.propTypes = InvoiceTableRowItemPropTypes

export default InvoiceTableRowItem