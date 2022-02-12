import PropTypes from 'prop-types'
import { segregate } from '../../../library/helpers'
import HeaderContent from './HeaderContent'
import LoadingMask from '../LoadingMask'

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

type EmptyProps = {
    children: any
}
const EmptyPropTypes = {
    children: PropTypes.node
}

const Empty = (props: EmptyProps) => {
    return (<>{props.children}</>)
}

Empty.propTypes = EmptyPropTypes;

type TableProps = {
    title?: string,
    loading: boolean,
    children: any
}

const TablePropTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
}

const Table = (props: TableProps) => {
    const { title, loading } = props
    const children = props.children || []
    const [columns, headerContent, empty, [rows]] = segregate(children, [
        TableHeaderColumn,
        HeaderContent,
        Empty
    ])

    return (
        <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
            <div className="flex flex-col justify-center h-full">
                <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100 flex">
                        <h2 className="font-semibold text-gray-800 display-inline-block flex-1">{title}</h2>
                        <div>
                            {headerContent}
                        </div>
                    </header>

                    {loading ?
                        <LoadingMask /> :
                        (rows.length ?
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
                            :
                            <div className="flex flex-col items-center justify-center px-10 py-32">
                                {empty}
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    )
}
Table.propTypes = TablePropTypes;

export { Table, TableHeaderColumn as Column, Empty }
export default Table