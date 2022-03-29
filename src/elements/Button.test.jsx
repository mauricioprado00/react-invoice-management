import { fireEvent, render, screen } from "@testing-utility/react";
import React from "react";
import Button from "./Button";

describe("Button", () => {
  it("reanders the child nodes", () => {
    render(<Button>Some content</Button>);
    const element = screen.getByText(/Some content/i);
    expect(element).toBeInTheDocument();
  });
  it("will forward the onClick event", () => {
    let clicked = false;
    const clickHandler = () => {
      clicked = true;
    };
    render(<Button onClick={clickHandler}>Some content</Button>);
    fireEvent.click(screen.getByText("Some content"));
    expect(clicked).toBe(true);
  });
});
