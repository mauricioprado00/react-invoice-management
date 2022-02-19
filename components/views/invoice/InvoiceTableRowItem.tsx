import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ClientInvoice, InvoicePropType } from 'models/Invoice'
import { ClientPropTypes } from 'models/Client'

export type InvoiceTableRowItemProps = ClientInvoice


export const InvoiceTableRowItemPropTypes = {
    invoice: PropTypes.exact(InvoicePropType),
    client: PropTypes.exact(ClientPropTypes)
}

const InvoiceTableRowItem = ({
    invoice: { invoice_number, value, dueDate },
    client: { companyDetails: { name: company } }
}: InvoiceTableRowItemProps) => {
    const isOverLimit = value >= 5000;
    const valueBilledClassnames = classNames(
        "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
    )
    return (
        <tr key="nothing">
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