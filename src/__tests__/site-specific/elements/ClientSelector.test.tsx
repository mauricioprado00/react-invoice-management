import { fireEvent, render, screen } from "@testing-library/react";
import { FormElementChangeEvent } from "hooks/use-form";
import React from "react";
import ClientSelector from "site-specific/elements/ClientSelector";

describe("ClientSelector", () => {
  const clientList = [
    {
      id: 'mocked-client-id-123',
      user_id: '22',
      name: "John Doe",
      email: "john.doe@gmail.com",
      companyDetails: {
        name: "ABC co",
        vatNumber: "123",
        regNumber: "456",
        address: 'Street Av. 1',
      },
    }
  ]
  it("shows options when clicked", () => {
    render(<div data-testid="ts"><ClientSelector name="client" clientList={clientList} /></div>);
    const element = screen.getByTestId('ts');
    const button = element.querySelector('button');
    expect(button).toBeInTheDocument();
    if (button) fireEvent.click(button);
    const option = screen.getByText('John Doe');
    expect(option).toBeInTheDocument();
  });
  it("doesn't shows options initially", async () => {
    render(<div data-testid="ts"><ClientSelector name="client" clientList={clientList} /></div>);
    const element = screen.getByTestId('ts');
    const button = element.querySelector('button');
    expect(button).toBeInTheDocument();
    const option = screen.queryByText('John Doe');
    expect(option).toBeFalsy();
  });
  it("hide options when clicked second time", () => {
    render(<div data-testid="ts"><ClientSelector name="client" clientList={clientList} /></div>);
    const element = screen.getByTestId('ts');
    const button = element.querySelector('button');
    expect(button).toBeInTheDocument();
    if (button) fireEvent.click(button);
    const option = screen.getByText('John Doe');
    expect(option).toBeInTheDocument();
    if (button) fireEvent.click(button);
    expect(option).not.toBeInTheDocument();
  });
  it("gives the client id when selected", () => {
    let clientId = '';
    const handleChange = (e: FormElementChangeEvent) => clientId = e.target.value;
    render(<div data-testid="ts"><ClientSelector onChange={handleChange} name="client" clientList={clientList} /></div>);
    const element = screen.getByTestId('ts');
    const button = element.querySelector('button');
    expect(button).toBeInTheDocument();
    if (button) fireEvent.click(button);
    const option = screen.getByText('John Doe');
    fireEvent.click(option);
    expect(clientId).toBe('mocked-client-id-123')
  })
});
