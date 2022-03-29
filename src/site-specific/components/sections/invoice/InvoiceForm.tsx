import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from "prop-types";
import Form from 'elements/Form'
import FieldsetRow from 'elements/FieldsetRow'
import InputText from 'elements/InputText'
import Button, { ButtonStyle } from 'elements/Button'
import { ClientInvoice, ClientInvoicePropTypes, InvoiceDetail, PaymentType, PaymentTypePropTypes } from 'site-specific/models/Invoice'
import useForm from 'hooks/use-form';
import ClientSelector, { ClientSelectorProps, ClientSelectorPropTypes } from 'site-specific/elements/ClientSelector';
import InvoiceItems, { InvoiceItemsChangeEvent } from './InvoiceItems';
import produce from 'immer';
import { numberValidator } from 'utility/validation';
import moment from 'moment';
import { MapType, MapTypeFill } from 'models/UtilityModels';
import Dropdown from 'elements/Dropdown';
import { paymentTypesOptions } from 'store/UserSlice';

export type SaveInvoiceEvent = {
    clientInvoice: ClientInvoice,
}

type InvoiceFormProps = {
    onSave: (data: SaveInvoiceEvent) => void,
    onCancel: () => boolean | void,
    disabled?: boolean,
    clientInvoice: ClientInvoice | null,
    disabledFields?: string[],
    message?: string | null,
    clientList: ClientSelectorProps['clientList'],
    paymentTypes: PaymentType[],
    clientId: string | null,
}

const InvoiceFormPropTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    clientInvoice: PropTypes.exact(ClientInvoicePropTypes),
    disabledFields: PropTypes.arrayOf(PropTypes.string),
    message: PropTypes.string,
    clientList: ClientSelectorPropTypes.clientList,
    paymentTypes: PropTypes.arrayOf(PropTypes.exact(PaymentTypePropTypes)),
    clientId: PropTypes.string,
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
    clientInvoice,
    disabledFields,
    message,
    clientList,
    paymentTypes,
    clientId
}: InvoiceFormProps) {
    const formProps = useMemo(() => {
        let initialValues:MapType<string>|undefined = undefined;

        if (clientInvoice) {
            const c = clientInvoice.client.companyDetails;
            const b = clientInvoice.invoice.meta?.billTo;
            initialValues = {
                id: clientInvoice.invoice.id || '',
                invoice_number: clientInvoice.invoice.invoice_number.toString(),
                date: new Date(clientInvoice.invoice.date).toISOString().replace(/T.*/, ''),
                dueDate: new Date(clientInvoice.invoice.dueDate).toISOString().replace(/T.*/, ''),
                value: clientInvoice.invoice.value.toString(),
                client_id: clientInvoice.invoice.client_id,
                projectCode: clientInvoice.invoice.projectCode || '',
                name: b?.name || c?.name,
                address: b?.address || c?.address,
                vatNumber: b?.vatNumber || c?.vatNumber,
                regNumber: b?.regNumber || c?.regNumber,
                payment: clientInvoice.invoice.meta?.payTo.accountNumber || '',
            };
        } else {
            initialValues = MapTypeFill(elements, "");
            initialValues = Object.assign(initialValues ,{
                client_id: clientId || '',
                date: moment().format('YYYY-MM-DD'),
                // TODO load an automatic amount of due dates from profile configuration
                dueDate: moment().add(15, 'days').format('YYYY-MM-DD'),
            });

            // get the first payment when creating a new invoice
            const [paymentType] = paymentTypes;
            initialValues.payment = paymentType.accountNumber;
        }

        

        return {
            elements,
            disabled,
            disabledFields,
            initialValues
        }
    }, [clientInvoice, disabled, disabledFields, clientId, paymentTypes]);
    const form = useForm(formProps);
    const [items, setItems] = useState<InvoiceDetail[]>([])
    const { state, reset, setState } = form;
    const total = items.reduce((carry, item) => carry + item.quantity * item.rate, 0);
    const { client_id, prev_client_id } = state.values;

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
            }
        });
    }, [clientList, form, items, onSave, paymentTypes, state.values.payment, total]);


    // Load the client company details into the "bill to" fields
    useEffect(() => {
        const [prev_client] = prev_client_id ? clientList.filter(c => c.id === prev_client_id) : [];
        const [client] = client_id ? clientList.filter(c => c.id === client_id) : [];
        if (prev_client !== client) {
            setState(state => produce(state, draft => {
                draft.values.prev_client_id = client_id;
                if (!client) return;

                const fields = ['name', 'address', 'vatNumber', 'regNumber'];

                // If billto is not empty or with previous clients value.
                if (!fields.every(k => !state.values[k])) {
                    const v = state.values;
                    const company = prev_client?.companyDetails;

                    // billto fields are not empty and there is no previous company
                    if (!company) return;

                    // Something was changed since last selected client/company
                    if (v.name !== company.name
                        || v.address !== company.address
                        || v.regNumber !== company.regNumber
                        || v.vatNumber !== company.vatNumber) {
                        return;
                    }
                }

                draft.values.name = client.companyDetails?.name;
                draft.values.address = client.companyDetails?.address;
                draft.values.vatNumber = client.companyDetails?.vatNumber;
                draft.values.regNumber = client.companyDetails?.regNumber;
            }));
        }
    }, [client_id, prev_client_id, clientList, setState]);

    const [paymentTypeOptions] = useState(() => paymentTypesOptions(paymentTypes))

    // TODO allow to update client company details if changes detected.

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

                {state.values.payment && <Dropdown name="payment" label="Payable to" required={false}
                    value={state.values.payment}
                    options={paymentTypeOptions}
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

            <InvoiceItems name="items" showErrors={state.showErrors}
                details={clientInvoice?.invoice.meta?.details}
                onChange={handleItemsChange} onValid={handleItemsValid} />

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
