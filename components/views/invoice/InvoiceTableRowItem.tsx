import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ClientInvoice, InvoicePropTypes } from 'models/Invoice'
import { ClientPropTypes } from 'models/Client'
import { useGoInvoiceIdView } from 'library/navigation'
import moment from 'moment'

export type InvoiceTableRowItemProps = ClientInvoice


export const InvoiceTableRowItemPropTypes = {
    invoice: PropTypes.exact(InvoicePropTypes),
    client: PropTypes.exact(ClientPropTypes)
}

const InvoiceTableRowItem = ({
    invoice: { id, invoice_number, value, dueDate, meta, date },
    client: { companyDetails: { name: company } }
}: InvoiceTableRowItemProps) => {
    const goView = useGoInvoiceIdView(id);
    const isOverLimit = value >= 5000;
    const valueBilledClassnames = classNames(
        "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
    )
    if (meta?.billTo?.name) {
        company = meta.billTo.name;
    }
    return (
        <tr key="nothing" tabIndex={0} onClick={goView}>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{moment(date).format('YYYY-MM-DD')}</div>
            </td>
            <td className="px-2 py-4 whitespace-nowrap">
                <div className="text-left">{invoice_number}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{company}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{moment(dueDate).format('YYYY-MM-DD')}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className={valueBilledClassnames}>${value.toFixed(2)}</div>
            </td>
        </tr>
    );
}

InvoiceTableRowItem.propTypes = InvoiceTableRowItemPropTypes

export default InvoiceTableRowItem