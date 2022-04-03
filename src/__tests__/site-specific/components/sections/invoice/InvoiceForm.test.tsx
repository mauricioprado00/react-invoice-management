import { act, render, screen, fireEvent } from "@testing-library/react"
import moment from "moment";
import InvoiceForm, { InvoiceFormProps } from 'site-specific/components/sections/invoice/InvoiceForm'
import { useInvoiceForm, useInvoiceFormArgs, UseInvoiceFormReturn } from 'site-specific/hooks/use-invoice-form';
import { PaymentType } from "site-specific/models/Invoice";
import { paymentTypesOptions } from 'store/UserSlice';

type FormContainer = {
    form?: UseInvoiceFormReturn
}

type InvoiceFieldsWrapperTestProps = {
    args: useInvoiceFormArgs,
    props: Omit<InvoiceFormProps, "form">
    formContainer?: FormContainer
}

const InvoiceFormWrapperTest = ({ args, props, formContainer }: InvoiceFieldsWrapperTestProps) => {
    const form = useInvoiceForm(args);
    if (formContainer) {
        formContainer.form = form;
    }

    return <InvoiceForm {...props} form={form} />;

}

const valueFromDate = (date: number) => moment(date).format('YYYY-MM-DD')

describe("InvoiceForm", () => {
    const paymentTypes: PaymentType[] = [
        {
            accountNumber: 'DE89370400440532013000',
            accountType: 'iban',
        },
        {
            accountNumber: 'CTCBIDJASBY',
            accountType: 'swift',
        },
    ];
    const args = {
        clientInvoice: {
            invoice: {
                user_id: '111',
                invoice_number: 'ORBEAN-3954',
                client_id: '18e50f68-0b4c-4c2a-9bdf-5fe9dcedf3ae',
                date: 1617370801394,
                dueDate: 1622015919037,
                projectCode: 'QUANTALIA',
                meta: {
                    details: [
                        {
                            detail: 'exercitation amet ea',
                            quantity: 9,
                            rate: 334.1
                        },
                        {
                            detail: 'occaecat id enim',
                            quantity: 6,
                            rate: 568.1
                        },
                        {
                            detail: 'cillum duis reprehenderit',
                            quantity: 7,
                            rate: 671.9
                        },
                        {
                            detail: 'cupidatat cupidatat sit',
                            quantity: 8,
                            rate: 528
                        }
                    ],
                    billTo: {
                        name: 'Clay Matthews',
                        address: '467 Tillary Street, Veguita, Florida, 9122',
                        vatNumber: '737636827609',
                        regNumber: '150459432107'
                    },
                    payTo: {
                        accountType: 'swift',
                        accountNumber: 'CTCBIDJASBY'
                    }
                },
                value: 15342.8,
                id: 'fb3242f1-19b1-4875-96bf-84b29654024b'
            },
            client: {
                id: '18e50f68-0b4c-4c2a-9bdf-5fe9dcedf3ae',
                name: 'Garcia Ray',
                email: 'garciaray@balooba.com',
                avatar: '10.png',
                companyDetails: {
                    name: 'Glukgluk',
                    address: '438 Ridgecrest Terrace, Fairview, Northern Mariana Islands, 5261',
                    vatNumber: '632020029821',
                    regNumber: '497117107532'
                },
            }
        },
        paymentTypes
    } as useInvoiceFormArgs;

    const props = {
        clientList: [
            {
                id: '5d14a4d6-c892-420c-bfd1-41d26e23ce1b',
                name: 'Shaw Ferrell',
                email: 'shawferrell@injoy.com',
                avatar: '10.png',
                companyDetails: {
                    name: 'Musanpoly',
                    address: '333 Eagle Street, Riviera, New York, 5053',
                    vatNumber: '113026483771',
                    regNumber: '568307251000'
                },
            },
            {
                id: '18e50f68-0b4c-4c2a-9bdf-5fe9dcedf3ae',
                name: 'Garcia Ray',
                email: 'garciaray@balooba.com',
                avatar: '10.png',
                companyDetails: {
                    name: 'Glukgluk',
                    address: '438 Ridgecrest Terrace, Fairview, Northern Mariana Islands, 5261',
                    vatNumber: '632020029821',
                    regNumber: '497117107532'
                },
            },
            {
                id: '6d3699bf-31cd-4a7f-b3cb-1af62d727685',
                name: 'Bishop Pope',
                email: 'bishoppope@musanpoly.com',
                avatar: '10.png',
                companyDetails: {
                    name: 'Waterbaby',
                    address: '298 Doone Court, Crenshaw, Tennessee, 7161',
                    vatNumber: '782068719715',
                    regNumber: '517831550978'
                },
            }
        ],
        total: "999999.99",
        paymentTypesOptions: paymentTypesOptions(paymentTypes),
        details: args.clientInvoice.invoice.meta.details,
    } as Omit<InvoiceFormProps, 'form'>;


    const renderWrapper = (formContainer?: FormContainer) =>
        render(<InvoiceFormWrapperTest args={args} props={props} formContainer={formContainer} />);

    it("will render given input", () => {
        const { container } = renderWrapper();

        screen.getByDisplayValue(args.clientInvoice.invoice.invoice_number);
        screen.getByDisplayValue(args.clientInvoice.invoice.projectCode);
        screen.getByDisplayValue(args.clientInvoice.invoice.meta.payTo.accountNumber);
        screen.getByDisplayValue(args.clientInvoice.invoice.meta.billTo.address);
        screen.getByDisplayValue(args.clientInvoice.invoice.meta.billTo.name);
        screen.getByDisplayValue(args.clientInvoice.invoice.meta.billTo.vatNumber);
        screen.getByDisplayValue(args.clientInvoice.invoice.meta.billTo.regNumber);

        const $date = container.querySelector<HTMLInputElement>('[name="date"]')
        expect($date.value).toBe(valueFromDate(args.clientInvoice.invoice.date));
        const $dueDate = container.querySelector<HTMLInputElement>('[name="dueDate"]')
        expect($dueDate.value).toBe(valueFromDate(args.clientInvoice.invoice.dueDate));

        // no need to extensively test here each property
        // of the details, that is tested in InvoiceItems*.test.tsx
        args.clientInvoice.invoice.meta.details.forEach(detail =>
            screen.getByDisplayValue(detail.detail));

        screen.getByText('Total: ' + props.total)
    });

    const typableFields = [
        'invoice_number',
        'projectCode',
        'date',
        'dueDate',
        'name',
        'address',
        'regNumber',
        'vatNumber',
    ];
    const fieldContainer = {
        invoice_number: args.clientInvoice.invoice,
        projectCode: args.clientInvoice.invoice,
        date: args.clientInvoice.invoice,
        dueDate: args.clientInvoice.invoice,
        name: args.clientInvoice.invoice.meta.billTo,
        address: args.clientInvoice.invoice.meta.billTo,
        regNumber: args.clientInvoice.invoice.meta.billTo,
        vatNumber: args.clientInvoice.invoice.meta.billTo,
    };

    const transformValue = {
        date: valueFromDate,
        dueDate: valueFromDate,
    }

    typableFields.forEach(async (field) => {
        it(`will show error when ${field} is empty`, async () => {
            renderWrapper();
            const fieldValue = fieldContainer[field][field];
            const inputValue = transformValue[field] !== undefined ?
                transformValue[field](fieldValue) : fieldValue;
            const $el = screen.queryByDisplayValue(inputValue);
            await act(async () => {
                fireEvent.change($el, { target: { value: '' } })
                fireEvent.blur($el)
            })
            expect(screen.getByText('Please fill out this field.')).toBeInTheDocument();
        })
    });

})