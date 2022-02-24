import React, { forwardRef } from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export interface InputTextProps extends React.ComponentPropsWithoutRef<'input'> {
    label: string,
    required?: boolean,
};

export const InputTextPropTypes = {
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
    const {
        label, 
        required = false,
        ...inputProps
    } = props;
    return <div className="mb-3 space-y-2 w-full text-xs">
        <label className="font-semibold text-gray-600 py-2">
            {label + " "}

            {required && <abbr title="required">*</abbr>}
        </label>
        <input 
            ref={ref}
            {...inputProps}
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4"
            required={required} />
        {required && <p className="text-red text-xs hidden">Please fill out this field.</p>}
    </div>;
});

InputText.propTypes = InputTextPropTypes;

InputText.displayName = 'InputText';

export default InputText;
