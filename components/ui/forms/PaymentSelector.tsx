import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { InputLabel, MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material'
import classNames from 'classnames'
import { styled } from '@mui/system'
import { PaymentType, PaymentTypePropTypes } from 'models/Invoice'
import { FormElementProps, FormElementPropTypes } from 'hooks/use-form'

export type PaymentChangeEvent = {
    fieldName: string,
    payment: string,
}

export type PaymentSelectorProps = {
    label: string,
    required?: boolean,
    name: string,
    paymentTypes: PaymentType[],
    value: string,
} & Omit<SelectProps<string>, 'onChange'> & FormElementProps;

export const PaymentSelectorPropTypes = Object.assign(
    {},
    FormElementPropTypes,
    {
        label: PropTypes.string.isRequired,
        required: PropTypes.bool,
        name: PropTypes.string.isRequired,
        paymentTypes: PropTypes.arrayOf(PropTypes.exact(PaymentTypePropTypes)),
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

function PaymentSelector({ name, label, required, paymentTypes, value, onChange, onValid }: PaymentSelectorProps) {
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
                {paymentTypes.map(paymentType =>
                    <MenuItem key={paymentType.accountNumber}
                        value={paymentType.accountNumber}>
                        {paymentType.accountType} {paymentType.accountNumber}
                    </MenuItem>)}

            </CustomSelect>
        </div>
    )
}

PaymentSelector.propTypes = PaymentSelectorPropTypes

export default PaymentSelector
