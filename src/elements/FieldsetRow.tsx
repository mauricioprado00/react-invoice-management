import React from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export type FieldsetRowProps = {
  children: any,
  alignRight?: boolean
};

export const FieldsetRowPropTypes = {
  children: PropTypes.node.isRequired,
  alignRight: PropTypes.bool
}

function FieldsetRow({children, alignRight=false}: FieldsetRowProps) {
  if (alignRight) {
    return <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">{children}</div>
  }
  return <div className="md:flex flex-row md:space-x-4 w-full text-xs">{children}</div>;
}

FieldsetRow.propTypes = FieldsetRowPropTypes;

export default FieldsetRow;
