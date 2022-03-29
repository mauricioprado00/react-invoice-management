import PropTypes from "prop-types";
import { SerializedError as rjstSerializedError } from "@reduxjs/toolkit";

export type SerializedError = rjstSerializedError;

// React PropTypes definitions for components

export const SerializedErrorPropTypes = {
  name: PropTypes.string,
  message: PropTypes.string,
  stack: PropTypes.string,
  code: PropTypes.string,
};
