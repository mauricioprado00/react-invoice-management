import { act, render, screen, fireEvent } from "@testing-library/react"
import { InvoiceItemFieldsWrapper, InvoiceItemProps } from "site-specific/components/sections/invoice/InvoiceItemFieldsWrapper"
import { InvoiceItem } from "site-specific/hooks/use-invoice-item-form";

describe("InvoiceItemFieldsWrapper", () => {

    const props = {
        item: {
            id: 50,
            detail: 'some testing item',
            quantity: 2,
            rate: 20.10,
            valid: true,
        }
    } as InvoiceItemProps

    const typableFields = ['quantity', 'rate', 'detail'];

    const renderElement = (element: JSX.Element) => {
        render(<table>
            <tbody>
                {element}
            </tbody>
        </table>);
    }


    typableFields.forEach(async (field) => {
        it("will provide invoice item when changed", async () => {
            const newValue = '9999';
            let changedItem: InvoiceItem | null = null;

            const handleChange: InvoiceItemProps['onChange'] = (item: InvoiceItem): void => {
                changedItem = item;
            }

            renderElement(<InvoiceItemFieldsWrapper {...props} onChange={handleChange} />)

            const value = props.item[field];
            const $el = screen.queryByDisplayValue(value);
            await act(async () => {
                fireEvent.change($el, { target: { value: newValue } })
                fireEvent.blur($el)
            })

            expect(changedItem).not.toBeNull();
            expect(changedItem[field]).toBe(field === 'detail' ? newValue : parseFloat(newValue));
        })
    });
})