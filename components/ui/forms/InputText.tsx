import React from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export type InputTextProps = {
    label: string,
    required?: boolean,
    placeholder?: string,
};

export const InputTextPropTypes = {
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
}

function InputText({ label, required = false, placeholder=label }: InputTextProps) {
    return <div className="mb-3 space-y-2 w-full text-xs">
        <label className="font-semibold text-gray-600 py-2">
            {label + " "}
            
            {required && <abbr title="required">*</abbr>}
        </label>
        <input placeholder={placeholder} className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4"
            required={required} type="text" />
        {required && <p className="text-red text-xs hidden">Please fill out this field.</p>}
    </div>;
}

InputText.propTypes = InputTextPropTypes;

export default InputText;
