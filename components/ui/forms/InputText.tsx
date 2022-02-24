import React, { forwardRef, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { validationMessage, Validator } from "library/validation";
import classNames from "classnames";

// styles taken from https://tailwindcomponents.com/component/forms
// and error styles from https://tailwindcomponents.com/component/tailwind-css-form-validation

export interface InputTextProps extends React.ComponentPropsWithoutRef<'input'> {
    label: string,
    required?: boolean,
    name: string,
    reset?: number,
    error?: string, // usefull for async validations
    onValid?: (e: Event) => void,
    onChange?: (e: InputChangeEvent) => void,
    validators?: Validator[]
};

export const InputTextPropTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    error: PropTypes.string,
    reset: PropTypes.number,
    required: PropTypes.bool,
    onValid: PropTypes.func,
    onChange: PropTypes.func,
    validators: PropTypes.arrayOf(PropTypes.func.isRequired)
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement>
{
    fieldName: string
}

export interface InputFocusEvent extends React.FocusEvent<HTMLInputElement>
{
    fieldName: string
}

const classes = {
    label: {
        invalid: 'text-red-700 dark:text-red-500',
        valid: 'text-green-700 dark:text-green-500',
        default: 'font-semibold py-2',
        noerror: 'text-gray-600',
    },
    input: {
        invalid: 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400',
        valid: 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700 focus:ring-green-500 focus:border-green-500 dark:bg-green-100 dark:border-green-400',
        default: 'appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4',
        noerror: '',
    }
}
// TODO extract shared logic to reuse in Select (and other FORM elements)
const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {

    // TODO useMemo.... and stuff.
    const labelClasses = [classes.label.default];
    const inputClasses = [classes.input.default];
    const [touch, setTouch] = useState(-1);
    const {
        label,
        name,
        reset = 0,
        required = false,
        value = '',
        validators = [],
        error = null,
        onValid,
        onChange = null,
        onBlur = null,
        ...inputProps
    } = props;
    const changeHandler = useCallback((e:InputChangeEvent) => {
        if (onChange) {
            e.fieldName = name;
            onChange(e);
        }
    }, [onChange, name]);
    const blurHandler = useCallback((e:InputFocusEvent) => {
        setTouch(reset);
        if (onBlur) {
            e.fieldName = name;
            onBlur(e);
        }
    }, [onBlur, name, reset]);
    let errorMessages = [];
    let expressErrors = false;

    if (touch === reset) {
        if (required === true) {
            if (value.toString().trim() === '') {
                errorMessages.push('Please fill out this field.');
            }
        }

        validators.forEach(validator => {
            let errorMessage = validator(value.toString());
            if (errorMessage) errorMessages.push(validationMessage(label, errorMessage));
        })

        expressErrors = true;
    } 

    if (error !== null) {
        expressErrors = true;
        errorMessages.push(error);
    }

    if (expressErrors) {
        if(errorMessages.length > 0) {
            labelClasses.push(classes.label.invalid);
            inputClasses.push(classes.input.invalid);
        } else {
            labelClasses.push(classes.label.valid);
            inputClasses.push(classes.input.valid);
        }
    } else {
        labelClasses.push(classes.label.noerror);
        inputClasses.push(classes.input.noerror);
    }

    return <div className="mb-3 space-y-2 w-full text-xs">
        <label className={classNames(...labelClasses)}>
            {label + " "}

            {required && <abbr title="required">*</abbr>}
        </label>
        <input
            ref={ref}
            value={value}
            onChange={changeHandler}
            onBlur={blurHandler}
            name={name}
            {...inputProps}
            className={classNames(...inputClasses)}
            required={required} />
            <p className="text-red text-xs text-red-600 dark:text-red-500">{errorMessages}</p>
    </div>;
});

InputText.propTypes = InputTextPropTypes;

InputText.displayName = 'InputText';

export default InputText;
