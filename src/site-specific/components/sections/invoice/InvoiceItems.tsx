import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { styled } from '@mui/system'
import { FormElementPropTypes } from 'hooks/use-form'
import produce from 'immer'
import { InvoiceDetail, InvoiceDetailPropTypes } from 'site-specific/models/Invoice'
import { InvoiceItemWrapper } from './InvoiceItemWrapper'
import { InvoiceItem } from 'site-specific/hooks/use-invoice-item-form'

export type InvoiceItemsChangeEvent = {
    items: InvoiceDetail[],
    fieldName: string,
}

export type InvoiceItemsProps = {
    name: string,
    onValid?: (valid: boolean, name: string) => void;
    onChange?: (e: InvoiceItemsChangeEvent) => void;
    showErrors?: boolean;
    details: InvoiceDetail[] | undefined
}

export const InvoiceItemsPropTypes = Object.assign(
    {},
    FormElementPropTypes,
    {
        name: PropTypes.string.isRequired,
        details: PropTypes.arrayOf(PropTypes.exact(InvoiceDetailPropTypes))
    }
);

const HeaderCell = styled(TableCell)(`
      color: white;
`)

export const SecCell = styled(TableCell)(`
    & input {text-align: right}
`);


type ItemsState = {
    items: Record<string, InvoiceItem>,
    lastId: number,
}

const emptyItem = {
    detail: '',
    quantity: 1,
    rate: 0,
    valid: false,
}

const initialItemsState: ItemsState = {
    items: {
        1: {
            id: 1,
            ...emptyItem
        }
    },
    lastId: 1,
}

export const mainColumnWidth = '50%';

const isItemEmpty = (item: InvoiceItem) => !item.detail && !item.rate;
const allButLastEmpty = (state: ItemsState) =>
    Object.values(state.items).filter(item => !(isItemEmpty(item) && item.id === state.lastId))
function InvoiceItems({ name, details, onValid, onChange, showErrors }: InvoiceItemsProps) {
    const [state, setState] = useState<ItemsState>(initialItemsState);
    const [lastValid, setLastValid] = useState<boolean | null>(null);
    const itemArr = Object.values(state.items);
    const items = state.items;
    const handleChange = useCallback((item: InvoiceItem) => {
        setState(state => produce(state, draft => {
            draft.items[item.id] = item;
            if (item.valid) {
                draft.lastId = Math.max(item.id, draft.lastId);
                const allValid = Object.values(state.items).filter(i => item.id !== i.id).every(item => item.valid)
                if (allValid) {
                    const newId = state.lastId + 1;
                    draft.lastId = newId;
                    draft.items[newId] = { ...emptyItem, id: newId };
                }
            } else {
                if (!item.detail && item.id !== state.lastId) {
                    delete draft.items[item.id];
                }
            }
        }))
    }, []);

    useEffect(() => {
        let items = allButLastEmpty(state);
        let valid = items.length > 0 && items.every(item => item.valid)
        if (valid !== lastValid) {
            setLastValid(valid);
            if (onValid) {
                onValid(valid, name)
            }
        }
    }, [state, onValid, lastValid, name])

    useEffect(() => {
        if (onChange) onChange({
            fieldName: name,
            items: allButLastEmpty(state)
                .map(({ detail, quantity, rate }) => ({ detail, quantity, rate })),
        });
    }, [items, onChange, name, state]);

    // Load details from Props
    useEffect(() => {
        if (details !== undefined) {
            setState(state => produce(state, (draft) => {
                draft.items = {};
                details.forEach((detail, idx) => {
                    const id = state.lastId + idx + 1;
                    draft.items[id] = {
                        ...detail,
                        id,
                        valid: false,
                    }
                })
                draft.lastId = state.lastId + details.length;
            }))
        }
    }, [details, setState])

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow className='bg-purple-500'>
                            <HeaderCell width={mainColumnWidth}>Detail</HeaderCell>
                            <HeaderCell align="right">Quantity</HeaderCell>
                            <HeaderCell align="right">Rate</HeaderCell>
                            <HeaderCell align="right">Amount</HeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemArr.map(item =>
                            <InvoiceItemWrapper onChange={handleChange} key={item.id} id={item.id}
                                item={item}
                                showErrors={showErrors && (item.id !== state.lastId || !isItemEmpty(item) || itemArr.length === 1)} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

InvoiceItems.propTypes = InvoiceItemsPropTypes

export default InvoiceItems
