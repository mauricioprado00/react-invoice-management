import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { ClientInvoice, Invoice, InvoiceDetail, InvoicePropTypes } from 'models/Invoice'
import useForm from 'hooks/use-form';
import ClientSelector, { ClientSelectorProps, ClientSelectorPropTypes } from 'components/ui/forms/ClientSelector';
import InvoiceItems, { InvoiceItemsChangeEvent } from '../../ui/forms/InvoiceItems';
import produce from 'immer';

type InvoiceFormApi = {
    reset: () => void
}
export type SaveInvoiceEvent = {
    clientInvoice: ClientInvoice,
    invoiceFormApi: InvoiceFormApi
}

type InvoiceFormProps = {
    onSave: (data: SaveInvoiceEvent) => void,
    onCancel: () => boolean | void,
    disabled?: boolean,
    invoice: Invoice | null,
    disabledFields?: string[],
    message?: string | null,
    clientList: ClientSelectorProps['clientList'],
}

const InvoiceFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    invoice: PropTypes.exact(InvoicePropTypes),
    disabledFields: PropTypes.arrayOf(PropTypes.string),
    message: PropTypes.string,
    clientList: ClientSelectorPropTypes.clientList
}

const elements = [
    "invoice_number",
    "date",
    "dueDate",
    //"value", not handled by useForm
    "client_id",
    "projectCode",
];

function InvoiceForm({
    onSave,
    onCancel,
    disabled = false,
    invoice,
    disabledFields,
    message,
    clientList
}: InvoiceFormProps) {
    const form = useForm({ elements, disabled, disabledFields });
    const [items, setItems] = useState<InvoiceDetail[]>([])
    const { state, reset, setState } = form;
    const total = items.reduce((carry, item) => carry + item.quantity * item.rate, 0);
    const invoiceFormApi = useMemo(() => ({ reset }), [reset]);
    const handleItemsChange = useCallback((e: InvoiceItemsChangeEvent): void => {
        setItems(e.items);
    }, []);
    const handleItemsValid = useCallback((name: string, valid: boolean): void => {
        setState(state => produce(state, (draft) => {
            draft.valid['items'] = valid;
        }))
    }, [setState]);

    const cancelHandler = () => {
        let result = onCancel();
        if (result !== true) { // true == handled
            reset();
        }
    }

    const saveHandler = useCallback(() => {
        if (!form.allValid()) {
            form.setShowErrors(true);
            return;
        }
        const [client] = clientList.filter(client => client.id === form.state.values.client_id);
        onSave({
            clientInvoice: {
                client,
                invoice: {
                    id: form.state.values.id,
                    invoice_number: form.state.values.invoice_number,
                    dueDate: new Date(form.state.values.dueDate).getTime(),
                    date: new Date(form.state.values.date).getTime(),
                    value: total,
                    client_id: form.state.values.client_id,
                    projectCode: form.state.values.projectCode,
                    meta: {
                        details: items,
                        billTo: {
                            name: "someone",
                            address: "somewhere",
                            vatNumber: "239234823",
                            regNumber: "123123",
                        },
                        payTo: {
                            accountNumber: "12313123",
                            accountType: "iban"
                        }
                    },
                },
            },
            invoiceFormApi
        });
    }, [clientList, form, invoiceFormApi, items, onSave, total]);

    useEffect(() => {
        if (invoice) {
            reset();
            setState(prev => ({
                ...prev,
                values: {
                    id: invoice.id || '',
                    invoice_number: invoice.invoice_number.toString(),
                    date: invoice.date.toString(),
                    dueDate: invoice.dueDate.toString(),
                    value: invoice.value.toString(),
                    client_id: invoice.client_id,
                    projectCode: invoice.projectCode || '',
                }
            }));
        }
    }, [setState, reset, invoice]);

    return (
        <Form>
            <FieldsetRow>
                <InputText name="invoice_number" label="Number" required={true}
                    value={state.values.invoice_number}
                    {...form.resolveProps('invoice_number')} />

                <InputText name="date" type="date" label="Date" placeholder="Date"
                    required={true} value={state.values.date}
                    {...form.resolveProps('date')} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="dueDate" type="date" label="Due Date" required={true}
                    value={state.values.dueDate}
                    {...form.resolveProps('dueDate')} />
                <InputText name="projectCode" label="Project Code" required={true}
                    value={state.values.projectCode}
                    {...form.resolveProps('projectCode')} />
            </FieldsetRow>
            <FieldsetRow>
                <ClientSelector name="client_id" label="Client" clientList={clientList} required={true}
                    value={state.values.client_id}
                    {...form.resolveProps('client_id')}
                />
            </FieldsetRow>

            <InvoiceItems name="items" showErrors={state.showErrors} onChange={handleItemsChange} onValid={handleItemsValid} />

            <FieldsetRow alignRight={true}>
                Total: {total.toFixed(2)}
            </FieldsetRow>
            <FieldsetRow alignRight={true}>
                <Button onClick={cancelHandler} styled={ButtonStyle.PillSecondary} disabled={disabled}>Cancel</Button>
                <Button onClick={saveHandler} styled={ButtonStyle.PillPrimary} disabled={disabled}>Save</Button>
            </FieldsetRow>

            {message && <FieldsetRow>
                <span className="block text-gray-500">{message}</span>
            </FieldsetRow>}
        </Form>
    )
}

InvoiceForm.propTypes = InvoiceFormPropTypes

export default InvoiceForm
