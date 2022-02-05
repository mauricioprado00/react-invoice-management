import PropTypes from 'prop-types'
import { isType, segregate } from '../../library/helpers'
import HeaderContent from './HeaderContent'

type tableHeaderColumnProps = {
    children: any
}
const TableHeaderColumnPropTypes = {
    children: PropTypes.node
}

const TableHeaderColumn = (props: tableHeaderColumnProps) => {
    return (
        <th className="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">{props.children}</div>
        </th>
    )
}

TableHeaderColumn.propTypes = TableHeaderColumnPropTypes;

type TableProps = {
    title?: string,
    children: any
}

const TablePropTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired
}

const Table = (props: TableProps) => {
    const { title } = props
    const children = props.children || []
    const [columns, headerContent, rows] = segregate(children, [
        TableHeaderColumn,
        HeaderContent,
    ])

    return (
        <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
            <div className="flex flex-col justify-center h-full">
                <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 display-inline-block">{title}</h2>
                        <div className="float-right">
                            {headerContent}
                        </div>
                    </header>
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                    <tr>
                                        {columns}
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
Table.propTypes = TablePropTypes;

export { Table, TableHeaderColumn as Column }
export default Table