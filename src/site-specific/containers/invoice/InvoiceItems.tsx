import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { styled } from '@mui/system'
import useForm, { FormElementPropTypes } from 'hooks/use-form'
import InputText from 'elements/InputText'
import produce from 'immer'
import { InvoiceDetail, InvoiceDetailPropTypes } from 'models/Invoice'
import { gtValidator, numberValidator } from 'utility/validation'

export type InvoiceItemsChangeEvent = {
    items: InvoiceDetail[],
    fieldName: string,
}

export type InvoiceItemsProps = {
    name: string,
    onValid?: (name: string, valid: boolean) => void;
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

const SecCell = styled(TableCell)(`
    & input {text-align: right}
`);

const elements = [
    "detail",
    "quantity",
    "rate",
];

type InvoiceItemProps = {
    id: number,
    onChange?: (item: InvoiceItem) => void,
    showErrors?: boolean,
    item: InvoiceItem
}

type InvoiceItem = {
    id: number,
    detail: string,
    quantity: number,
    rate: number,
    valid: boolean,
}

type NewInvoiceItem = {
    id: number,
}

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

const mainColumnWidth = '50%';

function InvoiceItem({ id, item, onChange, showErrors }: InvoiceItemProps) {
    const formProps = useMemo(() => {
        return {
            elements,
            disabled: false,
            initialValues: {
                detail: item.detail,
                quantity: item.quantity.toString(),
                rate: item.rate.toString(),
            }
        }
    }, [item]);

    const form = useForm(formProps);
    const { state, reset, setState } = form;
    const { detail, quantity, rate } = state.values;
    const amount = useMemo(() => (parseInt(quantity) || 0) * (parseFloat(rate) || 0), [quantity, rate]);
    const allValid = form.allValid();
    useEffect(() => {
        if (onChange) {
            onChange({
                id,
                detail: state.values.detail,
                quantity: parseInt(state.values.quantity) || 0,
                rate: parseFloat(state.values.rate) || 0,
                valid: allValid,
            })
        }
    }, [id, allValid, onChange, state]);
    const formShowErrors = state.showErrors;
    const { setShowErrors } = form;
    useEffect(() => {
        setShowErrors(showErrors || false);
    }, [setShowErrors, showErrors])
    const [common] = useState({ requiredMessage: 'Please fill' });

    return <>
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell width={mainColumnWidth} component="th" scope="row">
                <InputText name="detail" required={true}
                    value={state.values.detail}
                    {...common}
                    {...form.resolveProps('detail')} />
            </TableCell>
            <SecCell align="right">
                <InputText name="quantity" type="number" step="1" min="1" required={true}
                    value={state.values.quantity}
                    validators={[gtValidator(0, "cannot be zero"), numberValidator("must be an integer")]}
                    {...common}
                    {...form.resolveProps('quantity')} />

            </SecCell>
            <SecCell align="right">
                <InputText name="rate" type="number" min="0" required={true}
                    value={state.values.rate}
                    validators={[gtValidator(0, "cannot be zero")]}
                    {...common}
                    {...form.resolveProps('rate')} />

            </SecCell>
            <SecCell align="right">
                <InputText name="amount" type="number" required={true}
                    value={amount.toFixed(2)} readOnly={true} />

            </SecCell>
        </TableRow>

    </>
}

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
                onValid(name, valid)
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
                            <InvoiceItem onChange={handleChange} key={item.id} id={item.id}
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
