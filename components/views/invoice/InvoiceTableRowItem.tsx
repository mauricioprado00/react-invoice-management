import PropTypes from 'prop-types'
import classNames from 'classnames'

export type InvoiceTableRowItemProps = {
    id: string | number,
    number: string,
    company: string,
    value: number,
    dueDate: string
}

export const InvoiceTableRowItemPropTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    number: PropTypes.string,
    company: PropTypes.string,
    value: PropTypes.number,
    dueDate: PropTypes.string
}

const InvoiceTableRowItem = (props: InvoiceTableRowItemProps) => {
    const { number, company, value, dueDate } = props;
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