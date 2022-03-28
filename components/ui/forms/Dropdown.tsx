import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material'
import classNames from 'classnames'
import { styled } from '@mui/system'
import { FormElementProps, FormElementPropTypes } from 'hooks/use-form'

export type DropdownOption = {
    value: string;
    text: string;
}

export type DropdownProps = {
    label: string,
    required?: boolean,
    name: string,
    options: DropdownOption[],
    value: string,
} & Omit<SelectProps<string>, 'onChange'> & FormElementProps;

export const DropdownOptionPropTypes = {
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
}

export const DropdownPropTypes = Object.assign(
    {},
    FormElementPropTypes,
    {
        label: PropTypes.string.isRequired,
        required: PropTypes.bool,
        name: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.exact(DropdownOptionPropTypes)),
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func,
    }
)

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

const CustomSelect = styled(Select)(`
width: 100%;
height: 2.5rem;
`)

function Dropdown({ name, label, required, options, value, onChange, onValid }: DropdownProps) {
    const labelClasses = [classes.label.default, classes.label.noerror];
    const handleChange = useCallback((e: SelectChangeEvent<unknown>) => {
        if (onChange) {
            onChange({
                fieldName: name,
                target: {
                    value: e.target.value as string,
                }
            })
        }
    }, [onChange, name]);

    useEffect(() => {
        if (onValid) {
            onValid(name, !required || Boolean(value))
        }
    }, [name, onValid, required, value]);

    return (
        <div className="mb-3 space-y-2 w-full text-xs">
            <label className={classNames(...labelClasses)}>
                {label + " "}
                {required && <abbr title="required">*</abbr>}
            </label>
            <CustomSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={handleChange}
                value={value}
            >
                {options.map(option =>
                    <MenuItem key={option.value}
                        value={option.value}>
                        {option.text}
                    </MenuItem>)}

            </CustomSelect>
        </div>
    )
}

Dropdown.propTypes = DropdownPropTypes

export default Dropdown
