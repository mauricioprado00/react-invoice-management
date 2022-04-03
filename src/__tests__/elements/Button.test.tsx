import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Button, { ButtonStyle } from "elements/Button";

/**
 * Chino, yo por lo general tiendo a hacer Unit Tests
 * sólo de funciones críticas.
 * Generalmente esto es de utils o tools.
 * Pero depende, supongo, de la cultura de cada projecto y de lo que decida
 * el Architecto.
 */

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
