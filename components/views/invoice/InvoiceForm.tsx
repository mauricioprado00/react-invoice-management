import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { ClientInvoice, Invoice, InvoicePropTypes } from 'models/Invoice'
import produce from 'immer';
import useForm from 'hooks/use-form';
import { Client, ClientPropTypes } from 'models/Client';
import ClientSelector, { ClientSelectorProps, ClientSelectorPropTypes } from 'components/ui/forms/ClientSelector';
import { dateToTimestamp } from 'library/date';

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
    const { state, reset, setState } = form;
    const invoiceFormApi = { reset };

    const cancelHandler = () => {
        let result = onCancel();
        if (result !== true) { // true == handled
            reset();
        }
    }

    const saveHandler = () => {
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
                    value: parseFloat(form.state.values.value) || 500,
                    client_id: form.state.values.client_id,
                    projectCode: form.state.values.projectCode,
                    meta: {
                        details: [
                            {
                                description: "description 1",
                                value: 100,
                            },
                            {
                                description: "description 2",
                                value: 200,
                            },
                            {
                                description: "description 3",
                                value: 400,
                            },
                        ],
                    },
                },
            },
            invoiceFormApi
        });
    }

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
