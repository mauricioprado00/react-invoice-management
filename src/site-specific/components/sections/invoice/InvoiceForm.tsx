import React from 'react'
import PropTypes from "prop-types";
import Form from 'elements/Form'
import FieldsetRow from 'elements/FieldsetRow'
import InputText from 'elements/InputText'
import Button, { ButtonStyle, ClickHandler } from 'elements/Button'
import { InvoiceDetail, InvoiceDetailPropTypes } from 'site-specific/models/Invoice'
import ClientSelector, { ClientSelectorProps, ClientSelectorPropTypes } from 'site-specific/elements/ClientSelector';
import InvoiceItems, { InvoiceItemsChangeEvent } from './InvoiceItems';
import { numberValidator } from 'utility/validation';
import Dropdown, { DropdownOption, DropdownOptionPropTypes } from 'elements/Dropdown';
import { UseInvoiceFormReturn } from 'site-specific/hooks/use-invoice-form';

type InvoiceFormProps = {
    disabled?: boolean;
    message?: string | null;
    clientList: ClientSelectorProps['clientList'];
    form: UseInvoiceFormReturn;
    details?: InvoiceDetail[] | undefined;
    paymentTypesOptions: DropdownOption[];
    total: string;
    onDetailsChange?: (e: InvoiceItemsChangeEvent) => void;
    onDetailsValid?: (valid: boolean) => void;
    onCancel?: ClickHandler,
    onSave?: ClickHandler,
}

const InvoiceFormPropTypes = {
    disabled: PropTypes.bool,
    message: PropTypes.string,
    clientList: ClientSelectorPropTypes.clientList,
    form: PropTypes.any.isRequired,
    details: PropTypes.arrayOf(PropTypes.exact(InvoiceDetailPropTypes)),
    paymentTypesOptions: PropTypes.arrayOf(PropTypes.exact(DropdownOptionPropTypes)).isRequired,
    total: PropTypes.string.isRequired,
    onDetailsChange: PropTypes.func,
    onDetailsValid: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}

function InvoiceForm({
    disabled = false,
    message,
    clientList,
    form,
    details,
    paymentTypesOptions,
    total,
    onDetailsChange,
    onDetailsValid,
    onCancel,
    onSave,
}: InvoiceFormProps) {

    const { state } = form;
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
                    options={paymentTypesOptions}
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
                details={details}
                onChange={onDetailsChange} onValid={onDetailsValid} />

            <FieldsetRow alignRight={true}>
                Total: {total}
            </FieldsetRow>
            {state.showErrors && !form.allValid() && <p className="text-red text-xs text-red-600 dark:text-red-500">Your invoice has missing or incorrect data, please review</p>}
            <FieldsetRow alignRight={true}>
                <Button onClick={onCancel} styled={ButtonStyle.PillSecondary} disabled={disabled}>Cancel</Button>
                <Button onClick={onSave} styled={ButtonStyle.PillPrimary} disabled={disabled}>Save</Button>
            </FieldsetRow>

            {message && <FieldsetRow>
                <span className="block text-gray-500">{message}</span>
            </FieldsetRow>}
        </Form>
    )
}

InvoiceForm.propTypes = InvoiceFormPropTypes

export default InvoiceForm
