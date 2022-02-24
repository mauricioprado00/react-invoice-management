import React, { forwardRef, useCallback, useState } from "react";
import PropTypes from "prop-types";

// styles taken from https://tailwindcomponents.com/component/forms

export interface InputTextProps extends React.ComponentPropsWithoutRef<'input'> {
    label: string,
    required?: boolean,
    name: string,
    onValid?: (e: Event) => void,
    onChange?: (e: InputChangeEvent) => void,
};

export const InputTextPropTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    onValid: PropTypes.func,
    onChange: PropTypes.func,
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement>
{
    fieldName: string
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
    const [touch, setTouch] = useState(false);
    const {
        label,
        name,
        required = false,
        onValid,
        onChange = null,
        ...inputProps
    } = props;
    const changeHandler = useCallback((e:InputChangeEvent) => {
        setTouch(true);
        if (onChange) {
            e.fieldName = name;
            onChange(e);
        }
    }, [onChange, name]);
    const valid = false;

    console.log(onValid);
    return <div className="mb-3 space-y-2 w-full text-xs">
        <label className="font-semibold text-gray-600 py-2">
            {label + " "}

            {required && <abbr title="required">*</abbr>}
        </label>
        <input
            ref={ref}
            onChange={changeHandler}
            name={name}
            {...inputProps}
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4"
            required={required} />
        {required && touch && <p className="text-red text-xs hidden">Please fill out this field.</p>}
    </div>;
});

InputText.propTypes = InputTextPropTypes;

InputText.displayName = 'InputText';

export default InputText;
