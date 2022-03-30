import { fireEvent, render, screen } from "@testing-library/react";
import { FormElementChangeEvent } from "hooks/use-form";
import React from "react";
import Dropdown, { DropdownOption } from "elements/Dropdown";

describe("Dropdown", () => {
    const options = [
        {
            value: '123456',
            text: "Swift 123456",
        },
        {
            value: '67890',
            text: "IBAN 67890",
        },
    ] as DropdownOption[];

    it("shows selected option", () => {
        options.forEach(option => {
            render(<div data-testid="ts"><Dropdown name="payment" label="Payment" options={options} value={option.value} /></div>);
            const optionEl = screen.getByText(option.text);
            expect(optionEl).toBeInTheDocument();
        })
    });
    it("shows options when clicked", () => {
        const { container } = render(<div data-testid="ts"><Dropdown name="payment" label="Payment" options={options} value="123456" /></div>);
        const button = container.querySelector('[role="button"]');
        fireEvent.mouseDown(button);
        options.forEach(option => {
            const optionEl = screen.getByText(option.text, { selector: '[role="presentation"] *' });
            expect(optionEl).toBeInTheDocument();
        })
    });
    it("gives the payment id when selected", () => {
        let paymentId = '';
        const handleChange = (e: FormElementChangeEvent) => paymentId = e.target.value;
        const { container } = render(<Dropdown onChange={handleChange} name="payment" label="Payment" options={options} value="123456" />);
        const button = container.querySelector('[role="button"]');
        fireEvent.mouseDown(button);
        fireEvent.click(screen.getByText('IBAN 67890'));
        expect(paymentId).toBe('67890')
    })
});
