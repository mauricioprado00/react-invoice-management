import React, { useEffect } from 'react';
import { InvoiceItem, useInvoiceItemForm } from 'site-specific/hooks/use-invoice-item-form';
import { InvoiceItemFields } from './InvoiceItemFields';

export type InvoiceItemProps = {
    id: number,
    onChange?: (item: InvoiceItem) => void,
    showErrors?: boolean,
    item: InvoiceItem
}

export function InvoiceItemFieldsWrapper({ id, item, onChange, showErrors }: InvoiceItemProps) {
    const form = useInvoiceItemForm({ item });
    const { state } = form;

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
    const { setShowErrors } = form;
    useEffect(() => {
        setShowErrors(showErrors || false);
    }, [setShowErrors, showErrors]);


    return <InvoiceItemFields form={form} />;
}
