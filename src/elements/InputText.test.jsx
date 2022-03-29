import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputText from "./InputText";

describe("InputText", () => {
  it("reanders the given value", () => {
    render(<InputText value="someValue" name="test" />);
    const element = screen.getByDisplayValue("someValue");
    expect(element).toBeInTheDocument();
  });

  it("renders the placeholder", () => {
    render(<InputText name="test" placeholder="Email ID" />);
    const element = screen.getByPlaceholderText("Email ID");
    expect(element).toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    render(
      <div data-testid="testsubject">
        <InputText name="email" label="Email Label" />
      </div>
    );
    const element = screen.getByTestId("testsubject");
    expect(element).toBeInTheDocument();
    expect(element.querySelectorAll("label").length).toBe(1);
  });

  it("doesn't render the label when not provided", () => {
    render(
      <div data-testid="testsubject">
        <InputText name="email" />
      </div>
    );
    const element = screen.getByTestId("testsubject");
    expect(element).toBeInTheDocument();
    expect(element.querySelectorAll("label").length).toBe(0);
  });
});
