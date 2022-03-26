import PropTypes from 'prop-types'
import { segregate } from '../../../library/helpers'
import HeaderContent from './HeaderContent'
import LoadingMask from '../LoadingMask'
import { SerializedError, SerializedErrorPropTypes } from 'models/SerializedError'
import ErrorBanner from '../../utility/ErrorBanner'
import { Pagination } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { useCallback } from 'react'
import { useUrlParam } from 'library/navigation'
/**
 * table styles from https://tailwindcomponents.com/component/customers-table
 * author: @cruip
 * cruip.com
 */

export type SortDirection = "asc" | "desc" | undefined;

type tableHeaderColumnProps = {
    onSort?: (direction:SortDirection) => void;
    direction?: SortDirection;
    children: any;
}
const TableHeaderColumnPropTypes = {
    onSort: PropTypes.func,
    children: PropTypes.node,
    direction: PropTypes.oneOf(['asc', 'desc', undefined]),
}

const sortDirectionTransition = {
    undefined: 'asc' as SortDirection,
    asc: 'desc' as SortDirection,
    desc: undefined as SortDirection,
}

export const useSortDirection = (name:string) => {
    const [direction, setDirection] = useUrlParam<SortDirection>(name);
    return {
        onSort: setDirection,
        direction,
    }
}

const TableHeaderColumn = ({ children, onSort, direction }: tableHeaderColumnProps) => {
    const sortable = onSort !== undefined;
    const className = "group font-semibold text-left " + (sortable ? 'cursor-pointer' : '');
    const handleClick = useCallback(() => {
        if (sortable) {
            onSort(sortDirectionTransition[direction || 'undefined']);
        }
    }, [direction, onSort, sortable]);
    return (
        <th className="p-2 whitespace-nowrap select-none" data-testid="table-header-column">
            <div className={className} onClick={handleClick}>
                <span className="align-middle">{children}</span>
                {sortable &&
                    <span className={direction === undefined ? 'pl-2 invisible group-hover:visible' : ''}>
                        {direction === 'desc' && <ArrowUpwardIcon />}
                        {direction === 'asc' && <ArrowDownwardIcon />}
                        {direction === undefined && <SortByAlphaIcon />}
                    </span>}
            </div>
        </th>
    )
}

TableHeaderColumn.propTypes = TableHeaderColumnPropTypes;

type TablePaginationProps = {
    limit: number;
    offset: number;
    total: number;
    onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const TablePaginationPropTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
    total: PropTypes.number,
    onPageChange: PropTypes.func,
}

const TablePagination = ({ limit, offset, total, onPageChange }: TablePaginationProps) => {
    const props = {
        count: Math.ceil(total / limit),
        page: Math.floor(offset / limit) + 1,
        onChange: onPageChange,
    };

    return (
        <Pagination {...props} color="primary" siblingCount={2} />
    )
}

TablePagination.propTypes = TablePaginationPropTypes;

type EmptyProps = {
    children: any
}
const EmptyPropTypes = {
    children: PropTypes.node
}

const Empty = ({ children }: EmptyProps) => {
    return (<>{children}</>)
}

Empty.propTypes = EmptyPropTypes;

type TableProps = {
    title?: string,
    loading: boolean,
    children: any,
    error?: SerializedError | null,
    pagination?: TablePaginationProps
}

const TablePropTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    error: PropTypes.exact(SerializedErrorPropTypes),
    pagination: PropTypes.exact(TablePaginationPropTypes)
}

const Table = ({ title, loading, children, error, pagination }: TableProps) => {
    const [columns, headerContent, empty, remaining] = segregate(children, [
        TableHeaderColumn,
        HeaderContent,
        Empty
    ])

    return (
        <div className="flex flex-col justify-center">
            <div className="w-full mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                <header className="px-5 py-4 border-b border-gray-100 flex">
                    <h2 className="font-semibold text-gray-800 display-inline-block flex-1">{title}</h2>
                    <div>
                        {headerContent}
                    </div>
                </header>
                {error ? <ErrorBanner error={error}>There are connectivity problems, we could not load the data</ErrorBanner> : (
                    loading ?
                        <LoadingMask /> :
                        (remaining.length ?
                            <div className="p-3">
                                <div>
                                    <table className="table-auto w-full">
                                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                            <tr>
                                                {columns}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-gray-100">
                                            {remaining}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            :
                            <div className="flex flex-col items-center justify-center px-10 py-32">
                                {empty}
                            </div>
                        )
                )}
            </div>

            {pagination && pagination.total > pagination.limit && <div className="mt-4 place-self-center"><TablePagination {...pagination} /></div>}
        </div>
    )
}
Table.propTypes = TablePropTypes;

export { Table, TableHeaderColumn as Column, Empty }
export default Table