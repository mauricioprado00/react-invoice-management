import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InvoiceItemFields, InvoiceItemFieldsProps } from 'site-specific/components/sections/invoice/InvoiceItemFields'
import { useInvoiceItemForm, useInvoiceItemFormArgs, UseInvoiceItemFormReturn } from "site-specific/hooks/use-invoice-item-form";

type FormContainer = {
    form?: UseInvoiceItemFormReturn
}

type InvoiceItemFieldsWrapperTestProps = {
    args: useInvoiceItemFormArgs,
    props?: Partial<InvoiceItemFieldsProps>,
    formContainer?: FormContainer
}
const InvoiceItemFieldsWrapperTest = ({ args, props, formContainer }: InvoiceItemFieldsWrapperTestProps) => {
    const form = useInvoiceItemForm(args);
    if (formContainer) {
        formContainer.form = form;
    }

    return <table>
        <tbody>
            <InvoiceItemFields {...props} form={form} />
        </tbody>
    </table>;
}



describe("InvoiceItemFields", () => {
    const args = {
        item: {
            id: 50,
            detail: 'some testing item',
            quantity: 2,
            rate: 20.10,
            valid: true,
        }
    } as useInvoiceItemFormArgs

    const subtotal = (args.item.quantity * args.item.rate).toFixed(2);

    const renderWrapper = (formContainer?: FormContainer) =>
        render(<InvoiceItemFieldsWrapperTest args={args} formContainer={formContainer} />);

    const typableFields = ['quantity', 'rate', 'detail'];


    it("will display field values", () => {
        renderWrapper();

        Object.keys(args.item).forEach(field => {
            if (field == 'id') return; // is not visible
            if (field == 'valid') return; // is not visible
            screen.getByDisplayValue(args.item[field])
        })
    });

    it("will calculate item subtotal", () => {
        renderWrapper();
        expect(screen.getByDisplayValue(subtotal)).toBeInTheDocument();
    });

    it("will update subtotal when quantity changes", async () => {
        renderWrapper();
        const $subtotal = screen.queryByDisplayValue<HTMLInputElement>(subtotal);
        const $quantity = screen.queryByDisplayValue(args.item.quantity);
        const newQuantity = 8;
        const newSubtotal = (newQuantity * args.item.rate).toFixed(2)
        await act(async () => {
            fireEvent.change($quantity, { target: { value: newQuantity } })
        })

        expect($subtotal.value).toBe(newSubtotal)
    });

    it("will update subtotal when rate changes", async () => {
        renderWrapper();
        const $subtotal = screen.queryByDisplayValue<HTMLInputElement>(subtotal);
        const $rate = screen.queryByDisplayValue(args.item.rate);
        const newRate = 11.22;
        const newSubtotal = (args.item.quantity * newRate).toFixed(2)
        await act(async () => {
            fireEvent.change($rate, { target: { value: newRate } })
        })

        expect($subtotal.value).toBe(newSubtotal)
    });

    typableFields.forEach(async (field) => {
        it(`will show error when ${field} is empty`, async () => {
            renderWrapper();
            const value = args.item[field];
            const $el = screen.queryByDisplayValue(value);
            await act(async () => {
                fireEvent.change($el, { target: { value: '' } })
                fireEvent.blur($el)
            })
            expect(screen.getByText('Please fill')).toBeInTheDocument();
        })
    });

    typableFields.forEach(async (field) => {
        it(`will fill form.state.values[${field}] when changed`, async () => {
            const newValue = '9999';
            const formContainer: FormContainer = {};
            renderWrapper(formContainer);
            const value = args.item[field];
            const $el = screen.queryByDisplayValue(value);
            await act(async () => {
                fireEvent.change($el, { target: { value: newValue } })
                fireEvent.blur($el)
            })

            expect(formContainer.form).not.toBeNull();
            const form = formContainer.form as UseInvoiceItemFormReturn;

            expect(form.state.values[field]).toBe(newValue);
        })
    });

    ['quantity', 'rate'].forEach(async (field) => {
        it(`wont allow non-numeric values on ${field}`, async () => {
            const newValue = 'non-numeric-value';
            const formContainer: FormContainer = {};
            renderWrapper(formContainer);
            const value = args.item[field];
            const $el = screen.queryByDisplayValue<HTMLInputElement>(value);
            await act(async () => {
                fireEvent.change($el, { target: { value: newValue } })
                fireEvent.blur($el)
            })

            expect(formContainer.form).not.toBeNull();
            const form = formContainer.form as UseInvoiceItemFormReturn;

            expect(form.state.values[field]).toBe('');
            expect($el.value).toBe('');
        })
    })
});