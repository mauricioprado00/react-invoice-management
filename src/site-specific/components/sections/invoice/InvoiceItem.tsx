import React, { useEffect, useMemo, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import useForm from 'hooks/use-form';
import InputText from 'elements/InputText';
import { gtValidator, numberValidator } from 'utility/validation';
import { InvoiceItemProps, mainColumnWidth, SecCell } from './InvoiceItems';

const elements = [
    "detail",
    "quantity",
    "rate",
];

export function InvoiceItem({ id, item, onChange, showErrors }: InvoiceItemProps) {
    const formProps = useMemo(() => {
        return {
            elements,
            disabled: false,
            initialValues: {
                detail: item.detail,
                quantity: item.quantity.toString(),
                rate: item.rate.toString(),
            }
        };
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
            });
        }
    }, [id, allValid, onChange, state]);
    const formShowErrors = state.showErrors;
    const { setShowErrors } = form;
    useEffect(() => {
        setShowErrors(showErrors || false);
    }, [setShowErrors, showErrors]);
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

    </>;
}
