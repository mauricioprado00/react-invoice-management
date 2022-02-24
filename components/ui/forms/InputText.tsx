import React, { forwardRef, useCallback, useState } from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export interface InputTextProps extends React.ComponentPropsWithoutRef<'input'> {
    label: string,
    required?: boolean,
    name: string,
    reset?: number,
    onValid?: (e: Event) => void,
    onChange?: (e: InputChangeEvent) => void,
};

export const InputTextPropTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    reset: PropTypes.string,
    required: PropTypes.bool,
    onValid: PropTypes.func,
    onChange: PropTypes.func,
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement>
{
    fieldName: string
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
    const [touch, setTouch] = useState(-1);
    const {
        label,
        name,
        reset = 0,
        required = false,
        value = '',
        onValid,
        onChange = null,
        ...inputProps
    } = props;
    const changeHandler = useCallback((e:InputChangeEvent) => {
        setTouch(reset);
        if (onChange) {
            e.fieldName = name;
            onChange(e);
        }
    }, [onChange, name, reset]);
    let errorMessage = '';
    const valid = false;

    if (touch === reset) {
        if (required === true) {
            if (value==='') {
                errorMessage = 'Please fill out this field.';
            }
        }
    }

    console.log(onValid);
    return <div className="mb-3 space-y-2 w-full text-xs">
        <label className="font-semibold text-gray-600 py-2">
            {label + " "}

            {required && <abbr title="required">*</abbr>}
        </label>
        <input
            ref={ref}
            value={value}
            onChange={changeHandler}
            name={name}
            {...inputProps}
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4"
            required={required} />
            <p className="text-red text-xs">{errorMessage}</p>
    </div>;
});

InputText.propTypes = InputTextPropTypes;

InputText.displayName = 'InputText';

export default InputText;
