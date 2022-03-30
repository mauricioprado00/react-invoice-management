import { render, screen } from "@testing-library/react";
import React from "react";
import Select from "elements/Select";

describe("Select", () => {
  const options = [{ value: "test-value", label: "Test" }];
  it("reanders default placeholder", () => {
    render(<Select options={options} label="test" />);
    const element = screen.getByDisplayValue("select option");
    expect(element).toBeInTheDocument();
  });
  it("reanders custom placeholder", () => {
    render(<Select options={options} label="test" placeholder="my custom placeholder" />);
    const element = screen.getByDisplayValue("my custom placeholder");
    expect(element).toBeInTheDocument();
  });

  it("reanders the given options", () => {
    render(<div data-testid="ts"><Select options={options} label="test" /></div>);
    const element = screen.getByTestId<HTMLDivElement>("ts");
    expect(element).toBeInTheDocument();
    const optionList = element.querySelectorAll('option');
    const option = optionList[1];
    expect(option?.value).toBe('test-value');
  });
});
