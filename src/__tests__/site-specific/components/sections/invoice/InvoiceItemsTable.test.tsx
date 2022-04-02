import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import InvoiceItemsTable, { InvoiceItemsChangeEvent, InvoiceItemsTableProps } from 'site-specific/components/sections/invoice/InvoiceItemsTable'
import { InvoiceDetail } from "site-specific/models/Invoice";

describe("InvoiceItemsTable", () => {

    const props = {
        name: 'items',
        details: [
            {
                detail: 'item 1',
                quantity: 55,
                rate: 10.10,
            },
            {
                detail: 'item 2',
                quantity: 33,
                rate: 15.19,
            },
        ]
    } as InvoiceItemsTableProps


    const expectItemsToBeEquals = (a: InvoiceDetail, b: InvoiceDetail) => {
        expect(a.detail).toBe(b.detail);
        expect(a.rate).toBe(b.rate);
        expect(a.quantity).toBe(b.quantity);
    }

    const expectTableToHaveRows = (container: HTMLElement, amount: number) => {
        const rows = container.querySelectorAll<HTMLTableRowElement>('tbody tr');
        expect(rows.length).toBe(amount);
    }

    const getLastRow = (container: HTMLElement) => container
        .querySelector('table')
        .querySelector('tbody')
        .querySelector('tr:last-child')

    it("will render provided invoice details", () => {
        render(<InvoiceItemsTable {...props} />)

        props.details.forEach(detail => {
            expect(screen.getByDisplayValue(detail.detail)).toBeInTheDocument();
            expect(screen.getByDisplayValue(detail.quantity)).toBeInTheDocument();
            expect(screen.getByDisplayValue(detail.rate)).toBeInTheDocument();
        })
    });

    it("will trigger onChange with modified details", async () => {
        let newItems: InvoiceItemsTableProps['details'] | null = null;

        const changeHandler = (e: InvoiceItemsChangeEvent) => {
            newItems = e.items;
        }

        render(<InvoiceItemsTable {...props} onChange={changeHandler} />);

        const $detail1Desc = screen.getByDisplayValue(props.details[0].detail);
        const value = 'changed detail description';
        await act(async () => {
            fireEvent.change($detail1Desc, { target: { value } })
        });

        expect(newItems).not.toBeNull();
        expect(newItems).toHaveLength(props.details.length);
        expect(newItems[0].detail).toBe(value);
    })

    it("will delete an item when description is cleared", async () => {
        let newItems: InvoiceItemsTableProps['details'] | null = null;

        const changeHandler = (e: InvoiceItemsChangeEvent) => {
            newItems = e.items;
        }

        const { container } = render(<InvoiceItemsTable {...props} onChange={changeHandler} />);

        const $detail1Desc = screen.getByDisplayValue(props.details[0].detail);
        await act(async () => {
            fireEvent.change($detail1Desc, { target: { value: '' } })
        });

        expect(newItems).not.toBeNull();
        expect(newItems).toHaveLength(props.details.length - 1);

        props.details.slice(1)
            .forEach((item, idx) => expectItemsToBeEquals(newItems[0], item))

        // extra row for unfilled new item
        expectTableToHaveRows(container, newItems.length + 1);
    })

    it("add new row when all completed and valid", async () => {
        let newItems: InvoiceItemsTableProps['details'] | null = null;

        const changeHandler = (e: InvoiceItemsChangeEvent) => {
            newItems = e.items;
        }

        const { container } = render(<InvoiceItemsTable {...props} onChange={changeHandler} />);

        const lastRow = getLastRow(container);
        const $detail = lastRow.querySelector<HTMLInputElement>('[name=detail]');
        const $quantity = lastRow.querySelector<HTMLInputElement>('[name=quantity]');
        const $rate = lastRow.querySelector<HTMLInputElement>('[name=rate]');
        await act(async () => {

            fireEvent.change($detail, { target: { value: 'some detail' } })
            fireEvent.change($quantity, { target: { value: '5' } })
            fireEvent.change($rate, { target: { value: '50' } })
        });

        expect(newItems).not.toBeNull();
        expect(newItems).toHaveLength(props.details.length + 1);

        const newDetail = newItems.slice(-1).pop();

        expectItemsToBeEquals(newDetail, {
            detail: 'some detail',
            quantity: 5,
            rate: 50,
        });

        // extra row for unfilled new item
        expectTableToHaveRows(container, newItems.length + 1);
    })

})