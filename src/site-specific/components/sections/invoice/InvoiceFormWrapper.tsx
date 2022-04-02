import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { ClientInvoice, ClientInvoicePropTypes, InvoiceDetail, PaymentType, PaymentTypePropTypes } from 'site-specific/models/Invoice'
import { ClientSelectorProps, ClientSelectorPropTypes } from 'site-specific/elements/ClientSelector';
import { InvoiceItemsChangeEvent } from './InvoiceItemsTable';
import produce from 'immer';
import { paymentTypesOptions } from 'store/UserSlice';
import InvoiceForm from './InvoiceForm';
import { useInvoiceForm } from 'site-specific/hooks/use-invoice-form';

export type SaveInvoiceEvent = {
    clientInvoice: ClientInvoice,
}

type InvoiceFormWrapperProps = {
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

const InvoiceFormWrapperPropTypes = {
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

function InvoiceFormWrapper({
    onSave,
    onCancel,
    disabled = false,
    clientInvoice,
    disabledFields,
    message,
    clientList,
    paymentTypes,
    clientId
}: InvoiceFormWrapperProps) {
    const form = useInvoiceForm({ clientInvoice, disabled, disabledFields, clientId, paymentTypes })
    const [items, setItems] = useState<InvoiceDetail[]>([])
    const { state, reset, setState } = form;
    const total = items.reduce((carry, item) => carry + item.quantity * item.rate, 0);
    const { client_id, prev_client_id } = state.values;

    const handleItemsChange = useCallback((e: InvoiceItemsChangeEvent): void => {
        setItems(e.items);
    }, []);
    const handleItemsValid = useCallback((valid: boolean): void => {
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


    // When selected client changes, load company details into the "bill to" fields
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

    // convert payment types to DropdownOptions
    const [paymentTypeOptions] = useState(() => paymentTypesOptions(paymentTypes))

    return (
        <InvoiceForm
            disabled={disabled}
            message={message}
            clientList={clientList}

            form={form}
            details={clientInvoice?.invoice.meta?.details}
            paymentTypesOptions={paymentTypeOptions}
            total={total.toFixed(2)}
            onDetailsChange={handleItemsChange}
            onDetailsValid={handleItemsValid}
            onCancel={cancelHandler}
            onSave={saveHandler}
        />
    )
}

InvoiceFormWrapper.propTypes = InvoiceFormWrapperPropTypes

export default InvoiceFormWrapper
