import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Button, { ButtonStyle } from "elements/Button";

describe("Button", () => {
  const props = {
    styled: ButtonStyle.FlatPrimary,
  }
  it("reanders the child nodes", () => {
    render(<Button {...props}>Some content</Button>);
    const element = screen.getByText(/Some content/i);
    expect(element).toBeInTheDocument();
  });
  it("will forward the onClick event", () => {
    let clicked = false;
    const clickHandler = () => {
      clicked = true;
    };
    render(<Button onClick={clickHandler} {...props}>Some content</Button>);
    fireEvent.click(screen.getByText("Some content"));
    expect(clicked).toBe(true);
  });
});
