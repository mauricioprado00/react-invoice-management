import React from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export type FieldsetRowProps = {
  children: any,
  alignRight?: boolean,
  testId?: string,
};

export const FieldsetRowPropTypes = {
  children: PropTypes.node.isRequired,
  alignRight: PropTypes.bool
}

function FieldsetRow({ children, alignRight = false, testId }: FieldsetRowProps) {
  if (alignRight) {
    return <div data-testid={testId} className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">{children}</div>
  }
  return <div data-testid={testId} className="md:flex flex-row md:space-x-4 w-full text-xs">{children}</div>;
}

FieldsetRow.propTypes = FieldsetRowPropTypes;

export default FieldsetRow;
