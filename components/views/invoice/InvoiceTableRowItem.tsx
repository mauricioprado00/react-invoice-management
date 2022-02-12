import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ClientInvoice } from '../../../models/Invoice'
import { ClientTableRowItemPropTypes } from '../client/ClientTableRowItem'

export type InvoiceTableRowItemProps = ClientInvoice

export const InvoicePropType = {
    id: PropTypes.string,
    user_id: PropTypes.string,
    invoice_number: PropTypes.string,
    client_id: PropTypes.string,
    date: PropTypes.number,
    dueDate: PropTypes.number,
    company: PropTypes.string,
    value: PropTypes.number,
}

export const InvoiceTableRowItemPropTypes = {
    invoice: PropTypes.exact(InvoicePropType),
    client: PropTypes.exact(ClientTableRowItemPropTypes)
}

const InvoiceTableRowItem = (props: InvoiceTableRowItemProps) => {
    const {
        invoice: { invoice_number: number, value = 0, dueDate } = {},
        client: { companyDetails: { name: company } = {} } = {}
    } = props;
    const isOverLimit = value >= 5000;
    const valueBilledClassnames = classNames(
        "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
    )
    return (
        <tr key="nothing">
            <td className="px-2 py-4 whitespace-nowrap">
                <div className="text-left">{number}</div>
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