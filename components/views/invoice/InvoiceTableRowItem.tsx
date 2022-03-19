import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ClientInvoice, InvoicePropTypes } from 'models/Invoice'
import { ClientPropTypes } from 'models/Client'
import { useGoInvoiceIdView } from 'library/navigation'
import moment from 'moment'

export type InvoiceTableRowItemProps = ClientInvoice & {
    extraColumns: boolean;
}


export const InvoiceTableRowItemPropTypes = {
    invoice: PropTypes.exact(InvoicePropTypes).isRequired,
    client: PropTypes.exact(ClientPropTypes).isRequired,
    extraColumns: PropTypes.bool,
}

const InvoiceTableRowItem = ({
    invoice: { id, invoice_number, value, dueDate, meta, date },
    client: { companyDetails: { name: company } },
    extraColumns = false
}: InvoiceTableRowItemProps) => {
    const goView = useGoInvoiceIdView(id);
    const isOverLimit = value >= 5000;
    const valueBilledClassnames = classNames(
        "text-left font-medium", isOverLimit ? "text-red-500" : "text-green-500"
    )
    const billedTo = meta?.billTo?.name || company;
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
            {extraColumns && <td className="p-2 whitespace-nowrap">
                <div className="text-left">{billedTo}</div>
            </td>}
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