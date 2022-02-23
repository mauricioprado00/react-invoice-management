import React from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export type FormProps = {
  children: any,
};

export const FormPropTypes = {
  children: PropTypes.node
}

function Form(props: FormProps) {
  return <div className="form">{props.children}</div>;
}

Form.propTypes = FormPropTypes;

export default Form;
