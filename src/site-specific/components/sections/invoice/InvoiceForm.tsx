import React, { useMemo } from 'react'
import PropTypes from "prop-types";
import Form from 'elements/Form'
import FieldsetRow from 'elements/FieldsetRow'
import InputText from 'elements/InputText'
import Button, { ButtonStyle, ClickHandler } from 'elements/Button'
import { ClientInvoice, InvoiceDetail, InvoiceDetailPropTypes, PaymentType } from 'site-specific/models/Invoice'
import ClientSelector, { ClientSelectorProps, ClientSelectorPropTypes } from 'site-specific/elements/ClientSelector';
import InvoiceItems, { InvoiceItemsChangeEvent } from './InvoiceItems';
import { numberValidator } from 'utility/validation';
import useForm, { UseFormReturn } from 'hooks/use-form';
import Dropdown, { DropdownOption, DropdownOptionPropTypes } from 'elements/Dropdown';
import { MapType, MapTypeFill } from 'models/UtilityModels';
import moment from 'moment';

type InvoiceFormProps = {
    disabled?: boolean;
    message?: string | null;
    clientList: ClientSelectorProps['clientList'];
    form: UseFormReturn;
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

type InvoiceFormArgs = {
    clientInvoice: ClientInvoice | null,
    disabled?: boolean,
    disabledFields?: string[],
    clientId: string | null,
    paymentTypes: PaymentType[],
}

type InvoiceFieldsMapType<T> = {
    invoice_number: T,
    date: T,
    dueDate: T,
    payment: T,
    client_id: T,
    projectCode: T,
    name: T,
    address: T,
    regNumber: T,
    vatNumber: T,
}

type InvoiceFormReturn = UseFormReturn & {
    state: {
        values: InvoiceFieldsMapType<string>,
        valid: InvoiceFieldsMapType<boolean>,
        disabled: InvoiceFieldsMapType<boolean>,
    }
}

export const useInvoiceForm = ({
    clientInvoice,
    disabled = false,
    disabledFields,
    clientId,
    paymentTypes
}: InvoiceFormArgs) => {
    const formProps = useMemo(() => {
        let initialValues: MapType<string> | undefined = undefined;

        if (clientInvoice) {
            // when invoice edition
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
            // when invoice creation
            initialValues = MapTypeFill(elements, "");
            initialValues = Object.assign(initialValues, {
                client_id: clientId || '',
                date: moment().format('YYYY-MM-DD'),
                dueDate: moment().add(15, 'days').format('YYYY-MM-DD'),
            });

            // select the first payment type
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
    return useForm(formProps) as InvoiceFormReturn;
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
