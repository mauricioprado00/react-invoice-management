import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import UrlInputFilter, { useUrlInputFilter } from 'components/ui/forms/UrlInputFilter'
import { useAllClients } from 'store/ClientSlice'
import ClientSelector from 'components/ui/forms/ClientSelector'
import { Fab, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import FilterIcon from '@mui/icons-material/FilterList';
import CancelIcon from '@mui/icons-material/Cancel';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useRouter } from 'next/router'

export type InvoiceTableFiltersProps = {

}

export const InvoiceTableFiltersPropTypes = {

}

type FilterState = {
    status: "display" | "selecting" | "adding";
};

const initialState: FilterState = {
    status: "display",
};

const filterList = ['client', 'dateFrom', 'dateTo', 'dueDateFrom', 'dueDateTo'];
function InvoiceTableFilters({ }: InvoiceTableFiltersProps) {
    const [state, setState] = useState(initialState);
    const clientList = useAllClients();
    const clientProps = useUrlInputFilter<string>('client', '');
    const beginSelect = useCallback(() => {
        setState(prev => ({ ...prev, status: 'selecting' }))
    }, []);
    const resetState = useCallback(() => {
        setState(prev => ({ ...prev, status: 'display' }))
    }, []);
    const router = useRouter();
    const { client, dateFrom, dateTo, dueDateFrom, dueDateTo } = router.query;
    useEffect(() => {
        setState(prev => ({ ...prev, status: 'display' }))
    }, [client, dateFrom, dateTo, dueDateFrom, dueDateTo]);
    const clearAll = useCallback(() => {
        const query = Object.assign({}, router.query);
        filterList.map(f => delete query[f]);
        router.replace({ query });
    }, [router]);

    // isFilterd = any truthy value in router.query
    const isFiltered = filterList.reduce((carry, filter) => carry || Boolean(router.query[filter]), false);
    const clearFilters = isFiltered &&
        <span className='mr-2'>
            <Fab title='Clear all filters' size="small" color="secondary" aria-label="clear all filters" onClick={clearAll}>
                <ClearAllIcon />
            </Fab>
        </span>
    
    return (
        <span className="relative mx-5 ">
            <span className={(state.status === "display" ? '' : 'invisible') + " mr-2"}>
                {clearFilters}
                <Fab title='filter by' size="small" color={isFiltered ? "primary" : "secondary"} aria-label="filter by" onClick={beginSelect}>
                    <FilterIcon />
                </Fab>
            </span>
            {state.status === "selecting" &&
                <div className='absolute bg-white -right-2  -top-3 z-10 drop-shadow-lg'>
                    <List subheader={
                        <ListSubheader component="div" id="filter-by">
                            Add filter
                            <span className="float-right">
                                {clearFilters}
                                <Fab title='cancel add filter' size="small" color="secondary" aria-label="cancel add filter" onClick={resetState}>
                                    <CancelIcon />
                                </Fab>
                            </span>
                        </ListSubheader>
                    }>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <div className='align-middle whitespace-nowrap mr-2 font-bold'>Client</div>
                                <div data-testid="filter-client-selector"><ClientSelector clientList={clientList?.list || []} emptyOptionLabel="Any Client" {...clientProps} /></div>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <div className='align-middle whitespace-nowrap mr-2 w-full font-bold'>Date From</div>
                                <div className='w-full'><UrlInputFilter name="dateFrom" type="date" /></div>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <div className='align-middle whitespace-nowrap mr-2 w-full font-bold'>Date To</div>
                                <div className='w-full'><UrlInputFilter name="dateTo" type="date" /></div>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <div className='whitespace-nowrap mr-2 font-bold w-full'>Due Date From</div>
                                <div className='w-full'><UrlInputFilter name="dueDateFrom" type="date" /></div>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <div className='align-middle whitespace-nowrap mr-2 w-full font-bold'>Due Date To</div>
                                <div className='w-full'><UrlInputFilter name="dueDateTo" type="date" /></div>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
            }

        </span>
    )
}

InvoiceTableFilters.propTypes = InvoiceTableFiltersPropTypes

export default InvoiceTableFilters
