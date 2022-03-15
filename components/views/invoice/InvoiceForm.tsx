import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'components/ui/forms/Form'
import FieldsetRow from 'components/ui/forms/FieldsetRow'
import InputText from 'components/ui/forms/InputText'
import Button, { ButtonStyle } from 'components/ui/forms/Button'
import { ClientInvoice, Invoice, InvoiceDetail, InvoicePropTypes, PaymentType, PaymentTypePropTypes } from 'models/Invoice'
import useForm from 'hooks/use-form';
import ClientSelector, { ClientSelectorProps, ClientSelectorPropTypes } from 'components/ui/forms/ClientSelector';
import InvoiceItems, { InvoiceItemsChangeEvent } from '../../ui/forms/InvoiceItems';
import produce from 'immer';
import { numberValidator } from 'library/validation';
import PaymentSelector from '../../ui/forms/PaymentSelector';

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
    paymentTypes: PaymentType[],
}

const InvoiceFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    invoice: PropTypes.exact(InvoicePropTypes),
    disabledFields: PropTypes.arrayOf(PropTypes.string),
    message: PropTypes.string,
    clientList: ClientSelectorPropTypes.clientList,
    paymentTypes: PropTypes.arrayOf(PropTypes.exact(PaymentTypePropTypes)),
}

const elements = [
    "invoice_number",
    "date",
    "dueDate",
    //"value", not handled by useForm
    "payment",
    "client_id",
    "projectCode",
    "name",
    "address",
    "regNumber",
    "vatNumber",
];

function InvoiceForm({
    onSave,
    onCancel,
    disabled = false,
    invoice,
    disabledFields,
    message,
    clientList,
    paymentTypes
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
        const {
            id,
            invoice_number,
            dueDate,
            date,
            client_id,
            projectCode,
            name,
            address,
            vatNumber,
            regNumber,
        } = form.state.values;
        onSave({
            clientInvoice: {
                client,
                invoice: {
                    id,
                    invoice_number,
                    dueDate: new Date(dueDate).getTime(),
                    date: new Date(date).getTime(),
                    value: total,
                    client_id,
                    projectCode,
                    meta: {
                        details: items,
                        billTo: {
                            name,
                            address,
                            vatNumber,
                            regNumber,
                        },
                        payTo: paymentTypes.filter(
                            t => t.accountNumber === state.values.payment
                        )[0]
                    },
                },
            },
            invoiceFormApi
        });
    }, [clientList, form, invoiceFormApi, items, onSave, paymentTypes, state.values.payment, total]);

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

    // Initialize payment type
    useEffect(() => {
        
        setState(prev => produce(prev, draft => {
            const [paymentType] = paymentTypes;
            draft.values.payment = paymentType.accountNumber;
        }))
    }, [setState, paymentTypes])

    return (
        <Form>
            <FieldsetRow>
                <InputText name="invoice_number" label="Number" required={true}
                    value={state.values.invoice_number}
                    {...form.resolveProps('invoice_number')} />

                <InputText name="projectCode" label="Project Code" required={true}
                    value={state.values.projectCode}
                    {...form.resolveProps('projectCode')} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="date" type="date" label="Date" placeholder="Date"
                    required={true} value={state.values.date}
                    {...form.resolveProps('date')} />
                <InputText name="dueDate" type="date" label="Due Date" required={true}
                    value={state.values.dueDate}
                    {...form.resolveProps('dueDate')} />
            </FieldsetRow>
            <FieldsetRow>

                {state.values.payment && <PaymentSelector name="payment" label="Payable to" required={false}
                    value={state.values.payment}
                    paymentTypes={paymentTypes}
                    {...form.resolveProps('payment')} />}

                <ClientSelector name="client_id" label="Client" clientList={clientList} required={true}
                    value={state.values.client_id}
                    {...form.resolveProps('client_id')}
                />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="name" label="Bill to" required={true}
                    value={state.values.name}
                    {...form.resolveProps('name')} />
                <InputText name="address" label="Address" required={true}
                    value={state.values.address}
                    {...form.resolveProps('projectCode')} />
            </FieldsetRow>
            <FieldsetRow>
                <InputText name="regNumber" label="Reg Number" required={true}
                    value={state.values.regNumber}
                    validators={[numberValidator('Please provide a valid %.')]}
                    {...form.resolveProps('regNumber')} />
                <InputText name="vatNumber" label="Vat Number" required={true}
                    value={state.values.vatNumber}
                    validators={[numberValidator('The % is not valid.')]}
                    {...form.resolveProps('vatNumber')} />
            </FieldsetRow>

            <InvoiceItems name="items" showErrors={state.showErrors} onChange={handleItemsChange} onValid={handleItemsValid} />

            <FieldsetRow alignRight={true}>
                Total: {total.toFixed(2)}
            </FieldsetRow>
            {state.showErrors && !form.allValid() && <p className="text-red text-xs text-red-600 dark:text-red-500">Your invoice has missing or incorrect data, please review</p>}
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
