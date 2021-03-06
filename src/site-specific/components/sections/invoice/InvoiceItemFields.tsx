import React, { useMemo, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import InputText from 'elements/InputText';
import { gtValidator, numberValidator } from 'utility/validation';
import { UseInvoiceItemFormReturn } from 'site-specific/hooks/use-invoice-item-form';
import { InvoiceItemsSecondaryCell } from 'elements/InvoiceItemsSecondaryCell';

export type InvoiceItemFieldsProps = {
    form: UseInvoiceItemFormReturn
}

export function InvoiceItemFields({ form }: InvoiceItemFieldsProps) {
    const { state } = form;
    const { quantity, rate } = state.values;
    const [common] = useState({ requiredMessage: 'Please fill' });
    const amount = useMemo(() => (parseInt(quantity) || 0) * (parseFloat(rate) || 0), [quantity, rate]);

    return <>
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                <InputText name="detail" required={true}
                    value={state.values.detail}
                    {...common}
                    {...form.resolveProps('detail')} />
            </TableCell>
            <InvoiceItemsSecondaryCell>
                <InputText name="quantity" type="number" step="1" min="1" required={true}
                    value={state.values.quantity}
                    validators={[gtValidator(0, "cannot be zero"), numberValidator("must be an integer")]}
                    {...common}
                    {...form.resolveProps('quantity')} />

            </InvoiceItemsSecondaryCell>
            <InvoiceItemsSecondaryCell>
                <InputText name="rate" type="number" min="0" required={true}
                    value={state.values.rate}
                    validators={[gtValidator(0, "cannot be zero")]}
                    {...common}
                    {...form.resolveProps('rate')} />

            </InvoiceItemsSecondaryCell>
            <InvoiceItemsSecondaryCell>
                <InputText name="amount" type="number" required={true}
                    value={amount.toFixed(2)} readOnly={true} />

            </InvoiceItemsSecondaryCell>
        </TableRow>

    </>;
}
