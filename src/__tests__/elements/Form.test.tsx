import { render, screen } from "@testing-library/react";
import React from "react";
import Form from "elements/Form"

describe("Button", () => {
  it("reanders the child nodes", () => {
    render(<Form>Some content</Form>);
    const element = screen.getByText(/Some content/i);
    expect(element).toBeInTheDocument();
  });
});
